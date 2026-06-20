import { getEffectiveConfig } from './config.js';
import { pad, minutesToTime, timeToMinutes, getCurrentTimeStr } from './utils.js';
import {
  loadSchedule,
  saveSchedule,
  clearSchedule,
  clearNotifiedKeys,
  isExpired,
  loadSettings,
  saveSettings,
} from './storage.js';
import {
  elements,
  showWelcome,
  showSetup,
  showDashboard,
  showSettings,
  hideSettings,
  showToast,
  showSettingsWarning,
  updateSetupDropName,
  renderDashboard,
  renderSettingsScreen,
} from './ui.js';
import {
  registerServiceWorker,
  updateNotificationBanner,
  startNotificationChecker,
  sendNotification,
} from './notifications.js';

let schedule = null;
let pendingRecalc = null;
let previousScreen = 'setup';
let cameFromWelcome = false;
const TOLERANCE_MINUTES = 10;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getScheduleConfig() {
  return schedule?.config || getEffectiveConfig();
}

function generateSchedule(startTimeStr) {
  const config = getEffectiveConfig();
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  const baseMinutes = hours * 60 + minutes;
  const doses = [];

  for (let cycle = 0; cycle < config.cycles; cycle++) {
    const cycleBase = baseMinutes + cycle * config.cycleGapHours * 60;
    config.drops.forEach((drop, dropIndex) => {
      doses.push({
        cycle,
        dropIndex,
        time: minutesToTime(cycleBase + drop.offsetMinutes),
        taken: false,
      });
    });
  }

  schedule = {
    createdAt: new Date().toISOString(),
    startTime: startTimeStr,
    config: {
      drops: config.drops.map((drop) => ({ ...drop })),
      cycles: config.cycles,
      cycleGapHours: config.cycleGapHours,
    },
    doses,
  };
  saveSchedule(schedule);
}

function handleToggleDose(index) {
  if (!schedule) return;
  const dose = schedule.doses[index];

  if (dose.taken) {
    dose.taken = false;
    saveSchedule(schedule);
    renderCurrentDashboard();
    return;
  }

  const actualTime = getCurrentTimeStr();
  const scheduledTime = dose.time;
  const actualMin = timeToMinutes(actualTime);
  const scheduledMin = timeToMinutes(scheduledTime);

  let delta = actualMin - scheduledMin;
  if (delta > 720) delta -= 1440;
  if (delta < -720) delta += 1440;

  const absDelta = Math.abs(delta);

  if (absDelta >= TOLERANCE_MINUTES) {
    const hasFutureDoses = schedule.doses.some((item, doseIndex) => doseIndex !== index && !item.taken);

    if (hasFutureDoses) {
      const direction = delta > 0 ? 'in ritardo' : 'in anticipo';
      const drop = getScheduleConfig().drops[dose.dropIndex];
      elements.recalcMessage.innerHTML = `Hai preso <strong class="text-white">${escapeHtml(drop.name)}</strong> alle <strong class="text-white">${actualTime}</strong> invece delle <strong class="text-white">${scheduledTime}</strong> (${absDelta} min ${direction}).<br><br>Vuoi ricalcolare gli orari dei prossimi colliri?`;

      pendingRecalc = { index, deltaMinutes: delta };
      elements.recalcModal.classList.remove('hidden');
      return;
    }
  }

  dose.taken = true;
  saveSchedule(schedule);
  renderCurrentDashboard();
}

function handleRecalcYes() {
  if (!pendingRecalc || !schedule) return;
  const { index, deltaMinutes } = pendingRecalc;

  schedule.doses[index].taken = true;

  schedule.doses.forEach((dose, doseIndex) => {
    if (doseIndex !== index && !dose.taken) {
      const currentMin = timeToMinutes(dose.time);
      dose.time = minutesToTime(currentMin + deltaMinutes);
    }
  });

  pendingRecalc = null;
  elements.recalcModal.classList.add('hidden');
  saveSchedule(schedule);
  renderCurrentDashboard();
}

function handleRecalcNo() {
  if (!pendingRecalc || !schedule) return;
  const { index } = pendingRecalc;

  schedule.doses[index].taken = true;
  pendingRecalc = null;
  elements.recalcModal.classList.add('hidden');
  saveSchedule(schedule);
  renderCurrentDashboard();
}

function isScheduleComplete(currentSchedule) {
  if (!currentSchedule) return false;

  if (Array.isArray(currentSchedule)) {
    return currentSchedule.length > 0 && currentSchedule.every((turn) =>
      Array.isArray(turn.doses) && turn.doses.length > 0 && turn.doses.every((dose) => dose.taken)
    );
  }

  return Array.isArray(currentSchedule.doses)
    && currentSchedule.doses.length > 0
    && currentSchedule.doses.every((dose) => dose.taken);
}

function handleNewDay() {
  clearSchedule();
  clearNotifiedKeys();
  schedule = null;
  showSetup();
}

function renderCurrentDashboard() {
  renderDashboard(schedule, handleToggleDose, isScheduleComplete(schedule), handleNewDay);
}

function updateAppView() {
  showDashboard();
  renderCurrentDashboard();
  updateNotificationBanner();
  startNotificationChecker();
}

function openSettings(fromScreen) {
  previousScreen = fromScreen;
  showSettingsWarning(false);
  const config = getEffectiveConfig();
  renderSettingsScreen(cameFromWelcome ? { ...config, drops: [] } : config, handleSaveSettings);
  showSettings();
}

function closeSettings() {
  hideSettings();
  if (cameFromWelcome) {
    const settings = loadSettings();
    if (settings) {
      cameFromWelcome = false;
      previousScreen = 'setup';
      updateSetupDropName(settings);
      showSetup();
    } else {
      showWelcome();
    }
    return;
  }

  if (previousScreen === 'dashboard' && schedule) {
    showDashboard();
    renderCurrentDashboard();
  } else {
    showSetup();
  }
}

function handleSaveSettings(newConfig) {
  // A legacy active schedule did not contain its own config snapshot. Preserve it
  // before saving new settings so the current dashboard remains unchanged.
  if (schedule && !schedule.config) {
    const currentConfig = getEffectiveConfig();
    schedule.config = {
      drops: currentConfig.drops.map((drop) => ({ ...drop })),
      cycles: currentConfig.cycles,
      cycleGapHours: currentConfig.cycleGapHours,
    };
    saveSchedule(schedule);
  }

  saveSettings(newConfig);
  updateSetupDropName(newConfig);

  if (cameFromWelcome) {
    cameFromWelcome = false;
    previousScreen = 'setup';
    showSetup();
    showToast('✓ Impostazioni salvate! Genera il programma di oggi.');
    return;
  }

  showSettingsWarning(Boolean(schedule));
}

// Event Listeners
elements.btnUseNow.addEventListener('click', () => {
  const now = new Date();
  elements.startTimeInput.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

elements.btnGenerate.addEventListener('click', () => {
  const value = elements.startTimeInput.value;
  if (!value) {
    elements.startTimeInput.focus();
    return;
  }
  generateSchedule(value);
  updateAppView();
});

elements.btnGoToSettings.addEventListener('click', () => {
  cameFromWelcome = true;
  openSettings('welcome');

  if (window.history && window.history.pushState) {
    window.history.pushState({ screen: 'settings', from: 'welcome' }, '');
  }
});

elements.btnSettingsSetup.addEventListener('click', () => openSettings('setup'));
elements.btnSettingsDashboard.addEventListener('click', () => openSettings('dashboard'));
elements.btnSettingsBack.addEventListener('click', closeSettings);

elements.btnReset.addEventListener('click', () => {
  elements.confirmModal.classList.remove('hidden');
});

elements.btnCancelReset.addEventListener('click', () => {
  elements.confirmModal.classList.add('hidden');
});

elements.btnConfirmReset.addEventListener('click', () => {
  elements.confirmModal.classList.add('hidden');
  clearSchedule();
  schedule = null;
  showSetup();
});

elements.confirmModal.addEventListener('click', (event) => {
  if (event.target === elements.confirmModal) elements.confirmModal.classList.add('hidden');
});

elements.btnRecalcYes.addEventListener('click', handleRecalcYes);
elements.btnRecalcNo.addEventListener('click', handleRecalcNo);

elements.recalcModal.addEventListener('click', (event) => {
  if (event.target === elements.recalcModal) handleRecalcNo();
});

elements.btnEnableNotifications.addEventListener('click', async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log('[Notifiche] Permesso:', permission);
    updateNotificationBanner();
    if (permission === 'granted') {
      sendNotification(
        '✅ Promemoria attivati!',
        'Riceverai le notifiche per ogni collirio.',
        'test-notification'
      );
    }
  } catch (error) {
    console.warn('[Notifiche] Errore richiesta permesso:', error);
  }
});

window.addEventListener('popstate', () => {
  if (!elements.settingsScreen.classList.contains('hidden') && cameFromWelcome) {
    hideSettings();
    showWelcome();
  }
});

// Init
async function init() {
  await registerServiceWorker();
  updateNotificationBanner();
  startNotificationChecker();

  const settings = loadSettings();
  const data = loadSchedule();

  if (!settings) {
    showWelcome();
    return;
  }

  updateSetupDropName(settings);

  if (!data || isExpired(data)) {
    if (data) clearSchedule();
    schedule = null;
    showSetup();
    return;
  }

  schedule = data.schedule || data;
  if (!schedule.config) {
    schedule.config = {
      drops: settings.drops.map((drop) => ({ ...drop })),
      cycles: settings.cycles,
      cycleGapHours: settings.cycleGapHours,
    };
    saveSchedule(schedule);
  }

  renderCurrentDashboard();
  showDashboard();
}

init();

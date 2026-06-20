import { getEffectiveConfig } from './config.js';
import { pad, minutesToTime, timeToMinutes, getCurrentTimeStr } from './utils.js';
import {
  loadSchedule,
  saveSchedule,
  clearSchedule,
  isExpired,
  saveSettings,
} from './storage.js';
import {
  elements,
  showSetup,
  showDashboard,
  showSettings,
  hideSettings,
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
    renderDashboard(schedule, handleToggleDose);
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
  renderDashboard(schedule, handleToggleDose);
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
  renderDashboard(schedule, handleToggleDose);
}

function handleRecalcNo() {
  if (!pendingRecalc || !schedule) return;
  const { index } = pendingRecalc;

  schedule.doses[index].taken = true;
  pendingRecalc = null;
  elements.recalcModal.classList.add('hidden');
  saveSchedule(schedule);
  renderDashboard(schedule, handleToggleDose);
}

function updateAppView() {
  showDashboard();
  renderDashboard(schedule, handleToggleDose);
  updateNotificationBanner();
  startNotificationChecker();
}

function openSettings(fromScreen) {
  previousScreen = fromScreen;
  showSettingsWarning(false);
  renderSettingsScreen(getEffectiveConfig(), handleSaveSettings);
  showSettings();
}

function closeSettings() {
  hideSettings();
  if (previousScreen === 'dashboard' && schedule) {
    showDashboard();
    renderDashboard(schedule, handleToggleDose);
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

// Init
(function init() {
  registerServiceWorker();

  // Load the effective settings before reading or generating any schedule.
  const effectiveConfig = getEffectiveConfig();
  updateSetupDropName(effectiveConfig);

  const saved = loadSchedule();
  if (saved && !isExpired(saved)) {
    schedule = saved;
    if (!schedule.config) {
      schedule.config = {
        drops: effectiveConfig.drops.map((drop) => ({ ...drop })),
        cycles: effectiveConfig.cycles,
        cycleGapHours: effectiveConfig.cycleGapHours,
      };
      saveSchedule(schedule);
    }
    updateAppView();
  } else {
    if (saved) clearSchedule();
    showSetup();
  }
})();

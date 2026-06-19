import { DROPS, CYCLES, CYCLE_GAP_HOURS } from './config.js';
import { pad, minutesToTime, timeToMinutes, getCurrentTimeStr } from './utils.js';
import { loadSchedule, saveSchedule, clearSchedule, isExpired } from './storage.js';
import { elements, showSetup, showDashboard, renderDashboard } from './ui.js';
import { registerServiceWorker, updateNotificationBanner, startNotificationChecker, sendNotification } from './notifications.js';

let schedule = null;
let pendingRecalc = null;
const TOLERANCE_MINUTES = 10;

function generateSchedule(startTimeStr) {
  const [h, m] = startTimeStr.split(':').map(Number);
  const baseMinutes = h * 60 + m;
  const doses = [];

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const cycleBase = baseMinutes + cycle * CYCLE_GAP_HOURS * 60;
    DROPS.forEach((drop, idx) => {
      doses.push({
        cycle,
        dropIndex: idx,
        time: minutesToTime(cycleBase + drop.offsetMinutes),
        taken: false,
      });
    });
  }

  schedule = {
    createdAt: new Date().toISOString(),
    startTime: startTimeStr,
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
    const hasFutureDoses = schedule.doses.some((d, i) => i !== index && !d.taken);

    if (hasFutureDoses) {
      const direction = delta > 0 ? 'in ritardo' : 'in anticipo';
      const drop = DROPS[dose.dropIndex];
      elements.recalcMessage.innerHTML = `Hai preso <strong class="text-white">${drop.name}</strong> alle <strong class="text-white">${actualTime}</strong> invece delle <strong class="text-white">${scheduledTime}</strong> (${absDelta} min ${direction}).<br><br>Vuoi ricalcolare gli orari dei prossimi colliri?`;

      pendingRecalc = { index, actualTime, scheduledTime, deltaMinutes: delta };
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

  schedule.doses.forEach((d, i) => {
    if (i !== index && !d.taken) {
      const currentMin = timeToMinutes(d.time);
      d.time = minutesToTime(currentMin + deltaMinutes);
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

// Event Listeners
elements.btnUseNow.addEventListener('click', () => {
  const now = new Date();
  elements.startTimeInput.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

elements.btnGenerate.addEventListener('click', () => {
  const val = elements.startTimeInput.value;
  if (!val) {
    elements.startTimeInput.focus();
    return;
  }
  generateSchedule(val);
  updateAppView();
});

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

elements.confirmModal.addEventListener('click', (e) => {
  if (e.target === elements.confirmModal) elements.confirmModal.classList.add('hidden');
});

elements.btnRecalcYes.addEventListener('click', handleRecalcYes);
elements.btnRecalcNo.addEventListener('click', handleRecalcNo);

elements.recalcModal.addEventListener('click', (e) => {
  if (e.target === elements.recalcModal) handleRecalcNo();
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
  } catch (err) {
    console.warn('[Notifiche] Errore richiesta permesso:', err);
  }
});

// Init
(function init() {
  registerServiceWorker();

  const saved = loadSchedule();
  if (saved && !isExpired(saved)) {
    schedule = saved;
    updateAppView();
  } else {
    if (saved) clearSchedule();
    showSetup();
  }
})();

import {
  COLOR_MAP,
  getEffectiveConfig,
  MAX_CYCLE_GAP_HOURS,
  MAX_CYCLES,
  MAX_NOTE_LENGTH,
  MAX_OFFSET_MINUTES,
} from './config.js';
import { daysRemaining, loadSchedule, loadSettings } from './storage.js';
import { formatDateIT, minutesToTime } from './utils.js';

// DOM Elements
export const elements = {
  welcomeScreen: document.getElementById('welcomeScreen'),
  setupScreen: document.getElementById('setup-screen'),
  dashboardScreen: document.getElementById('dashboard-screen'),
  therapyExpiredScreen: document.getElementById('therapyExpiredScreen'),
  countdownBanner: document.getElementById('countdownBanner'),
  settingsScreen: document.getElementById('settings-screen'),
  settingsContainer: document.getElementById('settings-container'),
  settingsWarning: document.getElementById('settings-warning'),
  setupSubtitle: document.getElementById('setup-subtitle'),
  setupIconContainer: document.getElementById('setup-icon-container'),
  startHourInput: document.getElementById('start-hour'),
  startMinuteInput: document.getElementById('start-minute'),
  setupTimeHint: document.getElementById('setup-time-hint'),
  setupTimeError: document.getElementById('setup-time-error'),
  setupFirstDropName: document.getElementById('setup-first-drop-name'),
  btnUseNow: document.getElementById('btn-use-now'),
  btnGenerate: document.getElementById('btn-generate'),
  btnGoToSettings: document.getElementById('btnGoToSettings'),
  btnReset: document.getElementById('btn-reset'),
  btnSettingsSetup: document.getElementById('btn-settings-setup'),
  btnSettingsDashboard: document.getElementById('btn-settings-dashboard'),
  btnSettingsBack: document.getElementById('btn-settings-back'),
  btnCancelReset: document.getElementById('btn-cancel-reset'),
  btnConfirmReset: document.getElementById('btn-confirm-reset'),
  confirmModal: document.getElementById('confirm-modal'),
  scheduleContainer: document.getElementById('schedule-container'),
  headerDate: document.getElementById('header-date'),
  progressBar: document.getElementById('progress-bar'),
  progressLabel: document.getElementById('progress-label'),
  recalcModal: document.getElementById('recalc-modal'),
  recalcMessage: document.getElementById('recalc-message'),
  btnRecalcYes: document.getElementById('btn-recalc-yes'),
  btnRecalcNo: document.getElementById('btn-recalc-no'),
  notifBanner: document.getElementById('notification-banner'),
  notifAsk: document.getElementById('notif-ask'),
  notifGranted: document.getElementById('notif-granted'),
  notifDenied: document.getElementById('notif-denied'),
  notifUnsupported: document.getElementById('notif-unsupported'),
  btnEnableNotifications: document.getElementById('btn-enable-notifications'),
};

const COLOR_NAMES = Object.keys(COLOR_MAP).filter((color) => color !== 'emerald');
const PREVIEW_START_MINUTES = 8 * 60;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeColor(color) {
  return Object.prototype.hasOwnProperty.call(COLOR_MAP, color) ? color : 'sky';
}

function clampOffset(value) {
  const number = Number(value);
  if (!Number.isInteger(number)) return 0;
  return Math.min(MAX_OFFSET_MINUTES, Math.max(0, number));
}

function clampActiveCycles(value, maxCycles) {
  const limit = Number.isInteger(Number(maxCycles))
    ? Math.min(MAX_CYCLES, Math.max(1, Number(maxCycles)))
    : MAX_CYCLES;
  const number = Number(value);
  if (!Number.isInteger(number)) return limit;
  return Math.min(limit, Math.max(1, number));
}

function parseDateOnly(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatEndDateIT(value) {
  const date = parseDateOnly(value);
  return date ? formatDateIT(date) : '';
}

function getPreviousStartTime() {
  const data = loadSchedule();
  const startTime = data?.startTime
    ?? data?.schedule?.startTime
    ?? data?.schedule?.[0]?.doses?.[0]?.time
    ?? data?.schedule?.doses?.[0]?.time
    ?? data?.doses?.[0]?.time
    ?? null;

  return /^\d{2}:\d{2}$/.test(startTime || '') ? startTime : null;
}

export function showWelcome() {
  elements.welcomeScreen.classList.remove('hidden');
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.therapyExpiredScreen.classList.add('hidden');
  elements.settingsScreen.classList.add('hidden');
}

export function showSetup() {
  const settings = loadSettings();
  const firstDropName = settings?.drops?.[0]?.name;
  if (elements.setupSubtitle) {
    elements.setupSubtitle.textContent = firstDropName
      ? `A che ora hai preso ${firstDropName} stamattina?`
      : "Imposta l'orario del primo collirio di oggi.";
  }

  if (elements.setupIconContainer) {
    elements.setupIconContainer.className = 'inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#1e293b] border border-slate-700/70 mb-5';
  }

  const previousStartTime = getPreviousStartTime();
  const defaultStartTime = previousStartTime || '08:00';
  const [hour, minute] = defaultStartTime.split(':');
  if (elements.startHourInput) elements.startHourInput.value = hour;
  if (elements.startMinuteInput) elements.startMinuteInput.value = minute;
  if (elements.setupTimeHint) {
    elements.setupTimeHint.textContent = previousStartTime ? `Ieri hai iniziato alle ${previousStartTime}` : '';
    elements.setupTimeHint.classList.toggle('hidden', !previousStartTime);
  }
  elements.setupTimeError?.classList.add('hidden');

  elements.welcomeScreen.classList.add('hidden');
  elements.setupScreen.classList.remove('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.therapyExpiredScreen.classList.add('hidden');
  elements.settingsScreen.classList.add('hidden');
}

export function showDashboard() {
  elements.welcomeScreen.classList.add('hidden');
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.remove('hidden');
  elements.therapyExpiredScreen.classList.add('hidden');
  elements.settingsScreen.classList.add('hidden');
}

export function showSettings() {
  elements.welcomeScreen.classList.add('hidden');
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.therapyExpiredScreen.classList.add('hidden');
  elements.settingsScreen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function showTherapyExpired() {
  elements.welcomeScreen.classList.add('hidden');
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.therapyExpiredScreen.classList.remove('hidden');
  elements.settingsScreen.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function hideTherapyExpired() {
  elements.therapyExpiredScreen.classList.add('hidden');
}

export function hideSettings() {
  elements.settingsScreen.classList.add('hidden');
}

export function showSettingsWarning(show) {
  elements.settingsWarning.classList.toggle('hidden', !show);
}

export function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed left-1/2 bottom-6 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-4 text-center font-bold text-emerald-200 shadow-2xl backdrop-blur fade-in-up';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity');
    window.setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function updateSetupDropName(config = getEffectiveConfig()) {
  if (!elements.setupFirstDropName) return;
  elements.setupFirstDropName.textContent = config.drops[0]?.name || 'primo collirio';
}

export function renderCountdownBanner(settings) {
  if (!elements.countdownBanner) return;

  const days = daysRemaining(settings);
  if (days === null) {
    elements.countdownBanner.className = 'hidden';
    elements.countdownBanner.textContent = '';
    return;
  }

  let text = '';
  let styleClass = 'bg-[#1e293b] border-slate-700 text-white';

  if (days > 3) {
    text = days + ' giorni rimanenti alla fine della terapia';
  } else if (days > 1) {
    text = '⚠️ Ultimi ' + days + ' giorni di terapia';
    styleClass = 'bg-amber-500/15 border-amber-500/40 text-amber-100';
  } else if (days === 1) {
    text = '⚠️ Ultimo giorno di terapia';
    styleClass = 'bg-red-500/15 border-red-500/40 text-red-100';
  } else {
    text = '⚠️ La terapia termina oggi';
    styleClass = 'bg-red-500/15 border-red-500/40 text-red-100';
  }

  elements.countdownBanner.className = 'max-w-lg mx-auto px-4 mt-5';
  elements.countdownBanner.innerHTML = '<div class="rounded-2xl border ' + styleClass + ' px-5 py-4 text-center text-base sm:text-lg font-extrabold shadow-xl" role="status">'
    + escapeHtml(text)
    + '</div>';
}

export function renderTherapyExpiredScreen(settings) {
  const formattedDate = formatEndDateIT(settings?.endDate);
  elements.therapyExpiredScreen.innerHTML = [
    '<section class="min-h-screen flex items-center justify-center px-4 py-10 bg-[#0f172a]">',
    '  <div class="w-full max-w-md text-center fade-in-up">',
    '    <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 mb-6">',
    '      <span class="text-5xl text-emerald-300" aria-hidden="true">✓</span>',
    '    </div>',
    '    <div class="bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/60">',
    '      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Terapia Completata</h1>',
    '      <p class="mt-4 text-lg text-slate-300 leading-relaxed">La tua terapia è terminata il <strong class="text-white">' + escapeHtml(formattedDate) + '</strong>.</p>',
    '      <p class="mt-3 text-xl font-extrabold text-emerald-300">Ottimo lavoro!</p>',
    '      <button id="btnNewTherapy" type="button" class="w-full mt-7 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xl rounded-2xl p-5 shadow-lg shadow-sky-600/30 transition-colors">Inizia Nuova Terapia</button>',
    '      <button id="btnEditTherapySettings" type="button" class="w-full mt-4 border-2 border-slate-600 hover:border-sky-500 hover:bg-sky-500/10 text-slate-200 hover:text-sky-200 font-extrabold text-xl rounded-2xl p-5 transition-colors">Modifica Impostazioni</button>',
    '    </div>',
    '  </div>',
    '</section>',
  ].join('');
}

export function renderDashboard(schedule, onToggleDose, isComplete = false, onNewDay = null) {
  if (!schedule) return;

  const config = schedule.config || getEffectiveConfig();
  const drops = config.drops;
  const savedDrops = loadSettings()?.drops || [];

  elements.headerDate.textContent = formatDateIT(new Date(schedule.createdAt));

  const totalDoses = schedule.doses.length;
  const takenCount = schedule.doses.filter((dose) => dose.taken).length;
  elements.progressLabel.textContent = `${takenCount} / ${totalDoses}`;
  elements.progressBar.style.width = `${totalDoses ? (takenCount / totalDoses) * 100 : 0}%`;
  elements.progressBar.style.background = isComplete ? '#10b981' : '';

  let completionHint = document.getElementById('completion-hint-top');
  if (!completionHint) {
    completionHint = document.createElement('div');
    completionHint.id = 'completion-hint-top';
    elements.progressBar.parentElement.insertAdjacentElement('afterend', completionHint);
  }

  if (isComplete) {
    completionHint.className = 'flex h-11 items-center justify-between gap-3 overflow-hidden text-sm font-bold';
    completionHint.innerHTML = `
      <span class="flex items-center gap-2 text-emerald-300">
        <span aria-hidden="true">✓</span>
        <span>Tutto completato oggi!</span>
      </span>
      <button id="btnNewDayTop" type="button" class="shrink-0 text-right text-sky-300 hover:text-sky-200 font-extrabold transition-colors">
        Crea Programma per Domani →
      </button>
    `;
  } else {
    completionHint.className = 'hidden';
    completionHint.innerHTML = '';
  }
  elements.scheduleContainer.innerHTML = '';

  for (let cycle = 0; cycle < config.cycles; cycle++) {
    const cycleDoses = schedule.doses.filter((dose) => dose.cycle === cycle);
    const cycleTaken = cycleDoses.filter((dose) => dose.taken).length;
    const cycleComplete = cycleDoses.length > 0 && cycleTaken === cycleDoses.length;
    const cycleEl = document.createElement('div');
    cycleEl.className = 'fade-in-up';
    cycleEl.style.animationDelay = `${cycle * 0.1}s`;
    cycleEl.style.opacity = '0';

    const cycleHeader = document.createElement('div');
    cycleHeader.className = 'flex items-center justify-between mb-3';
    cycleHeader.innerHTML = `
      <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-sky-400 text-base font-black">${cycle + 1}</span>
        Turno ${cycle + 1}
      </h2>
      <span class="text-sm font-bold ${cycleComplete ? 'text-emerald-400' : 'text-slate-500'}">
        ${cycleComplete ? '✓ Completato' : `${cycleTaken}/${cycleDoses.length}`}
      </span>
    `;
    cycleEl.appendChild(cycleHeader);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'space-y-3 stagger';

    cycleDoses.forEach((dose) => {
      const drop = drops[dose.dropIndex];
      if (!drop) return;

      const colors = COLOR_MAP[normalizeColor(drop.color)];
      const globalIndex = schedule.doses.indexOf(dose);
      const safeName = escapeHtml(drop.name);
      const safeShortName = escapeHtml(drop.shortName);
      const note = dose.note || drop.note || savedDrops[dose.dropIndex]?.note || '';
      const safeNote = escapeHtml(note);
      const hasNote = typeof note === 'string' && note.trim().length > 0;
      const noteToggle = hasNote
        ? '<button type="button" class="note-toggle ml-1 border-0 bg-transparent p-0 align-baseline text-base leading-none text-slate-500 hover:text-sky-300" aria-label="Mostra nota">ⓘ</button>'
        : '';
      const card = document.createElement('div');
      card.id = `dose-${globalIndex}`;
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${drop.name} alle ${dose.time}${dose.taken ? ', preso' : ''}`);
      card.className = dose.taken
        ? 'dose-card w-full p-5 sm:p-6 rounded-2xl border-2 bg-emerald-600/20 border-emerald-500/40 text-left cursor-pointer'
        : `dose-card w-full p-5 sm:p-6 rounded-2xl border-2 ${colors.bg} ${colors.border} text-left cursor-pointer hover:brightness-125`;

      const indicator = dose.taken
        ? `<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center check-pop">
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>`
        : `<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700/80 flex items-center justify-center">
            <div class="w-4 h-4 rounded-full ${colors.dot}"></div>
          </div>`;

      card.innerHTML = `
        <div class="dose-row flex items-center gap-4">
          ${indicator}
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold px-2 py-0.5 rounded-md ${dose.taken ? 'bg-emerald-500/20 text-emerald-300' : colors.badge}">${safeShortName}</span>
              <span class="dose-name text-lg font-bold ${dose.taken ? 'text-emerald-200' : 'text-slate-200'}">${safeName}${noteToggle}</span>
            </div>
            <span class="dose-time text-3xl font-extrabold ${dose.taken ? 'text-emerald-400' : colors.text}">${dose.time}</span>
          </div>
          ${dose.taken
            ? '<span class="dose-status text-sm font-bold text-emerald-400 flex-shrink-0">PRESO ✓</span>'
            : '<span class="dose-status text-sm font-bold text-slate-500 flex-shrink-0">Tocca per confermare</span>'
          }
        </div>
        ${hasNote ? `<div class="dose-note hidden mt-3 pl-16 text-xs italic text-slate-400">${safeNote}</div>` : ''}
      `;

      card.addEventListener('click', () => onToggleDose(globalIndex));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggleDose(globalIndex);
        }
      });

      const toggle = card.querySelector('.note-toggle');
      if (toggle) {
        const noteEl = card.querySelector('.dose-note');
        noteEl?.addEventListener('click', (event) => event.stopPropagation());
        toggle.addEventListener('keydown', (event) => event.stopPropagation());
        toggle.addEventListener('click', (event) => {
          event.stopPropagation();
          noteEl.classList.toggle('hidden');
          toggle.setAttribute('aria-label', noteEl.classList.contains('hidden') ? 'Mostra nota' : 'Nascondi nota');
        });
      }
      cardsContainer.appendChild(card);
    });

    cycleEl.appendChild(cardsContainer);
    elements.scheduleContainer.appendChild(cycleEl);
  }

  if (isComplete) {
    const banner = document.createElement('div');
    banner.className = 'fade-in-up rounded-3xl border border-emerald-500/40 bg-emerald-500/15 p-6 sm:p-8 shadow-2xl text-center';
    banner.innerHTML = `
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
        <span class="text-3xl text-emerald-300" aria-hidden="true">✓</span>
      </div>
      <h2 class="text-2xl font-extrabold text-white">Programma completato!</h2>
      <p class="mt-2 text-lg text-slate-300">Ottimo lavoro per oggi.</p>
      <button id="btnNewDay" type="button"
        class="w-full mt-6 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xl rounded-2xl p-5 shadow-lg shadow-sky-600/30 transition-colors">
        Crea Programma per Domani
      </button>
    `;
    elements.scheduleContainer.appendChild(banner);

    if (onNewDay) {
      document.getElementById('btnNewDay').addEventListener('click', onNewDay);
    }
  }
}

export function renderSettingsScreen(config, onSave) {
  const savedDrops = loadSettings()?.drops || [];
  const draft = {
    drops: Array.isArray(config.drops)
      ? config.drops.map((drop, index) => ({
          name: drop?.name || '',
          shortName: drop?.shortName || drop?.name || '',
          color: normalizeColor(drop?.color),
          offsetMinutes: clampOffset(drop?.offsetMinutes),
          activeCycles: clampActiveCycles(drop?.activeCycles, config.cycles),
          note: drop?.note ?? savedDrops[index]?.note ?? '',
          isCollapsed: true,
        }))
      : [],
    cycles: Number.isInteger(Number(config.cycles)) ? Math.min(MAX_CYCLES, Math.max(1, Number(config.cycles))) : 1,
    cycleGapHours: Number.isFinite(Number(config.cycleGapHours)) ? Math.min(MAX_CYCLE_GAP_HOURS, Math.max(1, Number(config.cycleGapHours))) : 1,
    endDate: config.endDate || '',
  };
  let addColor = 'sky';
  let draggedIndex = null;
  let hasTriedSave = false;

  elements.settingsContainer.innerHTML = `
    <form id="settings-form" novalidate class="space-y-6 pb-4">
      <section class="settings-panel">
        <div class="mb-5">
          <h2 class="text-2xl font-extrabold text-white">Colliri</h2>
          <p class="text-slate-400 mt-1">Modifica, elimina o trascina le schede per cambiare l'ordine.</p>
        </div>
        <div id="settings-drop-list" class="space-y-4"></div>

        <div class="mt-6 rounded-2xl border border-slate-700 bg-slate-900/45 p-4">
          <h3 class="text-lg font-extrabold text-white mb-4">Aggiungi collirio</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="new-drop-name" class="settings-label">Nome</label>
              <input id="new-drop-name" class="settings-input" type="text" autocomplete="off" />
              <p id="new-drop-name-error" class="hidden settings-error">Il nome non può essere vuoto</p>
            </div>
            <div>
              <label for="new-drop-short-name" class="settings-label">Nome breve</label>
              <input id="new-drop-short-name" class="settings-input" type="text" autocomplete="off" />
            </div>
          </div>
          <div class="mt-4">
            <label for="new-drop-offset" class="settings-label">Minuti dal primo collirio del turno</label>
            <input id="new-drop-offset" class="settings-input" type="number" min="0" max="${MAX_OFFSET_MINUTES}" step="1" value="0" inputmode="numeric" />
            <p class="mt-2 text-sm text-slate-400">es. 0 = subito, 30 = dopo 30 minuti</p>
            <p id="new-drop-offset-error" class="hidden settings-error">Inserisci un numero intero tra 0 e 240</p>
          </div>
          <fieldset class="mt-4">
            <legend class="settings-label">Colore</legend>
            <div id="new-drop-colors" class="grid grid-cols-6 gap-3 max-w-[15rem]"></div>
          </fieldset>
          <button id="btn-add-drop" type="button" class="w-full mt-5 border-2 border-sky-500/60 hover:border-sky-400 hover:bg-sky-500/10 text-sky-300 font-extrabold text-lg rounded-2xl p-4 transition-colors flex items-center justify-center gap-2">
            <span aria-hidden="true" class="text-2xl leading-none">+</span>
            Aggiungi Collirio
          </button>
        </div>
      </section>

      <section class="settings-panel">
        <h2 class="text-2xl font-extrabold text-white mb-5">Configurazione turni</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="cycle-gap-hours" class="settings-label">Ore tra i turni</label>
            <input id="cycle-gap-hours" class="settings-input" type="number" min="1" max="${MAX_CYCLE_GAP_HOURS}" step="0.5" value="${escapeHtml(draft.cycleGapHours)}" inputmode="decimal" />
            <p id="cycle-gap-error" class="hidden settings-error">Inserisci un valore tra 1 e 12 ore</p>
          </div>
          <div>
            <label for="cycle-count" class="settings-label">Numero di turni</label>
            <input id="cycle-count" class="settings-input" type="number" min="1" max="${MAX_CYCLES}" step="1" value="${escapeHtml(draft.cycles)}" inputmode="numeric" />
            <p id="cycle-count-error" class="hidden settings-error">Inserisci un numero intero tra 1 e 6</p>
          </div>
        </div>
        <div class="mt-5">
          <label for="settingsEndDate" class="settings-label">Data fine terapia (opzionale)</label>
          <div class="flex items-center gap-3">
            <input id="settingsEndDate" class="settings-input" type="date" value="${escapeHtml(draft.endDate)}" />
            <button id="btnClearSettingsEndDate" type="button" class="${draft.endDate ? '' : 'hidden'} shrink-0 w-12 h-12 rounded-xl border border-slate-600 text-slate-300 hover:border-red-400 hover:text-red-300 hover:bg-red-500/10 text-2xl font-bold transition-colors" aria-label="Cancella data fine terapia">×</button>
          </div>
          <p id="settingsEndDateDuration" class="hidden mt-2 text-sm font-bold text-slate-400"></p>
        </div>
      </section>

      <section class="settings-panel">
        <h2 class="text-2xl font-extrabold text-white">Anteprima Programma</h2>
        <p class="text-slate-400 mt-1 mb-5">Anteprima basata su orario di esempio: 08:00</p>
        <div id="schedule-preview-list" class="space-y-4"></div>
      </section>

      <div class="sticky bottom-0 z-20 -mx-4 px-4 pt-4 pb-5 bg-slate-900/85 backdrop-blur-md border-t border-slate-700/70">
        <p id="settings-save-error" class="hidden mb-3 rounded-2xl border border-red-500/40 bg-red-500/15 p-4 text-center font-bold text-red-200" role="alert">
          Aggiungi almeno un collirio per continuare.
        </p>
        <p id="settings-saved-message" class="hidden mb-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-center font-bold text-emerald-300" role="status">
          Impostazioni salvate.
        </p>
        <button id="btn-save-settings" type="submit" class="w-full bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xl rounded-2xl p-5 shadow-lg shadow-sky-600/30 transition-colors">
          Salva Impostazioni
        </button>
      </div>
    </form>
  `;

  const form = document.getElementById('settings-form');
  const dropList = document.getElementById('settings-drop-list');
  const addColors = document.getElementById('new-drop-colors');
  const saveError = document.getElementById('settings-save-error');
  const saveButton = document.getElementById('btn-save-settings');
  const endDateInput = document.getElementById('settingsEndDate');
  const clearEndDateButton = document.getElementById('btnClearSettingsEndDate');
  const endDateDuration = document.getElementById('settingsEndDateDuration');

  function clearError(input, error) {
    input.classList.remove('input-error');
    error.classList.add('hidden');
  }

  function showError(input, error) {
    input.classList.add('input-error');
    error.classList.remove('hidden');
  }

  function getDurationReferenceDate() {
    const storedSchedule = loadSchedule();
    const activeSchedule = storedSchedule?.schedule || storedSchedule;
    const reference = activeSchedule?.createdAt ? new Date(activeSchedule.createdAt) : new Date();
    reference.setHours(0, 0, 0, 0);
    return reference;
  }

  function updateEndDateDuration() {
    if (!endDateInput || !clearEndDateButton || !endDateDuration) return;

    draft.endDate = endDateInput.value || '';
    clearEndDateButton.classList.toggle('hidden', !draft.endDate);

    const end = parseDateOnly(draft.endDate);
    if (!end) {
      endDateDuration.classList.add('hidden');
      endDateDuration.textContent = '';
      return;
    }

    const start = getDurationReferenceDate();
    const duration = Math.round((end - start) / (1000 * 60 * 60 * 24));
    endDateDuration.textContent = 'Durata: ' + duration + ' giorni';
    endDateDuration.classList.remove('hidden');
  }

  function showSaveFeedback() {
    saveButton.disabled = true;
    saveButton.textContent = '✓ Impostazioni salvate';
    saveButton.classList.remove('bg-sky-600', 'hover:bg-sky-500', 'active:bg-sky-700', 'shadow-sky-600/30');
    saveButton.classList.add('bg-emerald-600', 'shadow-emerald-600/30');

    window.setTimeout(() => {
      if (!document.body.contains(saveButton)) return;
      saveButton.disabled = false;
      saveButton.textContent = 'Salva Impostazioni';
      saveButton.classList.remove('bg-emerald-600', 'shadow-emerald-600/30');
      saveButton.classList.add('bg-sky-600', 'hover:bg-sky-500', 'active:bg-sky-700', 'shadow-sky-600/30');
    }, 1600);
  }

  function renderColorSwatches(container, selectedColor, onSelect) {
    const selected = normalizeColor(selectedColor);
    container.innerHTML = COLOR_NAMES.map((color) => {
      const isSelected = selected === color;
      return `
        <button type="button"
          class="settings-color-swatch h-7 w-7 rounded-full ${COLOR_MAP[color].dot} ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]' : 'ring-1 ring-slate-500/60'} transition-transform hover:scale-110"
          data-color="${color}"
          aria-label="Colore ${color}"
          aria-pressed="${isSelected}">
        </button>
      `;
    }).join('');

    container.querySelectorAll('.settings-color-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => onSelect(swatch.dataset.color));
    });
  }

  function renderPreview() {
    const preview = document.getElementById('schedule-preview-list');
    if (!preview) return;

    if (!draft.drops.length) {
      preview.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-600 p-5 text-center text-slate-400 font-bold">Aggiungi un collirio per vedere l\'anteprima.</div>';
      return;
    }

    const cycles = Number.isInteger(Number(draft.cycles)) ? Math.min(MAX_CYCLES, Math.max(1, Number(draft.cycles))) : 1;
    const gapHours = Number.isFinite(Number(draft.cycleGapHours)) ? Math.min(MAX_CYCLE_GAP_HOURS, Math.max(1, Number(draft.cycleGapHours))) : 1;
    const gapMinutes = Math.round(gapHours * 60);

    preview.innerHTML = Array.from({ length: cycles }, (_, cycle) => {
      const cycleBase = PREVIEW_START_MINUTES + cycle * gapMinutes;
      const activeDrops = draft.drops.filter((drop) => cycle < clampActiveCycles(drop.activeCycles, cycles));
      const rows = activeDrops.map((drop, index) => {
        const color = normalizeColor(drop.color);
        const offset = clampOffset(drop.offsetMinutes);
        return `
          <div class="flex items-center gap-3 text-sm sm:text-base ${index === activeDrops.length - 1 ? '' : 'border-b border-slate-700/60 pb-2'}">
            <span class="w-16 shrink-0 font-mono font-bold text-slate-400">${String(offset).padStart(2, '0')} min</span>
            <span class="w-14 shrink-0 font-mono font-extrabold text-white">${minutesToTime(cycleBase + offset)}</span>
            <span class="h-3 w-3 shrink-0 rounded-full ${COLOR_MAP[color].dot}"></span>
            <span class="font-bold ${COLOR_MAP[color].text}">${escapeHtml(drop.name || `Collirio ${index + 1}`)}</span>
          </div>
        `;
      }).join('');

      return `
        <article class="rounded-2xl border border-slate-700 bg-slate-900/45 p-4">
          <div class="flex items-baseline justify-between gap-3 mb-4">
            <h3 class="text-lg font-extrabold text-white">Turno ${cycle + 1}</h3>
            <span class="text-sm font-bold text-slate-400">${cycle === 0 ? 'dalle 08:00' : `+${gapHours * cycle}h`}</span>
          </div>
          <div class="space-y-2">${rows}</div>
        </article>
      `;
    }).join('');
  }

  function expandDropCard(card, index) {
    draft.drops[index].isCollapsed = false;
    card.querySelector('.drop-settings-content')?.classList.remove('hidden');
    card.querySelector('.drop-toggle')?.setAttribute('aria-expanded', 'true');
    card.querySelector('.drop-toggle svg')?.classList.add('rotate-180');
    card.querySelector('.drop-toggle')?.parentElement?.classList.add('mb-4');
  }

  function renderDropList() {
    saveError.classList.toggle('hidden', !hasTriedSave || draft.drops.length > 0);

    if (!draft.drops.length) {
      dropList.innerHTML = `
        <div class="rounded-2xl border-2 border-dashed border-slate-600 bg-slate-900/40 p-6 text-center">
          <p class="text-lg font-extrabold text-slate-200">Nessun collirio configurato.</p>
          <p class="mt-2 text-slate-400 font-bold">Aggiungi il primo collirio ↓</p>
        </div>
      `;
      renderPreview();
      return;
    }

    dropList.innerHTML = draft.drops.map((drop, index) => {
      const color = normalizeColor(drop.color);
      const isCollapsed = drop.isCollapsed !== false;
      const contentId = `drop-settings-content-${index}`;
      const title = drop.name?.trim() || 'Collirio ' + (index + 1);
      return `
        <article class="drop-settings-card" data-index="${index}">
          <div class="flex items-start gap-3">
            <button type="button" draggable="true" class="drag-handle shrink-0 cursor-grab opacity-70 hover:opacity-100 active:cursor-grabbing" aria-label="Trascina ${escapeHtml(drop.name)} per riordinare" title="Trascina per riordinare">
              <span aria-hidden="true" class="text-2xl leading-none">⠿</span>
            </button>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3 ${isCollapsed ? '' : 'mb-4'}">
                <button type="button"
                  class="drop-toggle min-w-0 flex flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors hover:bg-slate-700/35 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                  data-index="${index}"
                  aria-expanded="${!isCollapsed}"
                  aria-controls="${contentId}">
                  <span class="h-3 w-3 shrink-0 rounded-full ${COLOR_MAP[color].dot}"></span>
                  <span class="truncate font-extrabold text-white">${escapeHtml(title)}</span>
                  <svg class="h-4 w-4 shrink-0 text-slate-400 transition-transform ${isCollapsed ? '' : 'rotate-180'}" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </button>
                <button type="button" class="delete-drop rounded-xl p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300" data-index="${index}" aria-label="Elimina ${escapeHtml(drop.name)}">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

              <div class="delete-confirm hidden mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <p class="font-bold text-red-200 mb-3">Eliminare?</p>
                <div class="flex gap-3">
                  <button type="button" class="confirm-delete flex-1 rounded-xl bg-red-600 px-3 py-2 font-bold text-white" data-index="${index}">Sì</button>
                  <button type="button" class="cancel-delete flex-1 rounded-xl bg-slate-700 px-3 py-2 font-bold text-white">No</button>
                </div>
              </div>

              <div id="${contentId}" class="drop-settings-content ${isCollapsed ? 'hidden' : ''}">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="settings-label" for="drop-name-${index}">Nome</label>
                    <input id="drop-name-${index}" class="settings-input drop-name" type="text" value="${escapeHtml(drop.name)}" data-index="${index}" />
                    <p class="hidden settings-error drop-name-error">Il nome non può essere vuoto</p>
                  </div>
                  <div>
                    <label class="settings-label" for="drop-short-name-${index}">Nome breve</label>
                    <input id="drop-short-name-${index}" class="settings-input drop-short-name" type="text" value="${escapeHtml(drop.shortName)}" data-index="${index}" />
                  </div>
                </div>

                <div class="mt-4">
                  <label class="settings-label" for="drop-offset-${index}">Minuti dal primo collirio del turno</label>
                  <input id="drop-offset-${index}" class="settings-input drop-offset" type="number" min="0" max="${MAX_OFFSET_MINUTES}" step="1" value="${escapeHtml(drop.offsetMinutes)}" data-index="${index}" inputmode="numeric" />
                  <p class="mt-2 text-sm text-slate-400">es. 0 = subito, 30 = dopo 30 minuti</p>
                  <p class="hidden settings-error drop-offset-error">Inserisci un numero intero tra 0 e 240</p>
                </div>

                <div class="mt-4">
                  <label class="settings-label" for="drop-active-cycles-${index}">Turni in cui usare questo collirio</label>
                  <input id="drop-active-cycles-${index}" class="settings-input drop-active-cycles" type="number" min="1" max="${escapeHtml(draft.cycles)}" step="1" value="${escapeHtml(clampActiveCycles(drop.activeCycles, draft.cycles))}" data-index="${index}" inputmode="numeric" />
                  <p class="mt-2 text-sm text-slate-400">es. 3 = solo nei primi 3 turni di oggi</p>
                  <p class="hidden settings-error drop-active-cycles-error">Inserisci un numero intero tra 1 e ${escapeHtml(draft.cycles)}</p>
                </div>

                <div class="mt-4">
                  <label class="settings-label" for="drop-note-${index}">Nota (opzionale)</label>
                  <input id="drop-note-${index}" class="settings-input drop-note" type="text" maxlength="${MAX_NOTE_LENGTH}" placeholder="es. agita prima dell'uso" value="${escapeHtml(drop.note || '')}" data-index="${index}" />
                </div>

                <fieldset class="mt-4">
                  <legend class="settings-label">Colore</legend>
                  <div class="drop-colors grid grid-cols-6 gap-3 max-w-[15rem]" data-index="${index}"></div>
                </fieldset>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    dropList.querySelectorAll('.drop-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        const drop = draft.drops[index];
        if (!drop) return;

        drop.isCollapsed = drop.isCollapsed === false;
        renderDropList();
      });
    });

    dropList.querySelectorAll('.drop-colors').forEach((group) => {
      const index = Number(group.dataset.index);
      renderColorSwatches(group, draft.drops[index].color, (color) => {
        draft.drops[index].color = normalizeColor(color);
        renderDropList();
        renderPreview();
      });
    });

    dropList.querySelectorAll('.drop-name').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].name = input.value;
        clearError(input, input.nextElementSibling);
        renderPreview();
      });
    });

    dropList.querySelectorAll('.drop-short-name').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].shortName = input.value;
      });
    });

    dropList.querySelectorAll('.drop-offset').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].offsetMinutes = input.value;
        clearError(input, input.nextElementSibling.nextElementSibling);
        renderPreview();
      });
    });

    dropList.querySelectorAll('.drop-active-cycles').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].activeCycles = input.value;
        clearError(input, input.nextElementSibling.nextElementSibling);
        renderPreview();
      });
    });

    dropList.querySelectorAll('.drop-note').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].note = input.value;
      });
    });

    dropList.querySelectorAll('.delete-drop').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.drop-settings-card');
        card.querySelector('.delete-confirm').classList.remove('hidden');
        button.classList.add('hidden');
      });
    });

    dropList.querySelectorAll('.cancel-delete').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.drop-settings-card');
        card.querySelector('.delete-confirm').classList.add('hidden');
        card.querySelector('.delete-drop').classList.remove('hidden');
      });
    });

    dropList.querySelectorAll('.confirm-delete').forEach((button) => {
      button.addEventListener('click', () => {
        draft.drops.splice(Number(button.dataset.index), 1);
        renderDropList();
      });
    });

    dropList.querySelectorAll('.drop-settings-card').forEach((card) => {
      const handle = card.querySelector('.drag-handle');
      handle.addEventListener('dragstart', (event) => {
        draggedIndex = Number(card.dataset.index);
        card.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(draggedIndex));
      });
      handle.addEventListener('dragend', () => {
        draggedIndex = null;
        dropList.querySelectorAll('.drop-settings-card').forEach((item) => item.classList.remove('dragging', 'drag-over'));
      });
      card.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
      card.addEventListener('drop', (event) => {
        event.preventDefault();
        const targetIndex = Number(card.dataset.index);
        if (draggedIndex !== null && draggedIndex !== targetIndex) {
          const [movedDrop] = draft.drops.splice(draggedIndex, 1);
          draft.drops.splice(targetIndex, 0, movedDrop);
          renderDropList();
        }
      });
    });

    renderPreview();
  }

  document.getElementById('btn-add-drop').addEventListener('click', () => {
    const nameInput = document.getElementById('new-drop-name');
    const shortNameInput = document.getElementById('new-drop-short-name');
    const offsetInput = document.getElementById('new-drop-offset');
    const nameError = document.getElementById('new-drop-name-error');
    const offsetError = document.getElementById('new-drop-offset-error');
    const offset = Number(offsetInput.value);
    let valid = true;

    clearError(nameInput, nameError);
    clearError(offsetInput, offsetError);

    if (!nameInput.value.trim()) {
      showError(nameInput, nameError);
      valid = false;
    }
    if (!/^\d+$/.test(offsetInput.value) || !Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET_MINUTES) {
      showError(offsetInput, offsetError);
      valid = false;
    }
    if (!valid) return;

    draft.drops.push({
      name: nameInput.value.trim(),
      shortName: shortNameInput.value.trim() || nameInput.value.trim(),
      color: normalizeColor(addColor),
      offsetMinutes: offset,
      activeCycles: clampActiveCycles(draft.cycles, draft.cycles),
      note: '',
      isCollapsed: true,
    });
    nameInput.value = '';
    shortNameInput.value = '';
    offsetInput.value = '0';
    hasTriedSave = false;
    saveError.classList.add('hidden');
    renderDropList();
  });

  function renderAddColorSwatches() {
    renderColorSwatches(addColors, addColor, (color) => {
      addColor = normalizeColor(color);
      renderAddColorSwatches();
    });
  }

  renderAddColorSwatches();

  document.getElementById('cycle-gap-hours').addEventListener('input', (event) => {
    draft.cycleGapHours = event.target.value;
    clearError(event.target, document.getElementById('cycle-gap-error'));
    renderPreview();
  });

  document.getElementById('cycle-count').addEventListener('input', (event) => {
    draft.cycles = event.target.value;
    draft.drops.forEach((drop) => {
      drop.activeCycles = clampActiveCycles(drop.activeCycles, draft.cycles);
    });
    document.querySelectorAll('.drop-active-cycles').forEach((input) => {
      const limit = clampActiveCycles(draft.cycles, draft.cycles);
      const index = Number(input.dataset.index);
      input.max = String(limit);
      input.value = String(clampActiveCycles(draft.drops[index]?.activeCycles, limit));
      input.nextElementSibling.nextElementSibling.textContent = `Inserisci un numero intero tra 1 e ${limit}`;
    });
    clearError(event.target, document.getElementById('cycle-count-error'));
    renderPreview();
  });

  endDateInput.addEventListener('input', updateEndDateDuration);
  clearEndDateButton.addEventListener('click', () => {
    endDateInput.value = '';
    updateEndDateDuration();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    hasTriedSave = true;
    saveError.classList.toggle('hidden', draft.drops.length > 0);
    document.getElementById('settings-saved-message').classList.add('hidden');
    if (!draft.drops.length) valid = false;

    dropList.querySelectorAll('.drop-settings-card').forEach((card) => {
      const index = Number(card.dataset.index);
      const nameInput = card.querySelector('.drop-name');
      const nameError = card.querySelector('.drop-name-error');
      const offsetInput = card.querySelector('.drop-offset');
      const offsetError = card.querySelector('.drop-offset-error');
      const activeCyclesInput = card.querySelector('.drop-active-cycles');
      const activeCyclesError = card.querySelector('.drop-active-cycles-error');
      const noteInput = card.querySelector('.drop-note');
      const offset = Number(offsetInput.value);
      const activeCycles = Number(activeCyclesInput.value);
      const activeCyclesLimit = Number.isInteger(Number(draft.cycles))
        ? Math.min(MAX_CYCLES, Math.max(1, Number(draft.cycles)))
        : MAX_CYCLES;

      clearError(nameInput, nameError);
      clearError(offsetInput, offsetError);
      clearError(activeCyclesInput, activeCyclesError);

      if (!nameInput.value.trim()) {
        showError(nameInput, nameError);
        expandDropCard(card, index);
        valid = false;
      }
      if (!/^\d+$/.test(offsetInput.value) || !Number.isInteger(offset) || offset < 0 || offset > MAX_OFFSET_MINUTES) {
        showError(offsetInput, offsetError);
        expandDropCard(card, index);
        valid = false;
      }
      if (!/^\d+$/.test(activeCyclesInput.value) || !Number.isInteger(activeCycles) || activeCycles < 1 || activeCycles > activeCyclesLimit) {
        showError(activeCyclesInput, activeCyclesError);
        expandDropCard(card, index);
        valid = false;
      }

      draft.drops[index].name = nameInput.value.trim();
      draft.drops[index].shortName = card.querySelector('.drop-short-name').value.trim() || nameInput.value.trim();
      draft.drops[index].color = normalizeColor(draft.drops[index].color);
      draft.drops[index].offsetMinutes = clampOffset(offset);
      draft.drops[index].activeCycles = clampActiveCycles(activeCycles, activeCyclesLimit);
      draft.drops[index].note = noteInput.value.trim();
    });

    const gapInput = document.getElementById('cycle-gap-hours');
    const gapError = document.getElementById('cycle-gap-error');
    const countInput = document.getElementById('cycle-count');
    const countError = document.getElementById('cycle-count-error');
    const gap = Number(gapInput.value);
    const count = Number(countInput.value);

    clearError(gapInput, gapError);
    clearError(countInput, countError);

    if (!Number.isFinite(gap) || gap < 1 || gap > MAX_CYCLE_GAP_HOURS) {
      showError(gapInput, gapError);
      valid = false;
    }
    if (!/^\d+$/.test(countInput.value) || !Number.isInteger(count) || count < 1 || count > MAX_CYCLES) {
      showError(countInput, countError);
      valid = false;
    }
    if (!valid) return;

    draft.cycleGapHours = gap;
    draft.cycles = count;
    draft.endDate = document.getElementById('settingsEndDate')?.value || '';
    showSaveFeedback();
    onSave({
      drops: draft.drops.map(({ isCollapsed, ...drop }) => ({ ...drop })),
      cycles: draft.cycles,
      cycleGapHours: draft.cycleGapHours,
      endDate: draft.endDate || null,
    });
    document.getElementById('settings-saved-message').classList.remove('hidden');
  });

  renderDropList();
  renderPreview();
  updateEndDateDuration();
}

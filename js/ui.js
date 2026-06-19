import { CYCLES, DROPS, COLOR_MAP } from './config.js';
import { formatDateIT } from './utils.js';

// DOM Elements
export const elements = {
  setupScreen: document.getElementById('setup-screen'),
  dashboardScreen: document.getElementById('dashboard-screen'),
  startTimeInput: document.getElementById('start-time'),
  btnUseNow: document.getElementById('btn-use-now'),
  btnGenerate: document.getElementById('btn-generate'),
  btnReset: document.getElementById('btn-reset'),
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

export function showSetup() {
  elements.setupScreen.classList.remove('hidden');
  elements.dashboardScreen.classList.add('hidden');
}

export function showDashboard() {
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.remove('hidden');
}

export function renderDashboard(schedule, onToggleDose) {
  if (!schedule) return;

  // Date header
  elements.headerDate.textContent = formatDateIT(new Date(schedule.createdAt));

  // Progress
  const totalDoses = schedule.doses.length;
  const takenCount = schedule.doses.filter(d => d.taken).length;
  elements.progressLabel.textContent = `${takenCount} / ${totalDoses}`;
  elements.progressBar.style.width = `${(takenCount / totalDoses) * 100}%`;

  // Build cycles
  elements.scheduleContainer.innerHTML = '';

  for (let cycle = 0; cycle < CYCLES; cycle++) {
    const cycleDoses = schedule.doses.filter(d => d.cycle === cycle);
    const cycleTaken = cycleDoses.filter(d => d.taken).length;
    const cycleComplete = cycleTaken === cycleDoses.length;

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
      const drop = DROPS[dose.dropIndex];
      const colors = COLOR_MAP[drop.color];
      const globalIndex = schedule.doses.indexOf(dose);

      const card = document.createElement('button');
      card.type = 'button';
      card.id = `dose-${globalIndex}`;
      card.setAttribute('aria-label', `${drop.name} alle ${dose.time}${dose.taken ? ', preso' : ''}`);

      if (dose.taken) {
        card.className = `dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 bg-emerald-600/20 border-emerald-500/40 text-left cursor-pointer`;
      } else {
        card.className = `dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 ${colors.bg} ${colors.border} text-left cursor-pointer hover:brightness-125`;
      }

      let indicator;
      if (dose.taken) {
        indicator = `<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center check-pop">
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>`;
      } else {
        indicator = `<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700/80 flex items-center justify-center">
          <div class="w-4 h-4 rounded-full ${colors.dot}"></div>
        </div>`;
      }

      card.innerHTML = `
        ${indicator}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md ${dose.taken ? 'bg-emerald-500/20 text-emerald-300' : colors.badge}">${drop.shortName}</span>
            <span class="text-lg font-bold ${dose.taken ? 'text-emerald-200' : 'text-slate-200'}">${drop.name}</span>
          </div>
          <span class="text-3xl font-extrabold ${dose.taken ? 'text-emerald-400' : colors.text}">${dose.time}</span>
        </div>
        ${dose.taken
          ? '<span class="text-sm font-bold text-emerald-400 flex-shrink-0">PRESO ✓</span>'
          : '<span class="text-sm font-bold text-slate-500 flex-shrink-0">Tocca per confermare</span>'
        }
      `;

      card.addEventListener('click', () => onToggleDose(globalIndex));
      cardsContainer.appendChild(card);
    });

    cycleEl.appendChild(cardsContainer);
    elements.scheduleContainer.appendChild(cycleEl);
  }
}

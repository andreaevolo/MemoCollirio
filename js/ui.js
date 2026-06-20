import { COLOR_MAP, getEffectiveConfig } from './config.js';
import { formatDateIT } from './utils.js';

// DOM Elements
export const elements = {
  setupScreen: document.getElementById('setup-screen'),
  dashboardScreen: document.getElementById('dashboard-screen'),
  settingsScreen: document.getElementById('settings-screen'),
  settingsContainer: document.getElementById('settings-container'),
  settingsWarning: document.getElementById('settings-warning'),
  startTimeInput: document.getElementById('start-time'),
  setupFirstDropName: document.getElementById('setup-first-drop-name'),
  btnUseNow: document.getElementById('btn-use-now'),
  btnGenerate: document.getElementById('btn-generate'),
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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function showSetup() {
  elements.setupScreen.classList.remove('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.settingsScreen.classList.add('hidden');
}

export function showDashboard() {
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.remove('hidden');
  elements.settingsScreen.classList.add('hidden');
}

export function showSettings() {
  elements.setupScreen.classList.add('hidden');
  elements.dashboardScreen.classList.add('hidden');
  elements.settingsScreen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function hideSettings() {
  elements.settingsScreen.classList.add('hidden');
}

export function showSettingsWarning(show) {
  elements.settingsWarning.classList.toggle('hidden', !show);
}

export function updateSetupDropName(config = getEffectiveConfig()) {
  elements.setupFirstDropName.textContent = config.drops[0]?.name || 'primo collirio';
}

export function renderDashboard(schedule, onToggleDose) {
  if (!schedule) return;

  const config = schedule.config || getEffectiveConfig();
  const drops = config.drops;

  // Date header
  elements.headerDate.textContent = formatDateIT(new Date(schedule.createdAt));

  // Progress
  const totalDoses = schedule.doses.length;
  const takenCount = schedule.doses.filter((dose) => dose.taken).length;
  elements.progressLabel.textContent = `${takenCount} / ${totalDoses}`;
  elements.progressBar.style.width = `${totalDoses ? (takenCount / totalDoses) * 100 : 0}%`;

  // Build cycles
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

      const colors = COLOR_MAP[drop.color] || COLOR_MAP.sky;
      const globalIndex = schedule.doses.indexOf(dose);
      const safeName = escapeHtml(drop.name);
      const safeShortName = escapeHtml(drop.shortName);

      const card = document.createElement('button');
      card.type = 'button';
      card.id = `dose-${globalIndex}`;
      card.setAttribute('aria-label', `${drop.name} alle ${dose.time}${dose.taken ? ', preso' : ''}`);

      if (dose.taken) {
        card.className = 'dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 bg-emerald-600/20 border-emerald-500/40 text-left cursor-pointer';
      } else {
        card.className = `dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 ${colors.bg} ${colors.border} text-left cursor-pointer hover:brightness-125`;
      }

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
        ${indicator}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md ${dose.taken ? 'bg-emerald-500/20 text-emerald-300' : colors.badge}">${safeShortName}</span>
            <span class="text-lg font-bold ${dose.taken ? 'text-emerald-200' : 'text-slate-200'}">${safeName}</span>
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

export function renderSettingsScreen(config, onSave) {
  const draft = {
    drops: config.drops.map((drop) => ({ ...drop })),
    cycles: config.cycles,
    cycleGapHours: config.cycleGapHours,
  };
  const colors = Object.keys(COLOR_MAP);
  let addColor = colors[0];
  let draggedIndex = null;

  elements.settingsContainer.innerHTML = `
    <form id="settings-form" novalidate class="space-y-6">
      <section class="settings-panel">
        <div class="mb-5">
          <h2 class="text-2xl font-extrabold text-white">Colliri</h2>
          <p class="text-slate-400 mt-1">Modifica i dati o trascina le schede per cambiare l'ordine.</p>
        </div>
        <p id="drops-global-error" class="hidden settings-error mb-3">Aggiungi almeno un collirio</p>
        <div id="settings-drop-list" class="space-y-4"></div>
      </section>

      <section class="settings-panel">
        <h2 class="text-2xl font-extrabold text-white mb-5">Aggiungi collirio</h2>
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
          <label for="new-drop-offset" class="settings-label">Minuti dall'inizio del turno</label>
          <input id="new-drop-offset" class="settings-input" type="number" min="0" max="240" step="1" value="0" inputmode="numeric" />
          <p id="new-drop-offset-error" class="hidden settings-error">Inserisci un numero intero tra 0 e 240</p>
        </div>
        <fieldset class="mt-4">
          <legend class="settings-label">Colore</legend>
          <div id="new-drop-colors" class="swatch-grid"></div>
        </fieldset>
        <button id="btn-add-drop" type="button" class="w-full mt-5 bg-slate-700 hover:bg-slate-600 text-sky-300 font-extrabold text-lg rounded-2xl p-4 transition-colors">
          + Aggiungi collirio
        </button>
      </section>

      <section class="settings-panel">
        <h2 class="text-2xl font-extrabold text-white mb-5">Configurazione turni</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="cycle-gap-hours" class="settings-label">Ore tra i turni</label>
            <input id="cycle-gap-hours" class="settings-input" type="number" min="1" max="12" step="0.5" value="${escapeHtml(draft.cycleGapHours)}" inputmode="decimal" />
            <p id="cycle-gap-error" class="hidden settings-error">Inserisci un valore tra 1 e 12 ore</p>
          </div>
          <div>
            <label for="cycle-count" class="settings-label">Numero di turni</label>
            <input id="cycle-count" class="settings-input" type="number" min="1" max="6" step="1" value="${escapeHtml(draft.cycles)}" inputmode="numeric" />
            <p id="cycle-count-error" class="hidden settings-error">Inserisci un numero intero tra 1 e 6</p>
          </div>
        </div>
      </section>

      <p id="settings-saved-message" class="hidden rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-4 text-center font-bold text-emerald-300" role="status">
        Impostazioni salvate.
      </p>
      <button type="submit" class="w-full bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xl rounded-2xl p-5 shadow-lg shadow-sky-600/30 transition-colors">
        Salva impostazioni
      </button>
    </form>
  `;

  const form = document.getElementById('settings-form');
  const dropList = document.getElementById('settings-drop-list');
  const addColors = document.getElementById('new-drop-colors');

  function clearError(input, error) {
    input.classList.remove('input-error');
    error.classList.add('hidden');
  }

  function showError(input, error) {
    input.classList.add('input-error');
    error.classList.remove('hidden');
  }

  function renderColorSwatches() {
    addColors.innerHTML = colors.map((color) => `
      <button type="button" class="color-swatch ${addColor === color ? 'selected' : ''}" data-color="${color}" aria-label="Colore ${color}" aria-pressed="${addColor === color}">
        <span class="${COLOR_MAP[color].dot}"></span>
      </button>
    `).join('');

    addColors.querySelectorAll('.color-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        addColor = swatch.dataset.color;
        renderColorSwatches();
      });
    });
  }

  function renderDropList() {
    if (!draft.drops.length) {
      dropList.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-600 p-6 text-center text-slate-400">Nessun collirio configurato.</div>';
      return;
    }

    dropList.innerHTML = draft.drops.map((drop, index) => `
      <article class="drop-settings-card" data-index="${index}">
        <div class="flex items-center justify-between gap-3 mb-4">
          <button type="button" draggable="true" class="drag-handle" aria-label="Trascina ${escapeHtml(drop.name)} per riordinare" title="Trascina per riordinare">
            <span aria-hidden="true">⋮⋮</span>
            <span class="text-sm font-bold">${index + 1}</span>
          </button>
          <button type="button" class="delete-drop text-red-400 hover:text-red-300 font-bold text-sm px-3 py-2 rounded-xl hover:bg-red-500/10" data-index="${index}">
            Elimina
          </button>
        </div>
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
          <label class="settings-label" for="drop-offset-${index}">Minuti dall'inizio del turno</label>
          <input id="drop-offset-${index}" class="settings-input drop-offset" type="number" min="0" max="240" step="1" value="${escapeHtml(drop.offsetMinutes)}" data-index="${index}" inputmode="numeric" />
          <p class="hidden settings-error drop-offset-error">Inserisci un numero intero tra 0 e 240</p>
        </div>
        <fieldset class="mt-4">
          <legend class="settings-label">Colore</legend>
          <div class="swatch-grid drop-colors" data-index="${index}">
            ${colors.map((color) => `
              <button type="button" class="color-swatch ${drop.color === color ? 'selected' : ''}" data-color="${color}" aria-label="Colore ${color}" aria-pressed="${drop.color === color}">
                <span class="${COLOR_MAP[color].dot}"></span>
              </button>
            `).join('')}
          </div>
        </fieldset>
        <div class="delete-confirm hidden mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p class="font-bold text-red-200 mb-3">Eliminare questo collirio?</p>
          <div class="flex gap-3">
            <button type="button" class="cancel-delete flex-1 rounded-xl bg-slate-700 px-3 py-2 font-bold">Annulla</button>
            <button type="button" class="confirm-delete flex-1 rounded-xl bg-red-600 px-3 py-2 font-bold" data-index="${index}">Sì, elimina</button>
          </div>
        </div>
      </article>
    `).join('');

    dropList.querySelectorAll('.drop-name').forEach((input) => {
      input.addEventListener('input', () => {
        draft.drops[Number(input.dataset.index)].name = input.value;
        clearError(input, input.nextElementSibling);
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
        clearError(input, input.nextElementSibling);
      });
    });

    dropList.querySelectorAll('.drop-colors').forEach((group) => {
      group.querySelectorAll('.color-swatch').forEach((swatch) => {
        swatch.addEventListener('click', () => {
          draft.drops[Number(group.dataset.index)].color = swatch.dataset.color;
          renderDropList();
        });
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
        document.getElementById('drops-global-error').classList.add('hidden');
        renderDropList();
      });
    });

    dropList.querySelectorAll('.drop-settings-card').forEach((card) => {
      card.addEventListener('dragstart', (event) => {
        draggedIndex = Number(card.dataset.index);
        card.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(draggedIndex));
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
      card.addEventListener('dragend', () => {
        draggedIndex = null;
        dropList.querySelectorAll('.drop-settings-card').forEach((item) => item.classList.remove('dragging', 'drag-over'));
      });
    });
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
    if (!/^\d+$/.test(offsetInput.value) || !Number.isInteger(offset) || offset < 0 || offset > 240) {
      showError(offsetInput, offsetError);
      valid = false;
    }
    if (!valid) return;

    draft.drops.push({
      name: nameInput.value.trim(),
      shortName: shortNameInput.value.trim() || nameInput.value.trim(),
      color: addColor,
      offsetMinutes: offset,
    });
    nameInput.value = '';
    shortNameInput.value = '';
    offsetInput.value = '0';
    document.getElementById('drops-global-error').classList.add('hidden');
    renderDropList();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    document.getElementById('settings-saved-message').classList.add('hidden');
    const dropsError = document.getElementById('drops-global-error');
    dropsError.classList.toggle('hidden', draft.drops.length > 0);
    if (!draft.drops.length) valid = false;

    dropList.querySelectorAll('.drop-settings-card').forEach((card) => {
      const index = Number(card.dataset.index);
      const nameInput = card.querySelector('.drop-name');
      const nameError = card.querySelector('.drop-name-error');
      const offsetInput = card.querySelector('.drop-offset');
      const offsetError = card.querySelector('.drop-offset-error');
      const offset = Number(offsetInput.value);

      clearError(nameInput, nameError);
      clearError(offsetInput, offsetError);

      if (!nameInput.value.trim()) {
        showError(nameInput, nameError);
        valid = false;
      }
      if (!/^\d+$/.test(offsetInput.value) || !Number.isInteger(offset) || offset < 0 || offset > 240) {
        showError(offsetInput, offsetError);
        valid = false;
      }

      draft.drops[index].name = nameInput.value.trim();
      draft.drops[index].shortName = card.querySelector('.drop-short-name').value.trim() || nameInput.value.trim();
      draft.drops[index].offsetMinutes = offset;
    });

    const gapInput = document.getElementById('cycle-gap-hours');
    const gapError = document.getElementById('cycle-gap-error');
    const countInput = document.getElementById('cycle-count');
    const countError = document.getElementById('cycle-count-error');
    const gap = Number(gapInput.value);
    const count = Number(countInput.value);

    clearError(gapInput, gapError);
    clearError(countInput, countError);

    if (!Number.isFinite(gap) || gap < 1 || gap > 12) {
      showError(gapInput, gapError);
      valid = false;
    }
    if (!/^\d+$/.test(countInput.value) || !Number.isInteger(count) || count < 1 || count > 6) {
      showError(countInput, countError);
      valid = false;
    }
    if (!valid) return;

    draft.cycleGapHours = gap;
    draft.cycles = count;
    onSave({
      drops: draft.drops.map((drop) => ({ ...drop })),
      cycles: draft.cycles,
      cycleGapHours: draft.cycleGapHours,
    });
    document.getElementById('settings-saved-message').classList.remove('hidden');
  });

  renderColorSwatches();
  renderDropList();
}

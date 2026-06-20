(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`healeyetracker_data`,t=`healeyetracker_notified`,n=`healeyestracker_settings`;function r(t){localStorage.setItem(e,JSON.stringify(t))}function i(){try{let t=localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function a(){localStorage.removeItem(e),d()}function o(e){localStorage.setItem(n,JSON.stringify(e))}function s(){try{let e=localStorage.getItem(n);return e?JSON.parse(e):null}catch{return null}}function c(e){return!e||!e.createdAt?!0:Date.now()-new Date(e.createdAt).getTime()>1440*60*1e3}function l(){try{let e=localStorage.getItem(t);return e?JSON.parse(e):[]}catch{return[]}}function u(e){let n=l();n.includes(e)||(n.push(e),localStorage.setItem(t,JSON.stringify(n)))}function d(){localStorage.removeItem(t)}var f=[{name:`Desadoc`,shortName:`Desadoc`,color:`sky`,offsetMinutes:0},{name:`Quimox`,shortName:`Quimox`,color:`violet`,offsetMinutes:60},{name:`Zamidine`,shortName:`Zamidine`,color:`amber`,offsetMinutes:90},{name:`Etacortilen`,shortName:`Etacortilen`,color:`rose`,offsetMinutes:120}],p={sky:{bg:`bg-sky-600/15`,border:`border-sky-500/30`,text:`text-sky-400`,badge:`bg-sky-500/20 text-sky-300`,dot:`bg-sky-400`},violet:{bg:`bg-violet-600/15`,border:`border-violet-500/30`,text:`text-violet-400`,badge:`bg-violet-500/20 text-violet-300`,dot:`bg-violet-400`},emerald:{bg:`bg-emerald-600/15`,border:`border-emerald-500/30`,text:`text-emerald-400`,badge:`bg-emerald-500/20 text-emerald-300`,dot:`bg-emerald-400`},rose:{bg:`bg-rose-600/15`,border:`border-rose-500/30`,text:`text-rose-400`,badge:`bg-rose-500/20 text-rose-300`,dot:`bg-rose-400`},amber:{bg:`bg-amber-600/15`,border:`border-amber-500/30`,text:`text-amber-400`,badge:`bg-amber-500/20 text-amber-300`,dot:`bg-amber-400`},indigo:{bg:`bg-indigo-600/15`,border:`border-indigo-500/30`,text:`text-indigo-400`,badge:`bg-indigo-500/20 text-indigo-300`,dot:`bg-indigo-400`},teal:{bg:`bg-teal-600/15`,border:`border-teal-500/30`,text:`text-teal-400`,badge:`bg-teal-500/20 text-teal-300`,dot:`bg-teal-400`},fuchsia:{bg:`bg-fuchsia-600/15`,border:`border-fuchsia-500/30`,text:`text-fuchsia-400`,badge:`bg-fuchsia-500/20 text-fuchsia-300`,dot:`bg-fuchsia-400`},orange:{bg:`bg-orange-600/15`,border:`border-orange-500/30`,text:`text-orange-400`,badge:`bg-orange-500/20 text-orange-300`,dot:`bg-orange-400`},lime:{bg:`bg-lime-600/15`,border:`border-lime-500/30`,text:`text-lime-400`,badge:`bg-lime-500/20 text-lime-300`,dot:`bg-lime-400`},cyan:{bg:`bg-cyan-600/15`,border:`border-cyan-500/30`,text:`text-cyan-400`,badge:`bg-cyan-500/20 text-cyan-300`,dot:`bg-cyan-400`},red:{bg:`bg-red-600/15`,border:`border-red-500/30`,text:`text-red-400`,badge:`bg-red-500/20 text-red-300`,dot:`bg-red-400`}};function m(e){return e.map(e=>({...e}))}function h(){let e={drops:m(f),cycles:1,cycleGapHours:1},t=s();return!t||typeof t!=`object`?e:{drops:Array.isArray(t.drops)&&t.drops.length?t.drops.map((t,n)=>({name:typeof t?.name==`string`?t.name:e.drops[n]?.name||`Collirio ${n+1}`,shortName:typeof t?.shortName==`string`?t.shortName:e.drops[n]?.shortName||``,color:Object.prototype.hasOwnProperty.call(p,t?.color)?t.color:`sky`,offsetMinutes:Number.isInteger(Number(t?.offsetMinutes))?Math.min(240,Math.max(0,Number(t.offsetMinutes))):0})):e.drops,cycles:Number.isInteger(Number(t.cycles))?Math.min(6,Math.max(1,Number(t.cycles))):e.cycles,cycleGapHours:Number.isFinite(Number(t.cycleGapHours))?Math.min(12,Math.max(1,Number(t.cycleGapHours))):e.cycleGapHours}}function g(e){return String(e).padStart(2,`0`)}function _(e){let t=(e%1440+1440)%1440;return`${g(Math.floor(t/60))}:${g(t%60)}`}function v(e){let[t,n]=e.split(`:`).map(Number);return t*60+n}function y(){let e=new Date;return`${g(e.getHours())}:${g(e.getMinutes())}`}function ee(e){return`${[`Domenica`,`Lunedì`,`Martedì`,`Mercoledì`,`Giovedì`,`Venerdì`,`Sabato`][e.getDay()]} ${e.getDate()} ${[`Gennaio`,`Febbraio`,`Marzo`,`Aprile`,`Maggio`,`Giugno`,`Luglio`,`Agosto`,`Settembre`,`Ottobre`,`Novembre`,`Dicembre`][e.getMonth()]} ${e.getFullYear()}`}var b={welcomeScreen:document.getElementById(`welcomeScreen`),setupScreen:document.getElementById(`setup-screen`),dashboardScreen:document.getElementById(`dashboard-screen`),settingsScreen:document.getElementById(`settings-screen`),settingsContainer:document.getElementById(`settings-container`),settingsWarning:document.getElementById(`settings-warning`),startTimeInput:document.getElementById(`start-time`),setupFirstDropName:document.getElementById(`setup-first-drop-name`),btnUseNow:document.getElementById(`btn-use-now`),btnGenerate:document.getElementById(`btn-generate`),btnGoToSettings:document.getElementById(`btnGoToSettings`),btnReset:document.getElementById(`btn-reset`),btnSettingsSetup:document.getElementById(`btn-settings-setup`),btnSettingsDashboard:document.getElementById(`btn-settings-dashboard`),btnSettingsBack:document.getElementById(`btn-settings-back`),btnCancelReset:document.getElementById(`btn-cancel-reset`),btnConfirmReset:document.getElementById(`btn-confirm-reset`),confirmModal:document.getElementById(`confirm-modal`),scheduleContainer:document.getElementById(`schedule-container`),headerDate:document.getElementById(`header-date`),progressBar:document.getElementById(`progress-bar`),progressLabel:document.getElementById(`progress-label`),recalcModal:document.getElementById(`recalc-modal`),recalcMessage:document.getElementById(`recalc-message`),btnRecalcYes:document.getElementById(`btn-recalc-yes`),btnRecalcNo:document.getElementById(`btn-recalc-no`),notifBanner:document.getElementById(`notification-banner`),notifAsk:document.getElementById(`notif-ask`),notifGranted:document.getElementById(`notif-granted`),notifDenied:document.getElementById(`notif-denied`),notifUnsupported:document.getElementById(`notif-unsupported`),btnEnableNotifications:document.getElementById(`btn-enable-notifications`)},te=Object.keys(p),ne=480;function x(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function S(e){return Object.prototype.hasOwnProperty.call(p,e)?e:`sky`}function C(e){let t=Number(e);return Number.isInteger(t)?Math.min(240,Math.max(0,t)):0}function w(){b.welcomeScreen.classList.remove(`hidden`),b.setupScreen.classList.add(`hidden`),b.dashboardScreen.classList.add(`hidden`),b.settingsScreen.classList.add(`hidden`)}function T(){b.welcomeScreen.classList.add(`hidden`),b.setupScreen.classList.remove(`hidden`),b.dashboardScreen.classList.add(`hidden`),b.settingsScreen.classList.add(`hidden`)}function E(){b.welcomeScreen.classList.add(`hidden`),b.setupScreen.classList.add(`hidden`),b.dashboardScreen.classList.remove(`hidden`),b.settingsScreen.classList.add(`hidden`)}function re(){b.welcomeScreen.classList.add(`hidden`),b.setupScreen.classList.add(`hidden`),b.dashboardScreen.classList.add(`hidden`),b.settingsScreen.classList.remove(`hidden`),window.scrollTo({top:0,behavior:`instant`})}function D(){b.settingsScreen.classList.add(`hidden`)}function O(e){b.settingsWarning.classList.toggle(`hidden`,!e)}function ie(e){let t=document.createElement(`div`);t.className=`fixed left-1/2 bottom-6 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-4 text-center font-bold text-emerald-200 shadow-2xl backdrop-blur fade-in-up`,t.setAttribute(`role`,`status`),t.textContent=e,document.body.appendChild(t),window.setTimeout(()=>{t.classList.add(`opacity-0`,`transition-opacity`),window.setTimeout(()=>t.remove(),300)},3500)}function k(e=h()){b.setupFirstDropName&&(b.setupFirstDropName.textContent=e.drops[0]?.name||`primo collirio`)}function ae(e,t,n=!1,r=null){if(!e)return;let i=e.config||h(),a=i.drops;b.headerDate.textContent=ee(new Date(e.createdAt));let o=e.doses.length,s=e.doses.filter(e=>e.taken).length;b.progressLabel.textContent=`${s} / ${o}`,b.progressBar.style.width=`${o?s/o*100:0}%`,b.scheduleContainer.innerHTML=``;for(let n=0;n<i.cycles;n++){let r=e.doses.filter(e=>e.cycle===n),i=r.filter(e=>e.taken).length,o=r.length>0&&i===r.length,s=document.createElement(`div`);s.className=`fade-in-up`,s.style.animationDelay=`${n*.1}s`,s.style.opacity=`0`;let c=document.createElement(`div`);c.className=`flex items-center justify-between mb-3`,c.innerHTML=`
      <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-sky-400 text-base font-black">${n+1}</span>
        Turno ${n+1}
      </h2>
      <span class="text-sm font-bold ${o?`text-emerald-400`:`text-slate-500`}">
        ${o?`✓ Completato`:`${i}/${r.length}`}
      </span>
    `,s.appendChild(c);let l=document.createElement(`div`);l.className=`space-y-3 stagger`,r.forEach(n=>{let r=a[n.dropIndex];if(!r)return;let i=p[S(r.color)],o=e.doses.indexOf(n),s=x(r.name),c=x(r.shortName),u=document.createElement(`button`);u.type=`button`,u.id=`dose-${o}`,u.setAttribute(`aria-label`,`${r.name} alle ${n.time}${n.taken?`, preso`:``}`),u.className=n.taken?`dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 bg-emerald-600/20 border-emerald-500/40 text-left cursor-pointer`:`dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 ${i.bg} ${i.border} text-left cursor-pointer hover:brightness-125`,u.innerHTML=`
        ${n.taken?`<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center check-pop">
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>`:`<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700/80 flex items-center justify-center">
            <div class="w-4 h-4 rounded-full ${i.dot}"></div>
          </div>`}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md ${n.taken?`bg-emerald-500/20 text-emerald-300`:i.badge}">${c}</span>
            <span class="text-lg font-bold ${n.taken?`text-emerald-200`:`text-slate-200`}">${s}</span>
          </div>
          <span class="text-3xl font-extrabold ${n.taken?`text-emerald-400`:i.text}">${n.time}</span>
        </div>
        ${n.taken?`<span class="text-sm font-bold text-emerald-400 flex-shrink-0">PRESO ✓</span>`:`<span class="text-sm font-bold text-slate-500 flex-shrink-0">Tocca per confermare</span>`}
      `,u.addEventListener(`click`,()=>t(o)),l.appendChild(u)}),s.appendChild(l),b.scheduleContainer.appendChild(s)}if(n){let e=document.createElement(`div`);e.className=`fade-in-up rounded-3xl border border-emerald-500/40 bg-emerald-500/15 p-6 sm:p-8 shadow-2xl text-center`,e.innerHTML=`
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
        <span class="text-3xl text-emerald-300" aria-hidden="true">✓</span>
      </div>
      <h2 class="text-2xl font-extrabold text-white">Programma completato!</h2>
      <p class="mt-2 text-lg text-slate-300">Ottimo lavoro per oggi.</p>
      <button id="btnNewDay" type="button"
        class="w-full mt-6 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-extrabold text-xl rounded-2xl p-5 shadow-lg shadow-sky-600/30 transition-colors">
        Crea Programma per Domani
      </button>
    `,b.scheduleContainer.appendChild(e),r&&document.getElementById(`btnNewDay`).addEventListener(`click`,r)}}function oe(e,t){let n={drops:Array.isArray(e.drops)?e.drops.map(e=>({name:e?.name||``,shortName:e?.shortName||e?.name||``,color:S(e?.color),offsetMinutes:C(e?.offsetMinutes)})):[],cycles:Number.isInteger(Number(e.cycles))?Math.min(6,Math.max(1,Number(e.cycles))):1,cycleGapHours:Number.isFinite(Number(e.cycleGapHours))?Math.min(12,Math.max(1,Number(e.cycleGapHours))):1},r=`sky`,i=null,a=!1;b.settingsContainer.innerHTML=`
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
            <input id="new-drop-offset" class="settings-input" type="number" min="0" max="240" step="1" value="0" inputmode="numeric" />
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
            <input id="cycle-gap-hours" class="settings-input" type="number" min="1" max="12" step="0.5" value="${x(n.cycleGapHours)}" inputmode="decimal" />
            <p id="cycle-gap-error" class="hidden settings-error">Inserisci un valore tra 1 e 12 ore</p>
          </div>
          <div>
            <label for="cycle-count" class="settings-label">Numero di turni</label>
            <input id="cycle-count" class="settings-input" type="number" min="1" max="6" step="1" value="${x(n.cycles)}" inputmode="numeric" />
            <p id="cycle-count-error" class="hidden settings-error">Inserisci un numero intero tra 1 e 6</p>
          </div>
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
  `;let o=document.getElementById(`settings-form`),s=document.getElementById(`settings-drop-list`),c=document.getElementById(`new-drop-colors`),l=document.getElementById(`settings-save-error`),u=document.getElementById(`btn-save-settings`);function d(e,t){e.classList.remove(`input-error`),t.classList.add(`hidden`)}function f(e,t){e.classList.add(`input-error`),t.classList.remove(`hidden`)}function m(){u.disabled=!0,u.textContent=`✓ Impostazioni salvate`,u.classList.remove(`bg-sky-600`,`hover:bg-sky-500`,`active:bg-sky-700`,`shadow-sky-600/30`),u.classList.add(`bg-emerald-600`,`shadow-emerald-600/30`),window.setTimeout(()=>{document.body.contains(u)&&(u.disabled=!1,u.textContent=`Salva Impostazioni`,u.classList.remove(`bg-emerald-600`,`shadow-emerald-600/30`),u.classList.add(`bg-sky-600`,`hover:bg-sky-500`,`active:bg-sky-700`,`shadow-sky-600/30`))},1600)}function h(e,t,n){let r=S(t);e.innerHTML=te.map(e=>{let t=r===e;return`
        <button type="button"
          class="settings-color-swatch h-7 w-7 rounded-full ${p[e].dot} ${t?`ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]`:`ring-1 ring-slate-500/60`} transition-transform hover:scale-110"
          data-color="${e}"
          aria-label="Colore ${e}"
          aria-pressed="${t}">
        </button>
      `}).join(``),e.querySelectorAll(`.settings-color-swatch`).forEach(e=>{e.addEventListener(`click`,()=>n(e.dataset.color))})}function g(){let e=document.getElementById(`schedule-preview-list`);if(!e)return;if(!n.drops.length){e.innerHTML=`<div class="rounded-2xl border border-dashed border-slate-600 p-5 text-center text-slate-400 font-bold">Aggiungi un collirio per vedere l'anteprima.</div>`;return}let t=Number.isInteger(Number(n.cycles))?Math.min(6,Math.max(1,Number(n.cycles))):1,r=Number.isFinite(Number(n.cycleGapHours))?Math.min(12,Math.max(1,Number(n.cycleGapHours))):1,i=Math.round(r*60);e.innerHTML=Array.from({length:t},(e,t)=>{let a=ne+t*i,o=n.drops.map((e,t)=>{let r=S(e.color),i=C(e.offsetMinutes);return`
          <div class="flex items-center gap-3 text-sm sm:text-base ${t===n.drops.length-1?``:`border-b border-slate-700/60 pb-2`}">
            <span class="w-16 shrink-0 font-mono font-bold text-slate-400">${String(i).padStart(2,`0`)} min</span>
            <span class="w-14 shrink-0 font-mono font-extrabold text-white">${_(a+i)}</span>
            <span class="h-3 w-3 shrink-0 rounded-full ${p[r].dot}"></span>
            <span class="font-bold ${p[r].text}">${x(e.name||`Collirio ${t+1}`)}</span>
          </div>
        `}).join(``);return`
        <article class="rounded-2xl border border-slate-700 bg-slate-900/45 p-4">
          <div class="flex items-baseline justify-between gap-3 mb-4">
            <h3 class="text-lg font-extrabold text-white">Turno ${t+1}</h3>
            <span class="text-sm font-bold text-slate-400">${t===0?`dalle 08:00`:`+${r*t}h`}</span>
          </div>
          <div class="space-y-2">${o}</div>
        </article>
      `}).join(``)}function v(){if(l.classList.toggle(`hidden`,!a||n.drops.length>0),!n.drops.length){s.innerHTML=`
        <div class="rounded-2xl border-2 border-dashed border-slate-600 bg-slate-900/40 p-6 text-center">
          <p class="text-lg font-extrabold text-slate-200">Nessun collirio configurato.</p>
          <p class="mt-2 text-slate-400 font-bold">Aggiungi il primo collirio ↓</p>
        </div>
      `,g();return}s.innerHTML=n.drops.map((e,t)=>{let n=S(e.color);return`
        <article class="drop-settings-card" data-index="${t}">
          <div class="flex items-start gap-3">
            <button type="button" draggable="true" class="drag-handle shrink-0 cursor-grab opacity-70 hover:opacity-100 active:cursor-grabbing" aria-label="Trascina ${x(e.name)} per riordinare" title="Trascina per riordinare">
              <span aria-hidden="true" class="text-2xl leading-none">⠿</span>
            </button>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="h-3 w-3 shrink-0 rounded-full ${p[n].dot}"></span>
                  <span class="truncate font-extrabold text-white">Collirio ${t+1}</span>
                </div>
                <button type="button" class="delete-drop rounded-xl p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300" data-index="${t}" aria-label="Elimina ${x(e.name)}">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0 1 15.916 21H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="settings-label" for="drop-name-${t}">Nome</label>
                  <input id="drop-name-${t}" class="settings-input drop-name" type="text" value="${x(e.name)}" data-index="${t}" />
                  <p class="hidden settings-error drop-name-error">Il nome non può essere vuoto</p>
                </div>
                <div>
                  <label class="settings-label" for="drop-short-name-${t}">Nome breve</label>
                  <input id="drop-short-name-${t}" class="settings-input drop-short-name" type="text" value="${x(e.shortName)}" data-index="${t}" />
                </div>
              </div>

              <div class="mt-4">
                <label class="settings-label" for="drop-offset-${t}">Minuti dal primo collirio del turno</label>
                <input id="drop-offset-${t}" class="settings-input drop-offset" type="number" min="0" max="240" step="1" value="${x(e.offsetMinutes)}" data-index="${t}" inputmode="numeric" />
                <p class="mt-2 text-sm text-slate-400">es. 0 = subito, 30 = dopo 30 minuti</p>
                <p class="hidden settings-error drop-offset-error">Inserisci un numero intero tra 0 e 240</p>
              </div>

              <fieldset class="mt-4">
                <legend class="settings-label">Colore</legend>
                <div class="drop-colors grid grid-cols-6 gap-3 max-w-[15rem]" data-index="${t}"></div>
              </fieldset>

              <div class="delete-confirm hidden mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                <p class="font-bold text-red-200 mb-3">Eliminare?</p>
                <div class="flex gap-3">
                  <button type="button" class="confirm-delete flex-1 rounded-xl bg-red-600 px-3 py-2 font-bold text-white" data-index="${t}">Sì</button>
                  <button type="button" class="cancel-delete flex-1 rounded-xl bg-slate-700 px-3 py-2 font-bold text-white">No</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      `}).join(``),s.querySelectorAll(`.drop-colors`).forEach(e=>{let t=Number(e.dataset.index);h(e,n.drops[t].color,e=>{n.drops[t].color=S(e),v()})}),s.querySelectorAll(`.drop-name`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].name=e.value,d(e,e.nextElementSibling),g()})}),s.querySelectorAll(`.drop-short-name`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].shortName=e.value})}),s.querySelectorAll(`.drop-offset`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].offsetMinutes=e.value,d(e,e.nextElementSibling.nextElementSibling),g()})}),s.querySelectorAll(`.delete-drop`).forEach(e=>{e.addEventListener(`click`,()=>{e.closest(`.drop-settings-card`).querySelector(`.delete-confirm`).classList.remove(`hidden`),e.classList.add(`hidden`)})}),s.querySelectorAll(`.cancel-delete`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.drop-settings-card`);t.querySelector(`.delete-confirm`).classList.add(`hidden`),t.querySelector(`.delete-drop`).classList.remove(`hidden`)})}),s.querySelectorAll(`.confirm-delete`).forEach(e=>{e.addEventListener(`click`,()=>{n.drops.splice(Number(e.dataset.index),1),v()})}),s.querySelectorAll(`.drop-settings-card`).forEach(e=>{let t=e.querySelector(`.drag-handle`);t.addEventListener(`dragstart`,t=>{i=Number(e.dataset.index),e.classList.add(`dragging`),t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,String(i))}),t.addEventListener(`dragend`,()=>{i=null,s.querySelectorAll(`.drop-settings-card`).forEach(e=>e.classList.remove(`dragging`,`drag-over`))}),e.addEventListener(`dragover`,t=>{t.preventDefault(),t.dataTransfer.dropEffect=`move`,e.classList.add(`drag-over`)}),e.addEventListener(`dragleave`,()=>e.classList.remove(`drag-over`)),e.addEventListener(`drop`,t=>{t.preventDefault();let r=Number(e.dataset.index);if(i!==null&&i!==r){let[e]=n.drops.splice(i,1);n.drops.splice(r,0,e),v()}})}),g()}document.getElementById(`btn-add-drop`).addEventListener(`click`,()=>{let e=document.getElementById(`new-drop-name`),t=document.getElementById(`new-drop-short-name`),i=document.getElementById(`new-drop-offset`),o=document.getElementById(`new-drop-name-error`),s=document.getElementById(`new-drop-offset-error`),c=Number(i.value),u=!0;d(e,o),d(i,s),e.value.trim()||(f(e,o),u=!1),(!/^\d+$/.test(i.value)||!Number.isInteger(c)||c<0||c>240)&&(f(i,s),u=!1),u&&(n.drops.push({name:e.value.trim(),shortName:t.value.trim()||e.value.trim(),color:S(r),offsetMinutes:c}),e.value=``,t.value=``,i.value=`0`,a=!1,l.classList.add(`hidden`),v())});function y(){h(c,r,e=>{r=S(e),y()})}y(),document.getElementById(`cycle-gap-hours`).addEventListener(`input`,e=>{n.cycleGapHours=e.target.value,d(e.target,document.getElementById(`cycle-gap-error`)),g()}),document.getElementById(`cycle-count`).addEventListener(`input`,e=>{n.cycles=e.target.value,d(e.target,document.getElementById(`cycle-count-error`)),g()}),o.addEventListener(`submit`,e=>{e.preventDefault();let r=!0;a=!0,l.classList.toggle(`hidden`,n.drops.length>0),document.getElementById(`settings-saved-message`).classList.add(`hidden`),n.drops.length||(r=!1),s.querySelectorAll(`.drop-settings-card`).forEach(e=>{let t=Number(e.dataset.index),i=e.querySelector(`.drop-name`),a=e.querySelector(`.drop-name-error`),o=e.querySelector(`.drop-offset`),s=e.querySelector(`.drop-offset-error`),c=Number(o.value);d(i,a),d(o,s),i.value.trim()||(f(i,a),r=!1),(!/^\d+$/.test(o.value)||!Number.isInteger(c)||c<0||c>240)&&(f(o,s),r=!1),n.drops[t].name=i.value.trim(),n.drops[t].shortName=e.querySelector(`.drop-short-name`).value.trim()||i.value.trim(),n.drops[t].color=S(n.drops[t].color),n.drops[t].offsetMinutes=C(c)});let i=document.getElementById(`cycle-gap-hours`),o=document.getElementById(`cycle-gap-error`),c=document.getElementById(`cycle-count`),u=document.getElementById(`cycle-count-error`),p=Number(i.value),h=Number(c.value);d(i,o),d(c,u),(!Number.isFinite(p)||p<1||p>12)&&(f(i,o),r=!1),(!/^\d+$/.test(c.value)||!Number.isInteger(h)||h<1||h>6)&&(f(c,u),r=!1),r&&(n.cycleGapHours=p,n.cycles=h,m(),t({drops:n.drops.map(e=>({...e})),cycles:n.cycles,cycleGapHours:n.cycleGapHours}),document.getElementById(`settings-saved-message`).classList.remove(`hidden`))}),v(),g()}var A=null,j=null,se=5,ce=5,M=[`pre-dose-`,`post-dose-`];async function le(){if(`serviceWorker`in navigator)try{A=await navigator.serviceWorker.register(`./sw.js`),console.log(`[SW] Registrato con successo:`,A.scope)}catch(e){console.warn(`[SW] Registrazione fallita:`,e)}}function N(){if(b.notifAsk.classList.add(`hidden`),b.notifGranted.classList.add(`hidden`),b.notifDenied.classList.add(`hidden`),b.notifUnsupported.classList.add(`hidden`),!(`Notification`in window)||!(`serviceWorker`in navigator)){b.notifBanner.classList.remove(`hidden`),b.notifUnsupported.classList.remove(`hidden`);return}let e=Notification.permission;e===`granted`?(b.notifBanner.classList.remove(`hidden`),b.notifGranted.classList.remove(`hidden`),setTimeout(()=>{b.notifBanner.classList.add(`hidden`)},5e3)):e===`denied`?(b.notifBanner.classList.remove(`hidden`),b.notifDenied.classList.remove(`hidden`)):(b.notifBanner.classList.remove(`hidden`),b.notifAsk.classList.remove(`hidden`))}function P(e,t,n){Notification.permission===`granted`&&(navigator.serviceWorker&&navigator.serviceWorker.controller?navigator.serviceWorker.controller.postMessage({type:`SHOW_NOTIFICATION`,payload:{title:e,body:t,tag:n,data:{url:`./index.html`}}}):A?A.showNotification(e,{body:t,tag:n,icon:`./icon-192.png`,badge:`./icon-192.png`,vibrate:[200,100,200,100,200],requireInteraction:!0}):new Notification(e,{body:t,tag:n,icon:`./icon-192.png`}))}function F(){return`Notification`in window&&`serviceWorker`in navigator&&`TimestampTrigger`in window&&`showTrigger`in Notification.prototype}async function I(){if(!(`serviceWorker`in navigator))return null;if(A)return A;try{return A=await navigator.serviceWorker.ready,A}catch(e){return console.warn(`[Notifiche] Service Worker non pronto:`,e),null}}function ue(e,t){let n=new Date(e),r=new Date(n),[i,a]=t.split(`:`).map(Number),o=new Date(n);return r.setSeconds(0,0),o.setHours(i,a,0,0),o.getTime()<r.getTime()&&o.setDate(o.getDate()+1),o}async function L(e,t,n,r){if(r<=Date.now())return;let i=await I();i&&await i.showNotification(e,{body:t,tag:n,icon:`./icon-192.png`,badge:`./icon-192.png`,vibrate:[200,100,200,100,200],requireInteraction:!0,showTrigger:new TimestampTrigger(r),data:{url:`./index.html`,tag:n}})}async function R(e,t,n,r){if(!F()||Notification.permission!==`granted`||e.taken)return;let i=ue(n,e.time).getTime(),a=i-se*60*1e3,o=i+ce*60*1e3;try{await z(t),await Promise.all([L(`💧 ${r} tra 5 minuti`,`Tra 5 minuti ricordati di prendere il ${r} (ore ${e.time}).`,`pre-dose-${t}`,a),L(`⚠️ ${r} non preso!`,`Attenzione: se non hai ancora preso il ${r} previsto per le ${e.time}, apri l'app per registrarlo.`,`post-dose-${t}`,o)])}catch(e){console.warn(`[Notifiche] Pianificazione trigger fallita:`,e)}}async function z(e){if(!F()||Notification.permission!==`granted`)return;let t=await I();if(!t)return;let n=[`pre-dose-${e}`,`post-dose-${e}`];try{(await Promise.all(n.map(e=>t.getNotifications({tag:e})))).flat().forEach(e=>e.close())}catch(e){console.warn(`[Notifiche] Cancellazione trigger dose fallita:`,e)}}async function B(){if(!F()||Notification.permission!==`granted`)return;let e=await I();if(e)try{(await e.getNotifications({includeTriggered:!0})).filter(e=>M.some(t=>e.tag.startsWith(t))).forEach(e=>e.close())}catch(e){console.warn(`[Notifiche] Pulizia trigger fallita:`,e)}}function V(){if(!(`Notification`in window)||Notification.permission!==`granted`)return;let e=i();if(!e||!e.doses)return;let t=e.config||h(),n=new Date,r=n.getHours()*60+n.getMinutes(),a=l();e.doses.forEach((e,n)=>{let i=t.drops[e.dropIndex];if(!i)return;let o=r-v(e.time);o>720&&(o-=1440),o<-720&&(o+=1440);let s=`pre_${n}`;o>=-5&&o<=-4&&!e.taken&&!a.includes(s)&&(P(`💧 ${i.name} tra 5 minuti`,`Tra 5 minuti ricordati di prendere il ${i.name} (ore ${e.time}).`,`pre-dose-${n}`),u(s));let c=`post_${n}`;o>=5&&o<=6&&!e.taken&&!a.includes(c)&&(P(`⚠️ ${i.name} non preso!`,`Attenzione: non hai ancora preso il ${i.name} previsto per le ${e.time}! Apri l'app per registrarlo.`,`post-dose-${n}`),u(c))})}function H(){if(j&&clearInterval(j),F()){j=null;return}V(),j=setInterval(V,60*1e3)}var U=null,W=null,G=`setup`,K=!1,q=0,de=10;function fe(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function J(){return U?.config||h()}function Y({clearExisting:e=!1}={}){if(!U||!F()||Notification.permission!==`granted`)return;let t=++q,n=U,r=n.config||h();(async()=>{e&&await B(),t===q&&await Promise.all(n.doses.map((e,t)=>{if(e.taken)return Promise.resolve();let i=r.drops[e.dropIndex];return i?R(e,t,n.createdAt,i.name):Promise.resolve()}))})().catch(e=>{console.warn(`[Notifiche] Pianificazione programma fallita:`,e)})}function pe(e){let t=h(),[n,i]=e.split(`:`).map(Number),a=n*60+i,o=[];for(let e=0;e<t.cycles;e++){let n=a+e*t.cycleGapHours*60;t.drops.forEach((t,r)=>{o.push({cycle:e,dropIndex:r,time:_(n+t.offsetMinutes),taken:!1})})}U={createdAt:new Date().toISOString(),startTime:e,config:{drops:t.drops.map(e=>({...e})),cycles:t.cycles,cycleGapHours:t.cycleGapHours},doses:o},r(U),d(),Y({clearExisting:!0})}function me(e){if(!U)return;let t=U.doses[e];if(t.taken){t.taken=!1,r(U);let n=J().drops[t.dropIndex];n&&R(t,e,U.createdAt,n.name),Q();return}let n=y(),i=t.time,a=v(n)-v(i);a>720&&(a-=1440),a<-720&&(a+=1440);let o=Math.abs(a);if(o>=de&&U.doses.some((t,n)=>n!==e&&!t.taken)){let r=a>0?`in ritardo`:`in anticipo`,s=J().drops[t.dropIndex];b.recalcMessage.innerHTML=`Hai preso <strong class="text-white">${fe(s.name)}</strong> alle <strong class="text-white">${n}</strong> invece delle <strong class="text-white">${i}</strong> (${o} min ${r}).<br><br>Vuoi ricalcolare gli orari dei prossimi colliri?`,W={index:e,deltaMinutes:a},b.recalcModal.classList.remove(`hidden`);return}t.taken=!0,r(U),z(e),Q()}function he(){if(!W||!U)return;let{index:e,deltaMinutes:t}=W;U.doses[e].taken=!0,U.doses.forEach((n,r)=>{r!==e&&!n.taken&&(n.time=_(v(n.time)+t))}),W=null,b.recalcModal.classList.add(`hidden`),r(U),Y({clearExisting:!0}),Q()}function X(){if(!W||!U)return;let{index:e}=W;U.doses[e].taken=!0,W=null,b.recalcModal.classList.add(`hidden`),r(U),z(e),Q()}function Z(e){return e?Array.isArray(e)?e.length>0&&e.every(e=>Array.isArray(e.doses)&&e.doses.length>0&&e.doses.every(e=>e.taken)):Array.isArray(e.doses)&&e.doses.length>0&&e.doses.every(e=>e.taken):!1}function ge(){q+=1,B(),a(),d(),U=null,T()}function Q(){ae(U,me,Z(U),ge)}function _e(){E(),Q(),N(),H()}function $(e){G=e,O(!1);let t=h();oe(K?{...t,drops:[]}:t,ye),re()}function ve(){if(D(),K){let e=s();e?(K=!1,G=`setup`,k(e),T()):w();return}G===`dashboard`&&U?(E(),Q()):T()}function ye(e){if(U&&!U.config){let e=h();U.config={drops:e.drops.map(e=>({...e})),cycles:e.cycles,cycleGapHours:e.cycleGapHours},r(U)}if(o(e),k(e),K){K=!1,G=`setup`,T(),ie(`✓ Impostazioni salvate! Genera il programma di oggi.`);return}O(!!U)}b.btnUseNow.addEventListener(`click`,()=>{let e=new Date;b.startTimeInput.value=`${g(e.getHours())}:${g(e.getMinutes())}`}),b.btnGenerate.addEventListener(`click`,()=>{let e=b.startTimeInput.value;if(!e){b.startTimeInput.focus();return}pe(e),_e()}),b.btnGoToSettings.addEventListener(`click`,()=>{K=!0,$(`welcome`),window.history&&window.history.pushState&&window.history.pushState({screen:`settings`,from:`welcome`},``)}),b.btnSettingsSetup.addEventListener(`click`,()=>$(`setup`)),b.btnSettingsDashboard.addEventListener(`click`,()=>$(`dashboard`)),b.btnSettingsBack.addEventListener(`click`,ve),b.btnReset.addEventListener(`click`,()=>{b.confirmModal.classList.remove(`hidden`)}),b.btnCancelReset.addEventListener(`click`,()=>{b.confirmModal.classList.add(`hidden`)}),b.btnConfirmReset.addEventListener(`click`,()=>{b.confirmModal.classList.add(`hidden`),q+=1,B(),a(),U=null,T()}),b.confirmModal.addEventListener(`click`,e=>{e.target===b.confirmModal&&b.confirmModal.classList.add(`hidden`)}),b.btnRecalcYes.addEventListener(`click`,he),b.btnRecalcNo.addEventListener(`click`,X),b.recalcModal.addEventListener(`click`,e=>{e.target===b.recalcModal&&X()}),b.btnEnableNotifications.addEventListener(`click`,async()=>{try{let e=await Notification.requestPermission();console.log(`[Notifiche] Permesso:`,e),N(),e===`granted`&&(Y({clearExisting:!0}),P(`✅ Promemoria attivati!`,`Riceverai le notifiche per ogni collirio.`,`test-notification`))}catch(e){console.warn(`[Notifiche] Errore richiesta permesso:`,e)}}),window.addEventListener(`popstate`,()=>{!b.settingsScreen.classList.contains(`hidden`)&&K&&(D(),w())});async function be(){await le(),N(),H();let e=s(),t=i();if(!e){w();return}if(k(e),!t||c(t)){t&&(q+=1,B(),a()),U=null,T();return}U=t.schedule||t,U.config||(U.config={drops:e.drops.map(e=>({...e})),cycles:e.cycles,cycleGapHours:e.cycleGapHours},r(U)),Q(),Y({clearExisting:!0}),E()}be();
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`healeyetracker_data`,t=`healeyetracker_notified`,n=`healeyestracker_settings`;function r(t){localStorage.setItem(e,JSON.stringify(t))}function i(){try{let t=localStorage.getItem(e);return t?JSON.parse(t):null}catch{return null}}function a(){localStorage.removeItem(e),d()}function o(e){localStorage.setItem(n,JSON.stringify(e))}function s(){try{let e=localStorage.getItem(n);return e?JSON.parse(e):null}catch{return null}}function c(e){return!e||!e.createdAt?!0:Date.now()-new Date(e.createdAt).getTime()>1440*60*1e3}function l(){try{let e=localStorage.getItem(t);return e?JSON.parse(e):[]}catch{return[]}}function u(e){let n=l();n.includes(e)||(n.push(e),localStorage.setItem(t,JSON.stringify(n)))}function d(){localStorage.removeItem(t)}var f=[{name:`Desadoc`,shortName:`Desadoc`,color:`sky`,offsetMinutes:0},{name:`Quimox`,shortName:`Quimox`,color:`violet`,offsetMinutes:60},{name:`Zamidine`,shortName:`Zamidine`,color:`amber`,offsetMinutes:90},{name:`Etacortilen`,shortName:`Etacortilen`,color:`rose`,offsetMinutes:120}],p={sky:{bg:`bg-sky-600/15`,border:`border-sky-500/30`,text:`text-sky-400`,badge:`bg-sky-500/20 text-sky-300`,dot:`bg-sky-400`},violet:{bg:`bg-violet-600/15`,border:`border-violet-500/30`,text:`text-violet-400`,badge:`bg-violet-500/20 text-violet-300`,dot:`bg-violet-400`},amber:{bg:`bg-amber-600/15`,border:`border-amber-500/30`,text:`text-amber-400`,badge:`bg-amber-500/20 text-amber-300`,dot:`bg-amber-400`},rose:{bg:`bg-rose-600/15`,border:`border-rose-500/30`,text:`text-rose-400`,badge:`bg-rose-500/20 text-rose-300`,dot:`bg-rose-400`}};function m(e){return e.map(e=>({...e}))}function h(){let e={drops:m(f),cycles:4,cycleGapHours:4},t=s();return!t||typeof t!=`object`?e:{drops:Array.isArray(t.drops)&&t.drops.length?t.drops.map((t,n)=>({name:typeof t?.name==`string`?t.name:e.drops[n]?.name||`Collirio ${n+1}`,shortName:typeof t?.shortName==`string`?t.shortName:e.drops[n]?.shortName||``,color:Object.prototype.hasOwnProperty.call(p,t?.color)?t.color:Object.keys(p)[n%Object.keys(p).length],offsetMinutes:Number.isInteger(Number(t?.offsetMinutes))?Math.min(240,Math.max(0,Number(t.offsetMinutes))):0})):e.drops,cycles:Number.isInteger(Number(t.cycles))?Math.min(6,Math.max(1,Number(t.cycles))):e.cycles,cycleGapHours:Number.isFinite(Number(t.cycleGapHours))?Math.min(12,Math.max(1,Number(t.cycleGapHours))):e.cycleGapHours}}function g(e){return String(e).padStart(2,`0`)}function _(e){let t=(e%1440+1440)%1440;return`${g(Math.floor(t/60))}:${g(t%60)}`}function v(e){let[t,n]=e.split(`:`).map(Number);return t*60+n}function y(){let e=new Date;return`${g(e.getHours())}:${g(e.getMinutes())}`}function b(e){return`${[`Domenica`,`Lunedì`,`Martedì`,`Mercoledì`,`Giovedì`,`Venerdì`,`Sabato`][e.getDay()]} ${e.getDate()} ${[`Gennaio`,`Febbraio`,`Marzo`,`Aprile`,`Maggio`,`Giugno`,`Luglio`,`Agosto`,`Settembre`,`Ottobre`,`Novembre`,`Dicembre`][e.getMonth()]} ${e.getFullYear()}`}var x={setupScreen:document.getElementById(`setup-screen`),dashboardScreen:document.getElementById(`dashboard-screen`),settingsScreen:document.getElementById(`settings-screen`),settingsContainer:document.getElementById(`settings-container`),settingsWarning:document.getElementById(`settings-warning`),startTimeInput:document.getElementById(`start-time`),setupFirstDropName:document.getElementById(`setup-first-drop-name`),btnUseNow:document.getElementById(`btn-use-now`),btnGenerate:document.getElementById(`btn-generate`),btnReset:document.getElementById(`btn-reset`),btnSettingsSetup:document.getElementById(`btn-settings-setup`),btnSettingsDashboard:document.getElementById(`btn-settings-dashboard`),btnSettingsBack:document.getElementById(`btn-settings-back`),btnCancelReset:document.getElementById(`btn-cancel-reset`),btnConfirmReset:document.getElementById(`btn-confirm-reset`),confirmModal:document.getElementById(`confirm-modal`),scheduleContainer:document.getElementById(`schedule-container`),headerDate:document.getElementById(`header-date`),progressBar:document.getElementById(`progress-bar`),progressLabel:document.getElementById(`progress-label`),recalcModal:document.getElementById(`recalc-modal`),recalcMessage:document.getElementById(`recalc-message`),btnRecalcYes:document.getElementById(`btn-recalc-yes`),btnRecalcNo:document.getElementById(`btn-recalc-no`),notifBanner:document.getElementById(`notification-banner`),notifAsk:document.getElementById(`notif-ask`),notifGranted:document.getElementById(`notif-granted`),notifDenied:document.getElementById(`notif-denied`),notifUnsupported:document.getElementById(`notif-unsupported`),btnEnableNotifications:document.getElementById(`btn-enable-notifications`)};function S(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function C(){x.setupScreen.classList.remove(`hidden`),x.dashboardScreen.classList.add(`hidden`),x.settingsScreen.classList.add(`hidden`)}function w(){x.setupScreen.classList.add(`hidden`),x.dashboardScreen.classList.remove(`hidden`),x.settingsScreen.classList.add(`hidden`)}function T(){x.setupScreen.classList.add(`hidden`),x.dashboardScreen.classList.add(`hidden`),x.settingsScreen.classList.remove(`hidden`),window.scrollTo({top:0,behavior:`instant`})}function E(){x.settingsScreen.classList.add(`hidden`)}function D(e){x.settingsWarning.classList.toggle(`hidden`,!e)}function O(e=h()){x.setupFirstDropName.textContent=e.drops[0]?.name||`primo collirio`}function k(e,t){if(!e)return;let n=e.config||h(),r=n.drops;x.headerDate.textContent=b(new Date(e.createdAt));let i=e.doses.length,a=e.doses.filter(e=>e.taken).length;x.progressLabel.textContent=`${a} / ${i}`,x.progressBar.style.width=`${i?a/i*100:0}%`,x.scheduleContainer.innerHTML=``;for(let i=0;i<n.cycles;i++){let n=e.doses.filter(e=>e.cycle===i),a=n.filter(e=>e.taken).length,o=n.length>0&&a===n.length,s=document.createElement(`div`);s.className=`fade-in-up`,s.style.animationDelay=`${i*.1}s`,s.style.opacity=`0`;let c=document.createElement(`div`);c.className=`flex items-center justify-between mb-3`,c.innerHTML=`
      <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 text-sky-400 text-base font-black">${i+1}</span>
        Turno ${i+1}
      </h2>
      <span class="text-sm font-bold ${o?`text-emerald-400`:`text-slate-500`}">
        ${o?`✓ Completato`:`${a}/${n.length}`}
      </span>
    `,s.appendChild(c);let l=document.createElement(`div`);l.className=`space-y-3 stagger`,n.forEach(n=>{let i=r[n.dropIndex];if(!i)return;let a=p[i.color]||p.sky,o=e.doses.indexOf(n),s=S(i.name),c=S(i.shortName),u=document.createElement(`button`);u.type=`button`,u.id=`dose-${o}`,u.setAttribute(`aria-label`,`${i.name} alle ${n.time}${n.taken?`, preso`:``}`),n.taken?u.className=`dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 bg-emerald-600/20 border-emerald-500/40 text-left cursor-pointer`:u.className=`dose-card w-full flex items-center gap-4 p-5 sm:p-6 rounded-2xl border-2 ${a.bg} ${a.border} text-left cursor-pointer hover:brightness-125`,u.innerHTML=`
        ${n.taken?`<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center check-pop">
            <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>`:`<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700/80 flex items-center justify-center">
            <div class="w-4 h-4 rounded-full ${a.dot}"></div>
          </div>`}
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold px-2 py-0.5 rounded-md ${n.taken?`bg-emerald-500/20 text-emerald-300`:a.badge}">${c}</span>
            <span class="text-lg font-bold ${n.taken?`text-emerald-200`:`text-slate-200`}">${s}</span>
          </div>
          <span class="text-3xl font-extrabold ${n.taken?`text-emerald-400`:a.text}">${n.time}</span>
        </div>
        ${n.taken?`<span class="text-sm font-bold text-emerald-400 flex-shrink-0">PRESO ✓</span>`:`<span class="text-sm font-bold text-slate-500 flex-shrink-0">Tocca per confermare</span>`}
      `,u.addEventListener(`click`,()=>t(o)),l.appendChild(u)}),s.appendChild(l),x.scheduleContainer.appendChild(s)}}function A(e,t){let n={drops:e.drops.map(e=>({...e})),cycles:e.cycles,cycleGapHours:e.cycleGapHours},r=Object.keys(p),i=r[0],a=null;x.settingsContainer.innerHTML=`
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
            <input id="cycle-gap-hours" class="settings-input" type="number" min="1" max="12" step="0.5" value="${S(n.cycleGapHours)}" inputmode="decimal" />
            <p id="cycle-gap-error" class="hidden settings-error">Inserisci un valore tra 1 e 12 ore</p>
          </div>
          <div>
            <label for="cycle-count" class="settings-label">Numero di turni</label>
            <input id="cycle-count" class="settings-input" type="number" min="1" max="6" step="1" value="${S(n.cycles)}" inputmode="numeric" />
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
  `;let o=document.getElementById(`settings-form`),s=document.getElementById(`settings-drop-list`),c=document.getElementById(`new-drop-colors`);function l(e,t){e.classList.remove(`input-error`),t.classList.add(`hidden`)}function u(e,t){e.classList.add(`input-error`),t.classList.remove(`hidden`)}function d(){c.innerHTML=r.map(e=>`
      <button type="button" class="color-swatch ${i===e?`selected`:``}" data-color="${e}" aria-label="Colore ${e}" aria-pressed="${i===e}">
        <span class="${p[e].dot}"></span>
      </button>
    `).join(``),c.querySelectorAll(`.color-swatch`).forEach(e=>{e.addEventListener(`click`,()=>{i=e.dataset.color,d()})})}function f(){if(!n.drops.length){s.innerHTML=`<div class="rounded-2xl border border-dashed border-slate-600 p-6 text-center text-slate-400">Nessun collirio configurato.</div>`;return}s.innerHTML=n.drops.map((e,t)=>`
      <article class="drop-settings-card" data-index="${t}">
        <div class="flex items-center justify-between gap-3 mb-4">
          <button type="button" draggable="true" class="drag-handle" aria-label="Trascina ${S(e.name)} per riordinare" title="Trascina per riordinare">
            <span aria-hidden="true">⋮⋮</span>
            <span class="text-sm font-bold">${t+1}</span>
          </button>
          <button type="button" class="delete-drop text-red-400 hover:text-red-300 font-bold text-sm px-3 py-2 rounded-xl hover:bg-red-500/10" data-index="${t}">
            Elimina
          </button>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="settings-label" for="drop-name-${t}">Nome</label>
            <input id="drop-name-${t}" class="settings-input drop-name" type="text" value="${S(e.name)}" data-index="${t}" />
            <p class="hidden settings-error drop-name-error">Il nome non può essere vuoto</p>
          </div>
          <div>
            <label class="settings-label" for="drop-short-name-${t}">Nome breve</label>
            <input id="drop-short-name-${t}" class="settings-input drop-short-name" type="text" value="${S(e.shortName)}" data-index="${t}" />
          </div>
        </div>
        <div class="mt-4">
          <label class="settings-label" for="drop-offset-${t}">Minuti dall'inizio del turno</label>
          <input id="drop-offset-${t}" class="settings-input drop-offset" type="number" min="0" max="240" step="1" value="${S(e.offsetMinutes)}" data-index="${t}" inputmode="numeric" />
          <p class="hidden settings-error drop-offset-error">Inserisci un numero intero tra 0 e 240</p>
        </div>
        <fieldset class="mt-4">
          <legend class="settings-label">Colore</legend>
          <div class="swatch-grid drop-colors" data-index="${t}">
            ${r.map(t=>`
              <button type="button" class="color-swatch ${e.color===t?`selected`:``}" data-color="${t}" aria-label="Colore ${t}" aria-pressed="${e.color===t}">
                <span class="${p[t].dot}"></span>
              </button>
            `).join(``)}
          </div>
        </fieldset>
        <div class="delete-confirm hidden mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p class="font-bold text-red-200 mb-3">Eliminare questo collirio?</p>
          <div class="flex gap-3">
            <button type="button" class="cancel-delete flex-1 rounded-xl bg-slate-700 px-3 py-2 font-bold">Annulla</button>
            <button type="button" class="confirm-delete flex-1 rounded-xl bg-red-600 px-3 py-2 font-bold" data-index="${t}">Sì, elimina</button>
          </div>
        </div>
      </article>
    `).join(``),s.querySelectorAll(`.drop-name`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].name=e.value,l(e,e.nextElementSibling)})}),s.querySelectorAll(`.drop-short-name`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].shortName=e.value})}),s.querySelectorAll(`.drop-offset`).forEach(e=>{e.addEventListener(`input`,()=>{n.drops[Number(e.dataset.index)].offsetMinutes=e.value,l(e,e.nextElementSibling)})}),s.querySelectorAll(`.drop-colors`).forEach(e=>{e.querySelectorAll(`.color-swatch`).forEach(t=>{t.addEventListener(`click`,()=>{n.drops[Number(e.dataset.index)].color=t.dataset.color,f()})})}),s.querySelectorAll(`.delete-drop`).forEach(e=>{e.addEventListener(`click`,()=>{e.closest(`.drop-settings-card`).querySelector(`.delete-confirm`).classList.remove(`hidden`),e.classList.add(`hidden`)})}),s.querySelectorAll(`.cancel-delete`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.closest(`.drop-settings-card`);t.querySelector(`.delete-confirm`).classList.add(`hidden`),t.querySelector(`.delete-drop`).classList.remove(`hidden`)})}),s.querySelectorAll(`.confirm-delete`).forEach(e=>{e.addEventListener(`click`,()=>{n.drops.splice(Number(e.dataset.index),1),document.getElementById(`drops-global-error`).classList.add(`hidden`),f()})}),s.querySelectorAll(`.drop-settings-card`).forEach(e=>{e.addEventListener(`dragstart`,t=>{a=Number(e.dataset.index),e.classList.add(`dragging`),t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,String(a))}),e.addEventListener(`dragover`,t=>{t.preventDefault(),t.dataTransfer.dropEffect=`move`,e.classList.add(`drag-over`)}),e.addEventListener(`dragleave`,()=>e.classList.remove(`drag-over`)),e.addEventListener(`drop`,t=>{t.preventDefault();let r=Number(e.dataset.index);if(a!==null&&a!==r){let[e]=n.drops.splice(a,1);n.drops.splice(r,0,e),f()}}),e.addEventListener(`dragend`,()=>{a=null,s.querySelectorAll(`.drop-settings-card`).forEach(e=>e.classList.remove(`dragging`,`drag-over`))})})}document.getElementById(`btn-add-drop`).addEventListener(`click`,()=>{let e=document.getElementById(`new-drop-name`),t=document.getElementById(`new-drop-short-name`),r=document.getElementById(`new-drop-offset`),a=document.getElementById(`new-drop-name-error`),o=document.getElementById(`new-drop-offset-error`),s=Number(r.value),c=!0;l(e,a),l(r,o),e.value.trim()||(u(e,a),c=!1),(!/^\d+$/.test(r.value)||!Number.isInteger(s)||s<0||s>240)&&(u(r,o),c=!1),c&&(n.drops.push({name:e.value.trim(),shortName:t.value.trim()||e.value.trim(),color:i,offsetMinutes:s}),e.value=``,t.value=``,r.value=`0`,document.getElementById(`drops-global-error`).classList.add(`hidden`),f())}),o.addEventListener(`submit`,e=>{e.preventDefault();let r=!0;document.getElementById(`settings-saved-message`).classList.add(`hidden`),document.getElementById(`drops-global-error`).classList.toggle(`hidden`,n.drops.length>0),n.drops.length||(r=!1),s.querySelectorAll(`.drop-settings-card`).forEach(e=>{let t=Number(e.dataset.index),i=e.querySelector(`.drop-name`),a=e.querySelector(`.drop-name-error`),o=e.querySelector(`.drop-offset`),s=e.querySelector(`.drop-offset-error`),c=Number(o.value);l(i,a),l(o,s),i.value.trim()||(u(i,a),r=!1),(!/^\d+$/.test(o.value)||!Number.isInteger(c)||c<0||c>240)&&(u(o,s),r=!1),n.drops[t].name=i.value.trim(),n.drops[t].shortName=e.querySelector(`.drop-short-name`).value.trim()||i.value.trim(),n.drops[t].offsetMinutes=c});let i=document.getElementById(`cycle-gap-hours`),a=document.getElementById(`cycle-gap-error`),o=document.getElementById(`cycle-count`),c=document.getElementById(`cycle-count-error`),d=Number(i.value),f=Number(o.value);l(i,a),l(o,c),(!Number.isFinite(d)||d<1||d>12)&&(u(i,a),r=!1),(!/^\d+$/.test(o.value)||!Number.isInteger(f)||f<1||f>6)&&(u(o,c),r=!1),r&&(n.cycleGapHours=d,n.cycles=f,t({drops:n.drops.map(e=>({...e})),cycles:n.cycles,cycleGapHours:n.cycleGapHours}),document.getElementById(`settings-saved-message`).classList.remove(`hidden`))}),d(),f()}var j=null,M=null;async function N(){if(`serviceWorker`in navigator)try{j=await navigator.serviceWorker.register(`./sw.js`),console.log(`[SW] Registrato con successo:`,j.scope)}catch(e){console.warn(`[SW] Registrazione fallita:`,e)}}function P(){if(x.notifAsk.classList.add(`hidden`),x.notifGranted.classList.add(`hidden`),x.notifDenied.classList.add(`hidden`),x.notifUnsupported.classList.add(`hidden`),!(`Notification`in window)||!(`serviceWorker`in navigator)){x.notifBanner.classList.remove(`hidden`),x.notifUnsupported.classList.remove(`hidden`);return}let e=Notification.permission;e===`granted`?(x.notifBanner.classList.remove(`hidden`),x.notifGranted.classList.remove(`hidden`),setTimeout(()=>{x.notifBanner.classList.add(`hidden`)},5e3)):e===`denied`?(x.notifBanner.classList.remove(`hidden`),x.notifDenied.classList.remove(`hidden`)):(x.notifBanner.classList.remove(`hidden`),x.notifAsk.classList.remove(`hidden`))}function F(e,t,n){Notification.permission===`granted`&&(navigator.serviceWorker&&navigator.serviceWorker.controller?navigator.serviceWorker.controller.postMessage({type:`SHOW_NOTIFICATION`,payload:{title:e,body:t,tag:n,data:{url:`./index.html`}}}):j?j.showNotification(e,{body:t,tag:n,icon:`./icon-192.png`,badge:`./icon-192.png`,vibrate:[200,100,200,100,200],requireInteraction:!0}):new Notification(e,{body:t,tag:n,icon:`./icon-192.png`}))}function I(){if(!(`Notification`in window)||Notification.permission!==`granted`)return;let e=i();if(!e||!e.doses)return;let t=e.config||h(),n=new Date,r=n.getHours()*60+n.getMinutes(),a=l();e.doses.forEach((e,n)=>{let i=t.drops[e.dropIndex];if(!i)return;let o=r-v(e.time);o>720&&(o-=1440),o<-720&&(o+=1440);let s=`pre_${n}`;o>=-5&&o<=-4&&!e.taken&&!a.includes(s)&&(F(`💧 ${i.name} tra 5 minuti`,`Tra 5 minuti ricordati di prendere il ${i.name} (ore ${e.time}).`,`pre-dose-${n}`),u(s));let c=`post_${n}`;o>=5&&o<=6&&!e.taken&&!a.includes(c)&&(F(`⚠️ ${i.name} non preso!`,`Attenzione: non hai ancora preso il ${i.name} previsto per le ${e.time}! Apri l'app per registrarlo.`,`post-dose-${n}`),u(c))})}function L(){I(),M&&clearInterval(M),M=setInterval(I,60*1e3)}var R=null,z=null,B=`setup`,V=10;function H(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function U(){return R?.config||h()}function W(e){let t=h(),[n,i]=e.split(`:`).map(Number),a=n*60+i,o=[];for(let e=0;e<t.cycles;e++){let n=a+e*t.cycleGapHours*60;t.drops.forEach((t,r)=>{o.push({cycle:e,dropIndex:r,time:_(n+t.offsetMinutes),taken:!1})})}R={createdAt:new Date().toISOString(),startTime:e,config:{drops:t.drops.map(e=>({...e})),cycles:t.cycles,cycleGapHours:t.cycleGapHours},doses:o},r(R)}function G(e){if(!R)return;let t=R.doses[e];if(t.taken){t.taken=!1,r(R),k(R,G);return}let n=y(),i=t.time,a=v(n)-v(i);a>720&&(a-=1440),a<-720&&(a+=1440);let o=Math.abs(a);if(o>=V&&R.doses.some((t,n)=>n!==e&&!t.taken)){let r=a>0?`in ritardo`:`in anticipo`,s=U().drops[t.dropIndex];x.recalcMessage.innerHTML=`Hai preso <strong class="text-white">${H(s.name)}</strong> alle <strong class="text-white">${n}</strong> invece delle <strong class="text-white">${i}</strong> (${o} min ${r}).<br><br>Vuoi ricalcolare gli orari dei prossimi colliri?`,z={index:e,deltaMinutes:a},x.recalcModal.classList.remove(`hidden`);return}t.taken=!0,r(R),k(R,G)}function K(){if(!z||!R)return;let{index:e,deltaMinutes:t}=z;R.doses[e].taken=!0,R.doses.forEach((n,r)=>{r!==e&&!n.taken&&(n.time=_(v(n.time)+t))}),z=null,x.recalcModal.classList.add(`hidden`),r(R),k(R,G)}function q(){if(!z||!R)return;let{index:e}=z;R.doses[e].taken=!0,z=null,x.recalcModal.classList.add(`hidden`),r(R),k(R,G)}function J(){w(),k(R,G),P(),L()}function Y(e){B=e,D(!1),A(h(),Z),T()}function X(){E(),B===`dashboard`&&R?(w(),k(R,G)):C()}function Z(e){if(R&&!R.config){let e=h();R.config={drops:e.drops.map(e=>({...e})),cycles:e.cycles,cycleGapHours:e.cycleGapHours},r(R)}o(e),O(e),D(!!R)}x.btnUseNow.addEventListener(`click`,()=>{let e=new Date;x.startTimeInput.value=`${g(e.getHours())}:${g(e.getMinutes())}`}),x.btnGenerate.addEventListener(`click`,()=>{let e=x.startTimeInput.value;if(!e){x.startTimeInput.focus();return}W(e),J()}),x.btnSettingsSetup.addEventListener(`click`,()=>Y(`setup`)),x.btnSettingsDashboard.addEventListener(`click`,()=>Y(`dashboard`)),x.btnSettingsBack.addEventListener(`click`,X),x.btnReset.addEventListener(`click`,()=>{x.confirmModal.classList.remove(`hidden`)}),x.btnCancelReset.addEventListener(`click`,()=>{x.confirmModal.classList.add(`hidden`)}),x.btnConfirmReset.addEventListener(`click`,()=>{x.confirmModal.classList.add(`hidden`),a(),R=null,C()}),x.confirmModal.addEventListener(`click`,e=>{e.target===x.confirmModal&&x.confirmModal.classList.add(`hidden`)}),x.btnRecalcYes.addEventListener(`click`,K),x.btnRecalcNo.addEventListener(`click`,q),x.recalcModal.addEventListener(`click`,e=>{e.target===x.recalcModal&&q()}),x.btnEnableNotifications.addEventListener(`click`,async()=>{try{let e=await Notification.requestPermission();console.log(`[Notifiche] Permesso:`,e),P(),e===`granted`&&F(`✅ Promemoria attivati!`,`Riceverai le notifiche per ogni collirio.`,`test-notification`)}catch(e){console.warn(`[Notifiche] Errore richiesta permesso:`,e)}}),(function(){N();let e=h();O(e);let t=i();t&&!c(t)?(R=t,R.config||(R.config={drops:e.drops.map(e=>({...e})),cycles:e.cycles,cycleGapHours:e.cycleGapHours},r(R)),J()):(t&&a(),C())})();
import { getEffectiveConfig } from './config.js';
import { timeToMinutes } from './utils.js';
import { getNotifiedKeys, addNotifiedKey, loadSchedule } from './storage.js';
import { elements } from './ui.js';

export let swRegistration = null;
let notificationInterval = null;

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('./sw.js');
      console.log('[SW] Registrato con successo:', swRegistration.scope);
    } catch (err) {
      console.warn('[SW] Registrazione fallita:', err);
    }
  }
}

export function updateNotificationBanner() {
  elements.notifAsk.classList.add('hidden');
  elements.notifGranted.classList.add('hidden');
  elements.notifDenied.classList.add('hidden');
  elements.notifUnsupported.classList.add('hidden');

  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    elements.notifBanner.classList.remove('hidden');
    elements.notifUnsupported.classList.remove('hidden');
    return;
  }

  const permission = Notification.permission;

  if (permission === 'granted') {
    elements.notifBanner.classList.remove('hidden');
    elements.notifGranted.classList.remove('hidden');
    setTimeout(() => {
      elements.notifBanner.classList.add('hidden');
    }, 5000);
  } else if (permission === 'denied') {
    elements.notifBanner.classList.remove('hidden');
    elements.notifDenied.classList.remove('hidden');
  } else {
    elements.notifBanner.classList.remove('hidden');
    elements.notifAsk.classList.remove('hidden');
  }
}

export function sendNotification(title, body, tag) {
  if (Notification.permission !== 'granted') return;

  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SHOW_NOTIFICATION',
      payload: { title, body, tag, data: { url: './index.html' } },
    });
  } else if (swRegistration) {
    swRegistration.showNotification(title, {
      body,
      tag,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
    });
  } else {
    new Notification(title, { body, tag, icon: './icon-192.png' });
  }
}

export function checkNotificationSchedule() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const currentSchedule = loadSchedule();
  if (!currentSchedule || !currentSchedule.doses) return;
  const config = currentSchedule.config || getEffectiveConfig();

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const notifiedKeys = getNotifiedKeys();

  currentSchedule.doses.forEach((dose, index) => {
    const drop = config.drops[dose.dropIndex];
    if (!drop) return;
    const doseMinutes = timeToMinutes(dose.time);

    let delta = currentMinutes - doseMinutes;
    if (delta > 720) delta -= 1440;
    if (delta < -720) delta += 1440;

    const preKey = `pre_${index}`;
    if (delta >= -5 && delta <= -4 && !dose.taken && !notifiedKeys.includes(preKey)) {
      sendNotification(
        `💧 ${drop.name} tra 5 minuti`,
        `Tra 5 minuti ricordati di prendere il ${drop.name} (ore ${dose.time}).`,
        `pre-dose-${index}`
      );
      addNotifiedKey(preKey);
    }

    const postKey = `post_${index}`;
    if (delta >= 5 && delta <= 6 && !dose.taken && !notifiedKeys.includes(postKey)) {
      sendNotification(
        `⚠️ ${drop.name} non preso!`,
        `Attenzione: non hai ancora preso il ${drop.name} previsto per le ${dose.time}! Apri l'app per registrarlo.`,
        `post-dose-${index}`
      );
      addNotifiedKey(postKey);
    }
  });
}

export function startNotificationChecker() {
  checkNotificationSchedule();
  if (notificationInterval) clearInterval(notificationInterval);
  notificationInterval = setInterval(checkNotificationSchedule, 60 * 1000);
}

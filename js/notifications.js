import { getEffectiveConfig } from './config.js';
import { timeToMinutes } from './utils.js';
import { getNotifiedKeys, addNotifiedKey, loadSchedule } from './storage.js';
import { elements } from './ui.js';

export let swRegistration = null;
let notificationInterval = null;
const PRE_ALERT_MINUTES = 5;
const POST_ALERT_MINUTES = 5;
const TRIGGER_TAG_PREFIXES = ['pre-dose-', 'post-dose-'];

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

export function supportsNotificationTriggers() {
  return (
    'Notification' in window
    && 'serviceWorker' in navigator
    && 'TimestampTrigger' in window
    && 'showTrigger' in Notification.prototype
  );
}

async function getNotificationRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  if (swRegistration) return swRegistration;

  try {
    swRegistration = await navigator.serviceWorker.ready;
    return swRegistration;
  } catch (error) {
    console.warn('[Notifiche] Service Worker non pronto:', error);
    return null;
  }
}

function getDoseDate(scheduleCreatedAt, doseTime) {
  const createdAt = new Date(scheduleCreatedAt);
  const createdAtMinute = new Date(createdAt);
  const [hours, minutes] = doseTime.split(':').map(Number);
  const doseDate = new Date(createdAt);

  createdAtMinute.setSeconds(0, 0);
  doseDate.setHours(hours, minutes, 0, 0);

  // Se l'orario HH:MM risulta precedente alla creazione del programma,
  // appartiene al giorno successivo (programma che passa la mezzanotte).
  if (doseDate.getTime() < createdAtMinute.getTime()) {
    doseDate.setDate(doseDate.getDate() + 1);
  }

  return doseDate;
}

async function showTriggeredNotification(title, body, tag, timestamp) {
  if (timestamp <= Date.now()) return;

  const registration = await getNotificationRegistration();
  if (!registration) return;

  await registration.showNotification(title, {
    body,
    tag,
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
    showTrigger: new TimestampTrigger(timestamp),
    data: { url: './index.html', tag },
  });
}

export async function scheduleDoseTriggers(dose, index, scheduleCreatedAt, dropName) {
  if (!supportsNotificationTriggers() || Notification.permission !== 'granted' || dose.taken) return;

  const doseDate = getDoseDate(scheduleCreatedAt, dose.time);
  const doseTimestamp = doseDate.getTime();
  const preTimestamp = doseTimestamp - PRE_ALERT_MINUTES * 60 * 1000;
  const postTimestamp = doseTimestamp + POST_ALERT_MINUTES * 60 * 1000;

  try {
    await cancelDoseTriggers(index);

    await Promise.all([
      showTriggeredNotification(
        `💧 ${dropName} tra 5 minuti`,
        `Tra 5 minuti ricordati di prendere il ${dropName} (ore ${dose.time}).`,
        `pre-dose-${index}`,
        preTimestamp
      ),
      showTriggeredNotification(
        `⚠️ ${dropName} non preso!`,
        `Attenzione: se non hai ancora preso il ${dropName} previsto per le ${dose.time}, apri l'app per registrarlo.`,
        `post-dose-${index}`,
        postTimestamp
      ),
    ]);
  } catch (error) {
    console.warn('[Notifiche] Pianificazione trigger fallita:', error);
  }
}

export async function cancelDoseTriggers(index) {
  if (!supportsNotificationTriggers() || Notification.permission !== 'granted') return;

  const registration = await getNotificationRegistration();
  if (!registration) return;

  const tags = [`pre-dose-${index}`, `post-dose-${index}`];

  try {
    const notificationsByTag = await Promise.all(
      tags.map((tag) => registration.getNotifications({ tag }))
    );

    notificationsByTag.flat().forEach((notification) => notification.close());
  } catch (error) {
    console.warn('[Notifiche] Cancellazione trigger dose fallita:', error);
  }
}

export async function clearAllTriggers() {
  if (!supportsNotificationTriggers() || Notification.permission !== 'granted') return;

  const registration = await getNotificationRegistration();
  if (!registration) return;

  try {
    const notifications = await registration.getNotifications({ includeTriggered: true });
    notifications
      .filter((notification) => TRIGGER_TAG_PREFIXES.some((prefix) => notification.tag.startsWith(prefix)))
      .forEach((notification) => notification.close());
  } catch (error) {
    console.warn('[Notifiche] Pulizia trigger fallita:', error);
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
  if (notificationInterval) clearInterval(notificationInterval);

  if (supportsNotificationTriggers()) {
    notificationInterval = null;
    return;
  }

  checkNotificationSchedule();
  notificationInterval = setInterval(checkNotificationSchedule, 60 * 1000);
}

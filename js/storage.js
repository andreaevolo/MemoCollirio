import { STORAGE_KEY, NOTIFIED_KEYS_STORAGE } from './config.js';

export function saveSchedule(schedule) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
}

export function loadSchedule() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export function clearSchedule() {
  localStorage.removeItem(STORAGE_KEY);
  clearNotifiedKeys();
}

export function isExpired(data) {
  if (!data || !data.createdAt) return true;
  const elapsed = Date.now() - new Date(data.createdAt).getTime();
  return elapsed > 24 * 60 * 60 * 1000;
}

// ── Notified Keys Storage ──
export function getNotifiedKeys() {
  try {
    const raw = localStorage.getItem(NOTIFIED_KEYS_STORAGE);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addNotifiedKey(key) {
  const keys = getNotifiedKeys();
  if (!keys.includes(key)) {
    keys.push(key);
    localStorage.setItem(NOTIFIED_KEYS_STORAGE, JSON.stringify(keys));
  }
}

export function clearNotifiedKeys() {
  localStorage.removeItem(NOTIFIED_KEYS_STORAGE);
}

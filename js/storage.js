export const STORAGE_KEY = 'healeyetracker_data';
export const NOTIFIED_KEYS_STORAGE = 'healeyetracker_notified';
export const SETTINGS_STORAGE_KEY = 'healeyestracker_settings';

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

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSettings() {
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
}

export function isExpired(data) {
  if (!data || !data.createdAt) return true;
  const elapsed = Date.now() - new Date(data.createdAt).getTime();
  return elapsed > 24 * 60 * 60 * 1000;
}

// Returns true if endDate is set AND today's date is strictly after it
export function isTherapyExpired(settings) {
  if (!settings?.endDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(settings.endDate);
  end.setHours(0, 0, 0, 0);
  return today > end;
}

// Returns days remaining (negative if expired, null if no endDate)
export function daysRemaining(settings) {
  if (!settings?.endDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(settings.endDate);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - today) / (1000 * 60 * 60 * 24));
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

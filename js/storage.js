export const STORAGE_KEY = 'healeyetracker_data';
export const NOTIFIED_KEYS_STORAGE = 'healeyetracker_notified';
export const SETTINGS_STORAGE_KEY = 'healeyestracker_settings';

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasValidDoseArray(value) {
  return Array.isArray(value?.doses)
    && value.doses.every((dose) => isPlainObject(dose) && typeof dose.time === 'string' && typeof dose.taken === 'boolean');
}

function validateScheduleData(value) {
  if (!isPlainObject(value)) return false;
  const hasCreatedAt = typeof value.createdAt === 'string' || typeof value.createdAt === 'number';
  if (hasCreatedAt && hasValidDoseArray(value)) return true;
  if (hasCreatedAt && Array.isArray(value.schedule)) return true;
  if (isPlainObject(value.schedule)) {
    const nestedHasCreatedAt = typeof value.schedule.createdAt === 'string' || typeof value.schedule.createdAt === 'number';
    return nestedHasCreatedAt && hasValidDoseArray(value.schedule);
  }
  return false;
}

function validateSettingsData(value) {
  return isPlainObject(value)
    && Array.isArray(value.drops)
    && value.drops.every((drop) => isPlainObject(drop))
    && Number.isFinite(Number(value.cycles))
    && Number.isFinite(Number(value.cycleGapHours));
}

function validateNotifiedKeys(value) {
  return Array.isArray(value) && value.every((key) => typeof key === 'string');
}

function safeLoad(key, validator) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (validator(parsed)) return parsed;
    localStorage.removeItem(key);
    return null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveSchedule(schedule) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
}

export function loadSchedule() {
  return safeLoad(STORAGE_KEY, validateScheduleData);
}

export function clearSchedule() {
  localStorage.removeItem(STORAGE_KEY);
  clearNotifiedKeys();
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function loadSettings() {
  return safeLoad(SETTINGS_STORAGE_KEY, validateSettingsData);
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
  return safeLoad(NOTIFIED_KEYS_STORAGE, validateNotifiedKeys) || [];
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

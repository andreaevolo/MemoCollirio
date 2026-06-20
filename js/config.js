import {
  loadSettings,
  STORAGE_KEY,
  NOTIFIED_KEYS_STORAGE,
  SETTINGS_STORAGE_KEY,
} from './storage.js';

// Default names and colors. They remain the fallback when no settings are saved.
export const DROPS = [
  { name: 'Desadoc', shortName: 'Desadoc', color: 'sky', offsetMinutes: 0 },
  { name: 'Quimox', shortName: 'Quimox', color: 'violet', offsetMinutes: 60 },
  { name: 'Zamidine', shortName: 'Zamidine', color: 'amber', offsetMinutes: 90 },
  { name: 'Etacortilen', shortName: 'Etacortilen', color: 'rose', offsetMinutes: 120 },
];

export const CYCLES = 4;
export const CYCLE_GAP_HOURS = 4;
export { STORAGE_KEY, NOTIFIED_KEYS_STORAGE, SETTINGS_STORAGE_KEY };

// Color mappings for Tailwind classes (we can't use dynamic classes with CDN build, so we map them)
export const COLOR_MAP = {
  sky: { bg: 'bg-sky-600/15', border: 'border-sky-500/30', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300', dot: 'bg-sky-400' },
  violet: { bg: 'bg-violet-600/15', border: 'border-violet-500/30', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300', dot: 'bg-violet-400' },
  amber: { bg: 'bg-amber-600/15', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-400' },
  rose: { bg: 'bg-rose-600/15', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-400' },
};

function cloneDrops(drops) {
  return drops.map((drop) => ({ ...drop }));
}

export function getEffectiveConfig() {
  const defaults = {
    drops: cloneDrops(DROPS),
    cycles: CYCLES,
    cycleGapHours: CYCLE_GAP_HOURS,
  };
  const saved = loadSettings();

  if (!saved || typeof saved !== 'object') return defaults;

  const drops = Array.isArray(saved.drops) && saved.drops.length
    ? saved.drops.map((drop, index) => ({
        name: typeof drop?.name === 'string' ? drop.name : defaults.drops[index]?.name || `Collirio ${index + 1}`,
        shortName: typeof drop?.shortName === 'string' ? drop.shortName : defaults.drops[index]?.shortName || '',
        color: Object.prototype.hasOwnProperty.call(COLOR_MAP, drop?.color)
          ? drop.color
          : Object.keys(COLOR_MAP)[index % Object.keys(COLOR_MAP).length],
        offsetMinutes: Number.isInteger(Number(drop?.offsetMinutes))
          ? Math.min(240, Math.max(0, Number(drop.offsetMinutes)))
          : 0,
      }))
    : defaults.drops;

  const cycles = Number.isInteger(Number(saved.cycles))
    ? Math.min(6, Math.max(1, Number(saved.cycles)))
    : defaults.cycles;
  const cycleGapHours = Number.isFinite(Number(saved.cycleGapHours))
    ? Math.min(12, Math.max(1, Number(saved.cycleGapHours)))
    : defaults.cycleGapHours;

  return { drops, cycles, cycleGapHours };
}

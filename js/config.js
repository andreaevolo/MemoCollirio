// Names and colors for each eye drop. Easy to customize.
export const DROPS = [
  { name: 'Desadoc', shortName: 'Desadoc', color: 'sky', offsetMinutes: 0 },
  { name: 'Quimox', shortName: 'Quimox', color: 'violet', offsetMinutes: 60 },
  { name: 'Zamidine', shortName: 'Zamidine', color: 'amber', offsetMinutes: 90 },
  { name: 'Etacortilen', shortName: 'Etacortilen', color: 'rose', offsetMinutes: 120 },
];

export const CYCLES = 4;
export const CYCLE_GAP_HOURS = 4;
export const STORAGE_KEY = 'healeyetracker_data';
export const NOTIFIED_KEYS_STORAGE = 'healeyetracker_notified';

// Color mappings for Tailwind classes (we can't use dynamic classes with CDN build, so we map them)
export const COLOR_MAP = {
  sky: { bg: 'bg-sky-600/15', border: 'border-sky-500/30', text: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300', dot: 'bg-sky-400' },
  violet: { bg: 'bg-violet-600/15', border: 'border-violet-500/30', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300', dot: 'bg-violet-400' },
  amber: { bg: 'bg-amber-600/15', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-400' },
  rose: { bg: 'bg-rose-600/15', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-400' },
};

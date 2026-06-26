import {
  loadSettings,
  STORAGE_KEY,
  NOTIFIED_KEYS_STORAGE,
  SETTINGS_STORAGE_KEY,
} from "./storage.js";

// Default names and colors. They remain the fallback when no settings are saved.
export const DROPS = [
  { name: "Desadoc", shortName: "Desadoc", color: "sky", offsetMinutes: 0, note: "" },
  { name: "Quimox", shortName: "Quimox", color: "violet", offsetMinutes: 60, note: "" },
  {
    name: "Zamidine",
    shortName: "Zamidine",
    color: "amber",
    offsetMinutes: 90,
    note: "",
  },
  {
    name: "Etacortilen",
    shortName: "Etacortilen",
    color: "rose",
    offsetMinutes: 120,
    note: "",
  },
];

export const CYCLES = 1;
export const CYCLE_GAP_HOURS = 1;
export const TOLERANCE_MINUTES = 10;
export const PRE_ALERT_MINUTES = 5;
export const POST_ALERT_MINUTES = 5;
export const NOTIFICATION_CHECK_INTERVAL = 60000;
export const MAX_NOTE_LENGTH = 120;
export const MAX_CYCLES = 6;
export const MAX_CYCLE_GAP_HOURS = 12;
export const MAX_OFFSET_MINUTES = 240;
export { STORAGE_KEY, NOTIFIED_KEYS_STORAGE, SETTINGS_STORAGE_KEY };

// Color mappings for Tailwind classes (we can't use dynamic classes with CDN build, so we map them)
export const COLOR_MAP = {
  sky: {
    bg: "bg-sky-600/15",
    border: "border-sky-500/30",
    text: "text-sky-400",
    badge: "bg-sky-500/20 text-sky-300",
    dot: "bg-sky-400",
  },
  violet: {
    bg: "bg-violet-600/15",
    border: "border-violet-500/30",
    text: "text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
    dot: "bg-violet-400",
  },
  emerald: {
    bg: "bg-emerald-600/15",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    dot: "bg-emerald-400",
  },
  rose: {
    bg: "bg-rose-600/15",
    border: "border-rose-500/30",
    text: "text-rose-400",
    badge: "bg-rose-500/20 text-rose-300",
    dot: "bg-rose-400",
  },
  amber: {
    bg: "bg-amber-600/15",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-400",
  },
  indigo: {
    bg: "bg-indigo-600/15",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    badge: "bg-indigo-500/20 text-indigo-300",
    dot: "bg-indigo-400",
  },
  teal: {
    bg: "bg-teal-600/15",
    border: "border-teal-500/30",
    text: "text-teal-400",
    badge: "bg-teal-500/20 text-teal-300",
    dot: "bg-teal-400",
  },
  fuchsia: {
    bg: "bg-fuchsia-600/15",
    border: "border-fuchsia-500/30",
    text: "text-fuchsia-400",
    badge: "bg-fuchsia-500/20 text-fuchsia-300",
    dot: "bg-fuchsia-400",
  },
  orange: {
    bg: "bg-orange-600/15",
    border: "border-orange-500/30",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
    dot: "bg-orange-400",
  },
  lime: {
    bg: "bg-lime-600/15",
    border: "border-lime-500/30",
    text: "text-lime-400",
    badge: "bg-lime-500/20 text-lime-300",
    dot: "bg-lime-400",
  },
  cyan: {
    bg: "bg-cyan-600/15",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
    dot: "bg-cyan-400",
  },
  red: {
    bg: "bg-red-600/15",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300",
    dot: "bg-red-400",
  },
};

function cloneDrops(drops) {
  return drops.map((drop) => ({ ...drop }));
}

export function getEffectiveConfig() {
  const defaults = {
    drops: cloneDrops(DROPS).map((drop) => ({ ...drop, activeCycles: CYCLES })),
    cycles: CYCLES,
    cycleGapHours: CYCLE_GAP_HOURS,
  };
  const saved = loadSettings();

  if (!saved || typeof saved !== "object") return defaults;

  const cycles = Number.isInteger(Number(saved.cycles))
    ? Math.min(MAX_CYCLES, Math.max(1, Number(saved.cycles)))
    : defaults.cycles;

  const drops =
    Array.isArray(saved.drops) && saved.drops.length
      ? saved.drops.map((drop, index) => ({
          name:
            typeof drop?.name === "string"
              ? drop.name
              : defaults.drops[index]?.name || `Collirio ${index + 1}`,
          shortName:
            typeof drop?.shortName === "string"
              ? drop.shortName
              : defaults.drops[index]?.shortName || "",
          color: Object.prototype.hasOwnProperty.call(COLOR_MAP, drop?.color)
            ? drop.color
            : "sky",
          offsetMinutes: Number.isInteger(Number(drop?.offsetMinutes))
            ? Math.min(MAX_OFFSET_MINUTES, Math.max(0, Number(drop.offsetMinutes)))
            : 0,
          activeCycles: Number.isInteger(Number(drop?.activeCycles))
            ? Math.min(cycles, Math.max(1, Number(drop.activeCycles)))
            : cycles,
          note: typeof drop?.note === "string" ? drop.note.slice(0, MAX_NOTE_LENGTH) : "",
        }))
      : defaults.drops;

  const cycleGapHours = Number.isFinite(Number(saved.cycleGapHours))
    ? Math.min(MAX_CYCLE_GAP_HOURS, Math.max(1, Number(saved.cycleGapHours)))
    : defaults.cycleGapHours;

  return { drops, cycles, cycleGapHours };
}

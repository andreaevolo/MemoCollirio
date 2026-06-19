# Project Specification & Reference Guide: Daily Eye Drop Tracker

This document serves as a complete specification, architectural blueprint, and technical reference for the **Daily Eye Drop Tracker** (MemoCollirio) project. It is designed to act as a context-providing prompt for future development, code generators, or AI assistants.

---

## 1. Project Overview & Product Requirements

The **Daily Eye Drop Tracker** is a client-side Progressive Web Application (PWA) developed to assist patients in tracking their daily medication schedule, specifically multiple types of eye drops (colliri) administered in repeating cycles. 

### Core User Stories & Logic:
- **Setup Screen:** Upon opening the app for the first time in a day, the user is prompted to input the exact time they took (or plan to take) the first drop of the day.
- **Auto-Schedule Generation:** Based on the initial time, the app generates a schedule for the entire day.
- **Turn-based Cycles (Turni):** The medication protocol is divided into 4 cycles (Turni) separated by a fixed interval (default: 4 hours).
- **Sub-Schedule per Cycle (Offset Minutes):** Each cycle contains a series of different eye drops, each scheduled at a specific offset in minutes relative to the cycle's start.
- **PWA Capabilities:** Operates offline, supports local cache installation via service workers, and features local push notifications.
- **Daily Auto-Reset:** Data is stored in LocalStorage but automatically resets 24 hours after the schedule creation time.
- **Tolerance & Schedule Recalculation:**
  - If a user registers a drop within 10 minutes of its scheduled time, it is marked as taken.
  - If a user registers a drop **more than 10 minutes early or late**, a modal asks whether to shift the remaining untaken drops in the schedule by the exact time delta (e.g., if taken 20 minutes late, all future drops are shifted forward by 20 minutes to maintain safety intervals).
- **Proactive Push Notifications:** 
  - Send a heads-up alert **5 minutes before** a drop is due.
  - Send a warning reminder **5 minutes after** a drop is due if the user has not marked it as taken.

---

## 2. Technical Stack

- **Module Bundler & Dev Server:** [Vite](https://vite.dev/) (v8+)
- **HTML Structure:** Semantic HTML5
- **Styling:** Tailwind CSS (loaded via CDN inside `<head>`) + custom CSS classes (`style.css`)
- **JavaScript Engine:** Vanilla JS utilizing native ES6 Modules (`import`/`export`)
- **Storage:** Client-side Web Storage API (`localStorage`)
- **Service Worker / PWA:** Standalone offline execution support and Notification/Push API wrapper

---

## 3. Directory Structure & Architecture

Below is the file tree of the project:

```text
healeyestracker/
├── index.html         # Main entry point (HTML skeleton, Tailwind CDN)
├── style.css          # Custom styling, transitions, scrollbars, modals
├── package.json       # Node scripts & Vite development/production dependencies
├── public/            # Static assets served at the root
│   ├── sw.js          # Service Worker for offline support and background notifications
│   ├── manifest.json  # PWA configuration manifest
│   ├── icon-192.png   # Application icon (192x192)
│   └── icon-512.png   # Application icon (512x512)
└── js/                # Modular JavaScript (ES6)
    ├── config.js      # App configuration, Constants, Color Maps
    ├── utils.js       # Pure helper functions for time calculations & formatting
    ├── storage.js     # Interface with LocalStorage
    ├── ui.js          # DOM selectors & rendering logic (Dashboard rendering)
    ├── notifications.js# Service Worker hook, notification scheduler
    └── app.js         # Core controller, event coordination, lifecycle init
```

---

## 4. Component-by-Component API & Exports

### 4.1. `js/config.js`
Houses global static parameters and styling translation layers.
- `DROPS`: Array of drop objects. Each drop definition contains:
  - `name`: Full identifier (e.g., `'Desadoc'`).
  - `shortName`: Short abbreviation.
  - `color`: String matching a key in `COLOR_MAP` (e.g., `'sky'`, `'violet'`).
  - `offsetMinutes`: Minutes from the start of the current cycle.
- `CYCLES`: Number of daily iteration blocks (Default: `4`).
- `CYCLE_GAP_HOURS`: Distance between cycles (Default: `4`).
- `STORAGE_KEY`: LocalStorage key for schedule state (`'healeyestracker_data'`).
- `NOTIFIED_KEYS_STORAGE`: LocalStorage key for notification suppression (`'healeyetracker_notified'`).
- `COLOR_MAP`: Maps colors to specific Tailwind utility classes for UI generation (since dynamic strings can't be compiled by Tailwind CDN).

### 4.2. `js/utils.js`
Provides mathematical and formatting operations on time strings and arrays.
- `pad(n)`: Pads a number with a leading zero if `< 10`.
- `minutesToTime(totalMinutes)`: Converts numeric minutes since midnight (wrapping around 24 hours/1440 minutes) to `"HH:MM"`.
- `timeToMinutes(timeStr)`: Converts `"HH:MM"` format to integer minutes.
- `getCurrentTimeStr()`: Returns the local device time as `"HH:MM"`.
- `formatDateIT(date)`: Formats standard `Date` objects into Italian format (e.g., `"Lunedì 15 Gennaio 2026"`).

### 4.3. `js/storage.js`
Mediates state persistence.
- `saveSchedule(schedule)`: Saves state to `STORAGE_KEY`.
- `loadSchedule()`: Loads and parses state.
- `clearSchedule()`: Deletes storage and clears notifications.
- `isExpired(data)`: Returns `true` if `data.createdAt` is older than 24 hours.
- Notification key storage utilities: `getNotifiedKeys()`, `addNotifiedKey(key)`, `clearNotifiedKeys()`.

### 4.4. `js/ui.js`
Exclusively manages DOM interaction and screen transitions.
- `elements`: Object containing cached references to DOM elements (`setupScreen`, `confirmModal`, `progressBar`, etc.).
- `showSetup()` / `showDashboard()`: Helper functions to toggle view visibilities.
- `renderDashboard(schedule, onToggleDose)`: Generates and injects HTML for each turn/cycle and medicine card dynamically. Emits click handlers up to `onToggleDose`.

### 4.5. `js/notifications.js`
Handles PWA status updates and notification scheduling checks.
- `swRegistration`: Reference to the active Service Worker registration.
- `registerServiceWorker()`: Instantiates PWA offline caching.
- `updateNotificationBanner()`: Toggles the banner display based on `Notification.permission` (`default`, `granted`, `denied`, or `unsupported`).
- `sendNotification(title, body, tag)`: Leverages the Service Worker controller to display a push notification. Fallback to direct client-side notifications if necessary.
- `checkNotificationSchedule()`: Evaluates the delta of current time versus all unscheduled drops to issue pre-alerts (`-5` to `-4` min) and reminders (`+5` to `+6` min).
- `startNotificationChecker()`: Instantiates the interval check loop running every 60 seconds.

### 4.6. `js/app.js`
The controller layer orchestrating the flow. It ties DOM event listeners to state transitions:
- Manages `schedule` (internal mutable memory).
- Listens to schedule creations (`btnGenerate`).
- Handles checking/unchecking doses (`handleToggleDose`).
- Coordinates shift calculations on early/late logs via `handleRecalcYes` / `handleRecalcNo`.

---

## 5. Development Guidelines (Dev & Build)

Vite is configured to parse the static file directory. The development flow works as follows:

```bash
# Install dependencies
npm install

# Start local server (dev)
npm run dev

# Compile files and output to dist/ folder (production)
npm run build

# Preview build locally
npm run preview
```

### Extending the Project (Notes for AI and Developers):
1. **Dynamic Drop Addition:** To add new drops, edit the `DROPS` array in `js/config.js`. The UI and scheduler calculate positions dynamically based on this array.
2. **Notification Customization:** Pre-alerts and reminders are calculated relative to `dose.time` in `js/notifications.js` -> `checkNotificationSchedule()`. Modify the time bounds here if different offsets are requested.
3. **PWA Offline Work:** The offline files cached are defined in `public/sw.js`. When adding new core script files or stylesheets, update the cache manifest inside the service worker.

// ─────────────────────────────────────────────────────────────
// Service Worker — Tracker Colliri PWA
// Gestisce: caching offline, notifiche locali, click su notifica
// ─────────────────────────────────────────────────────────────

const CACHE_NAME = 'memocollirio-sw-v1';

// Asset da pre-cacheare all'installazione
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Dominî da cacheare a runtime (CDN Tailwind + Google Fonts)
const RUNTIME_CACHE_HOSTS = [];

// ── Install ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // Attiva subito senza aspettare che le tab vecchie si chiudano
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  // Elimina cache vecchie
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  // Prendi controllo immediato di tutte le pagine aperte
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Solo richieste GET
  if (event.request.method !== 'GET') return;

  // CDN / Google Fonts → Cache-first con network fallback
  if (RUNTIME_CACHE_HOSTS.some((host) => url.hostname.includes(host))) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(event.request).then((networkResponse) => {
            // Copia in cache per uso offline futuro
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Asset locali → Network-first con cache fallback
  // Questo assicura che gli aggiornamenti all'HTML arrivino subito,
  // ma l'app funzioni anche offline
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Aggiorna la cache con la risposta fresca
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Offline → serve dalla cache
          return caches.match(event.request);
        })
    );
    return;
  }
});

// ── Messaggi dall'app (richiesta di mostrare notifiche) ──────
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, data, triggerTimestamp } = event.data.payload;
    const options = {
      body,
      tag, // Evita notifiche duplicate con lo stesso tag
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [200, 100, 200, 100, 200], // Vibrazione prominente per anziani
      requireInteraction: true, // Resta visibile finché l'utente non interagisce
      data: data || {},
    };

    if (triggerTimestamp && 'TimestampTrigger' in self) {
      options.showTrigger = new TimestampTrigger(triggerTimestamp);
    }

    self.registration.showNotification(title, options);
  }
});

// ── Click su notifica ────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Prova a trovare una finestra già aperta dell'app e portarla in primo piano
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se c'è già una tab aperta, focalizzala
      for (const client of clientList) {
        if (client.url.includes('index.html') || client.url.endsWith('/')) {
          return client.focus();
        }
      }
      // Altrimenti apri una nuova finestra
      return self.clients.openWindow('./index.html');
    })
  );
});

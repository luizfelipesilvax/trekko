// Trekko Service Worker — PWA offline support
const CACHE_NAME = 'trekko-v1';
const CACHED_PAGES = [
  './login.html',
  './criar-conta.html',
  './dashboard.html',
  './perfil.html',
  './recuperar-senha.html',
  './sucesso.html',
  './404.html',
  './manutencao.html',
  './manifest.json',
];

// Install: cache all pages
self.addEventListener('install', event => {
  console.log('[Trekko SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Trekko SW] Caching pages');
      return Promise.allSettled(
        CACHED_PAGES.map(url => cache.add(url).catch(e => console.warn('[Trekko SW] Failed to cache:', url, e)))
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  console.log('[Trekko SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[Trekko SW] Deleting old cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Skip external requests (fonts, CDN etc.)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      })
      .catch(() => {
        // Network failed — serve from cache
        return caches.match(event.request).then(cached => {
          if (cached) {
            console.log('[Trekko SW] Serving from cache:', event.request.url);
            return cached;
          }
          // If HTML page not found in cache, serve offline fallback
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('./manutencao.html');
          }
        });
      })
  );
});

// Background sync — retry failed requests
self.addEventListener('sync', event => {
  if (event.tag === 'retry-requests') {
    console.log('[Trekko SW] Background sync triggered');
  }
});

// Push notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Trekko';
  const options = {
    body: data.body || 'Você tem uma nova notificação!',
    icon: data.icon || './uploads/trekko-logo2-transparent.png',
    badge: './uploads/trekko-logo2-transparent.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || './dashboard.html' },
    actions: [
      { action: 'open', title: 'Ver agora' },
      { action: 'close', title: 'Dispensar' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

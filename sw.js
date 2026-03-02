const CACHE_NAME = 'winner-europa-v11';

const ASSETS = [
  '/winner-europa/',
  '/winner-europa/manifest.json',
  '/winner-europa/trebol-192.png',
  '/winner-europa/trebol-512.png',
  '/winner-europa/fondo_winner.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // 🔥 HTML SIEMPRE desde red
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(req));
    return;
  }

  // Assets: cache primero
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
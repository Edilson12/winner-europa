const CACHE_NAME = 'winner-europa-v12';

// 🛠️ Rutas corregidas para compatibilidad total con GitHub Pages
const ASSETS = [
  './',
  './index.html', // Asegúrate de que tu archivo principal se llame así
  './manifest.json',
  './trebol-192.png',
  './trebol-512.png',
  './fondo_winner.jpg'
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
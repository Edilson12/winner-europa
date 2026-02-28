const CACHE_NAME = 'winner-europa-v10';

const ASSETS = [
  '/winner-europa/',
  '/winner-europa/index.html',
  '/winner-europa/manifest.json',
  '/winner-europa/trebol-192.png',
  '/winner-europa/trebol-512.png',
  '/winner-europa/fondo_winner.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
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
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
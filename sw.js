const CACHE_NAME = 'walktracker-v1';
const SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isMapTiler = url.hostname.includes('maptiler');
  const isTile = url.pathname.includes('/tiles/');

  if (isMapTiler && isTile) {
    e.respondWith(
      caches.match(e.request).then(cached =>
        cached || fetch(e.request).then(resp => {
          const cloned = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloned));
          return resp;
        }).catch(() => new Response('', { status: 503 }))
      )
    );
    return;
  }

  if (isMapTiler) {
    e.respondWith(
      fetch(e.request).then(resp => {
        const cloned = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloned));
        return resp;
      }).catch(() => caches.match(e.request).then(cached =>
        cached || new Response('', { status: 503 })
      ))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        const cloned = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloned));
        return resp;
      })
    )
  );
});

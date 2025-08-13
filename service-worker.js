// SW sin caché: todo va de red siempre
self.addEventListener('install', (e) => {
  self.skipWaiting(); // activa esta versión inmediatamente
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim(); // controla ya las pestañas abiertas
});

// Siempre red (sin usar caché)
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});

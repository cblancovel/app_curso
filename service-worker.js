const CACHE = 'curso-ia-v10';
const SHELL = [
  './',
  './index.html','./app.js','./manifest.json','./logo.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();        // activa la nueva versión sin esperar
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();      // controla inmediatamente las pestañas abiertas
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const dest = e.request.destination;

  // Datos (JSON en /data/): network-first
  if (url.pathname.includes('/data/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Imágenes: network-first
  if (dest === 'image') {
    e.respondWith(
      fetch(e.request).then(r => {
        caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // App shell: cache-first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

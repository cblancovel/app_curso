const CACHE = 'curso-ia-v6'; // súbelo cuando hagas cambios
const PRECACHE = [
  './',
  './index.html','./app.js','./manifest.json','./logo.png',
  './data/notices.json','./data/materials.json','./data/speakers.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

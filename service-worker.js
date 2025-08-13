const CACHE = 'curso-ia-v8'; // sube el número en cada cambio
const PRECACHE = [
  './',
  './index.html','./app.js','./manifest.json','./logo.png',
  './data/notices.json','./data/materials.json','./data/speakers.json'
];

// Precache básico
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
});

// Limpia cachés viejas
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

// Estrategia:
// - Imágenes: network-first (así ves fotos nuevas al instante)
// - Resto: cache-first
self.addEventListener('fetch', (e) => {
  const dest = e.request.destination;
  if (dest === 'image') {
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(()=>{});
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

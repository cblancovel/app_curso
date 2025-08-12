self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('curso-ia-v1').then(cache => cache.addAll([
      './','./index.html','./app.js','./manifest.json','./logo.png','./data/notices.json','./data/materials.json'
    ]))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('curso-ia-v2').then(cache => cache.addAll([
      './','./index.html','./app.js','./manifest.json','./logo.png',
      './data/notices.json','./data/materials.json','./data/speakers.json'
    ]))
  );
});

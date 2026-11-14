// Automatisch gegenereerd door tools/gen-sw.mjs — niet met de hand aanpassen.
const CACHE = 'sinterklescape-3d555296b4';
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/app.css",
  "./js/art.js",
  "./js/certificate.js",
  "./js/content.js",
  "./js/data.js",
  "./js/games/basis.js",
  "./js/games/common.js",
  "./js/games/echt.js",
  "./js/games/index.js",
  "./js/games/meer.js",
  "./js/main.js",
  "./js/parent.js",
  "./js/round.js",
  "./js/screens.js",
  "./js/sfx.js",
  "./js/speech.js",
  "./js/store.js",
  "./js/task.js",
  "./js/ui.js",
  "./js/util.js",
  "./img/icon-180.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/icon.svg",
  "./vendor/jsQR.js",
  "./print/kaartjes.html"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

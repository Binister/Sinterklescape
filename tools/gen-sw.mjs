// Genereert sw.js met de lijst van alle bestanden (voor offline spelen).
// Gebruik: node tools/gen-sw.mjs
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const roots = ['index.html', 'manifest.webmanifest', 'css', 'js', 'img', 'vendor', 'print'];
const files = [];
const walk = (p) => {
  const st = statSync(p);
  if (st.isDirectory()) readdirSync(p).sort().forEach((f) => walk(join(p, f)));
  else files.push(p);
};
roots.forEach(walk);
const hash = createHash('sha1');
files.forEach((f) => hash.update(f).update(readFileSync(f)));
const version = hash.digest('hex').slice(0, 10);
const list = ['./', ...files.map((f) => './' + f.replace(/\\/g, '/'))];

writeFileSync('sw.js', `// Automatisch gegenereerd door tools/gen-sw.mjs — niet met de hand aanpassen.
const CACHE = 'sinterklescape-${version}';
const FILES = ${JSON.stringify(list, null, 2)};

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
`);
console.log('sw.js:', files.length, 'bestanden, versie', version);

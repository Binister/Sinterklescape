// Opslag: instellingen en voortgang in localStorage, foto's in IndexedDB.

const KEY = 'sinterklescape:v1';

const DEFAULT = () => ({
  versie: 1,
  kind: { naam: '', uitspraak: '', fotoId: null, teken: 'ster', favorieten: { kleur: 'rood', dier: null, eten: null, speelgoed: null } },
  familie: [],
  ronde: null,
  geschiedenis: [],
  instellingen: { geluid: true, extraMagie: false, spreektempo: 'normaal', stem: '' },
  ingesteld: false,
});

let state = DEFAULT();
let storageOk = true;

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      const d = DEFAULT();
      state = { ...d, ...s, kind: { ...d.kind, ...s.kind, favorieten: { ...d.kind.favorieten, ...(s.kind?.favorieten || {}) } }, instellingen: { ...d.instellingen, ...s.instellingen } };
    }
    localStorage.setItem(KEY + ':test', '1');
    localStorage.removeItem(KEY + ':test');
  } catch (e) {
    storageOk = false;
  }
  return state;
}

export const get = () => state;
export const isStorageOk = () => storageOk;

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    storageOk = false;
  }
}

export function reset() {
  state = DEFAULT();
  save();
}

// ---------- foto's ----------
const photoCache = new Map();
let dbp = null;

function db() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open('sinterklescape', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('fotos');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (e) { reject(e); }
  });
  return dbp;
}

async function idb(mode, fn) {
  const d = await db();
  return new Promise((resolve, reject) => {
    const tx = d.transaction('fotos', mode);
    const st = tx.objectStore('fotos');
    const req = fn(st);
    tx.oncomplete = () => resolve(req && req.result);
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadPhotos() {
  try {
    const d = await db();
    await new Promise((resolve) => {
      const tx = d.transaction('fotos', 'readonly');
      const req = tx.objectStore('fotos').openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { photoCache.set(c.key, c.value); c.continue(); } else resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (e) { /* geen IndexedDB: dan maar zonder foto's */ }
}

export const photo = (id) => (id ? photoCache.get(id) || null : null);

export async function putPhoto(dataUrl, id) {
  id = id || 'f' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  photoCache.set(id, dataUrl);
  try { await idb('readwrite', (st) => st.put(dataUrl, id)); } catch (e) { /* alleen in geheugen */ }
  return id;
}

export async function deletePhoto(id) {
  if (!id) return;
  photoCache.delete(id);
  try { await idb('readwrite', (st) => st.delete(id)); } catch (e) { /* negeren */ }
}

export async function clearPhotos() {
  photoCache.clear();
  try { await idb('readwrite', (st) => st.clear()); } catch (e) { /* negeren */ }
}

/** Bestand (van <input type=file>) → verkleinde, vierkant bijgesneden JPEG data-URL. */
export function fileToDataUrl(file, size = 480, square = true) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = square ? Math.min(img.width, img.height) : null;
      const cw = square ? size : Math.round(Math.min(1, size / Math.max(img.width, img.height)) * img.width);
      const ch = square ? size : Math.round(Math.min(1, size / Math.max(img.width, img.height)) * img.height);
      const c = document.createElement('canvas');
      c.width = cw; c.height = ch;
      const g = c.getContext('2d');
      if (square) {
        // iets boven het midden, want gezichten zitten meestal in het bovenste deel
        const sx = (img.width - s) / 2;
        const sy = Math.max(0, (img.height - s) / 2 - (img.height - s) * 0.15);
        g.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      } else {
        g.drawImage(img, 0, 0, cw, ch);
      }
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });
}

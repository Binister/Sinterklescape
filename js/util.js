// Algemene hulpfuncties

export const STAGE_W = 1200;
export const STAGE_H = 860;
export const TEST = new URLSearchParams(location.search).has('test');

export const sleep = (ms) => new Promise((r) => setTimeout(r, TEST ? Math.min(ms, 30) : ms));

/** Maak een element. attrs: class, style (object of string), html, text, on<event>, overige attributen. */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

/** Absoluut gepositioneerd element in stage-coördinaten. */
export function place(el, x, y, w, hgt) {
  Object.assign(el.style, { position: 'absolute', left: x + 'px', top: y + 'px' });
  if (w != null) el.style.width = w + 'px';
  if (hgt != null) el.style.height = hgt + 'px';
  return el;
}

// ---------- seeded random ----------
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const r = {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    shuffle: (arr) => {
      const a2 = arr.slice();
      for (let i = a2.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [a2[i], a2[j]] = [a2[j], a2[i]];
      }
      return a2;
    },
    sample: (arr, n) => r.shuffle(arr).slice(0, n),
    chance: (p) => next() < p,
  };
  return r;
}

export function hashStr(s) {
  let h1 = 2166136261;
  for (let i = 0; i < s.length; i++) h1 = Math.imul(h1 ^ s.charCodeAt(i), 16777619);
  return h1 >>> 0;
}

export const freshRng = () => makeRng((Math.random() * 2 ** 32) >>> 0);

// ---------- stage schalen ----------
let scale = 1;
export const getScale = () => scale;
export function fitStage() {
  const stage = document.getElementById('stage');
  const vw = window.innerWidth, vh = window.innerHeight;
  scale = Math.min(vw / STAGE_W, vh / STAGE_H);
  stage.style.transform = `scale(${scale}) translate(-50%, -50%)`;
  stage.style.transformOrigin = '0 0';
  // translate(-50%) na scale: werkt omdat left/top 50% van viewport is
}

/** Client-coördinaten → stage-coördinaten. */
export function toStage(clientX, clientY) {
  const r = document.getElementById('stage').getBoundingClientRect();
  return { x: (clientX - r.left) / scale, y: (clientY - r.top) / scale };
}

/** Middelpunt van een element in stage-coördinaten. */
export function centerOf(el) {
  const r = el.getBoundingClientRect();
  return toStage(r.left + r.width / 2, r.top + r.height / 2);
}

export function rectOf(el) {
  const r = el.getBoundingClientRect();
  const a = toStage(r.left, r.top);
  return { x: a.x, y: a.y, w: r.width / scale, h: r.height / scale };
}

/** Eenvoudige kleur-hulp */
export const KLEUREN = {
  rood: '#d7263d', oranje: '#f28c28', geel: '#f6d33c', groen: '#45b649',
  blauw: '#2f7de1', paars: '#8e44ad', roze: '#f47eb4', turkoois: '#1fb5a9',
};

export function onceEvent(el, ev) {
  return new Promise((r) => el.addEventListener(ev, r, { once: true }));
}

// Geluidseffecten, gesynthetiseerd met Web Audio (geen geluidsbestanden nodig).

import * as store from './store.js';

let ctx = null;

export function unlock() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    // stille buffer om iOS te ontgrendelen
    const b = ctx.createBuffer(1, 1, 22050);
    const s = ctx.createBufferSource();
    s.buffer = b; s.connect(ctx.destination); s.start(0);
  } catch (e) { ctx = null; }
}

export const audioCtx = () => ctx;
const on = () => {
  if (!ctx || !store.get().instellingen.geluid) return false;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return true;
};

function tone(freq, start, dur, { type = 'sine', vol = 0.18, slide = 0 } = {}) {
  const t0 = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(start, dur, { vol = 0.15, freq = 1200, q = 1 } = {}) {
  const t0 = ctx.currentTime + start;
  const len = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ctx.createBufferSource();
  s.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(ctx.destination);
  s.start(t0);
}

export const sfx = {
  tap() { if (on()) tone(660, 0, 0.08, { type: 'triangle', vol: 0.12 }); },
  pick() { if (on()) tone(520, 0, 0.1, { type: 'triangle', vol: 0.12, slide: 200 }); },
  drop() { if (on()) tone(380, 0, 0.12, { type: 'triangle', vol: 0.14, slide: -120 }); },
  good() {
    if (!on()) return;
    [784, 988, 1175].forEach((f, i) => tone(f, i * 0.07, 0.25, { type: 'sine', vol: 0.14 }));
  },
  wrong() {
    if (!on()) return;
    tone(300, 0, 0.18, { type: 'sine', vol: 0.15, slide: -120 });
    tone(220, 0.16, 0.22, { type: 'sine', vol: 0.12, slide: -60 });
  },
  party() {
    if (!on()) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.35, { type: 'triangle', vol: 0.13 }));
    [2093, 2637, 3136].forEach((f, i) => tone(f, 0.5 + i * 0.06, 0.3, { type: 'sine', vol: 0.06 }));
  },
  fanfare() {
    if (!on()) return;
    const n = [[523, 0, 0.18], [523, 0.2, 0.18], [523, 0.4, 0.18], [659, 0.6, 0.5], [784, 1.1, 0.25], [659, 1.35, 0.2], [784, 1.6, 0.8]];
    n.forEach(([f, s, d]) => { tone(f, s, d, { type: 'sawtooth', vol: 0.07 }); tone(f * 2, s, d, { type: 'sine', vol: 0.05 }); });
  },
  whoosh() { if (on()) noise(0, 0.35, { vol: 0.25, freq: 900, q: 0.7 }); },
  hoof() {
    if (!on()) return;
    [0, 0.14, 0.42, 0.56].forEach((s) => { noise(s, 0.06, { vol: 0.5, freq: 600, q: 3 }); tone(180, s, 0.05, { type: 'square', vol: 0.05 }); });
  },
  toot() {
    if (!on()) return;
    tone(196, 0, 1.1, { type: 'sawtooth', vol: 0.09 });
    tone(247, 0, 1.1, { type: 'sawtooth', vol: 0.07 });
  },
  ping() { if (on()) { tone(1568, 0, 0.6, { vol: 0.12 }); tone(2093, 0.05, 0.5, { vol: 0.06 }); } },
  click() { if (on()) noise(0, 0.05, { vol: 0.5, freq: 3000, q: 2 }); },
  flip() { if (on()) noise(0, 0.12, { vol: 0.2, freq: 2200, q: 1 }); },
  boing() { if (on()) tone(200, 0, 0.35, { type: 'sine', vol: 0.18, slide: 500 }); },
  quack() { if (on()) { tone(420, 0, 0.12, { type: 'sawtooth', vol: 0.08, slide: -150 }); tone(400, 0.16, 0.12, { type: 'sawtooth', vol: 0.08, slide: -150 }); } },
  count(n) { if (on()) tone(440 + n * 60, 0, 0.15, { type: 'triangle', vol: 0.14 }); },
  step() { if (on()) tone(330, 0, 0.07, { type: 'square', vol: 0.05 }); },
};

// Echte-wereld-opdrachten: zoeken in huis, foto, zingen, QR-kaartje, bewegen.
// Elke opdracht heeft een vangnet, zodat hij nooit kan vastlopen.

import { h, place, sleep, TEST } from '../util.js';
import { bigButton, sparkleOn, handTap } from '../ui.js';
import { sfx, audioCtx } from '../sfx.js';
import * as store from '../store.js';
import { ding, TEKENS, KAART_SYMBOOL } from '../data.js';
import * as speech from '../speech.js';
import { box, row } from './common.js';

function showcase(api, el, y = 140, size = 300) {
  if (typeof el === 'function') el = el(size);
  const b = box(el, 600 - size / 2, y, size, size);
  b.classList.add('bob');
  api.root.append(b);
  return b;
}

function thumbButton(api, onDone) {
  const b = bigButton('👍', () => onDone(), 'groen');
  b.style.position = 'absolute';
  place(b, 600 - 80, 560, 160, 160);
  b.style.fontSize = '90px';
  b.classList.add('pop-in');
  api.root.append(b);
  return b;
}

// ---------------- R1 Zoek in huis (zelf bevestigen) ----------------
// cfg: { show: () => el, instr, then? }
export function zoekInHuis(api, cfg) {
  showcase(api, cfg.show);
  let btn = null;
  const reveal = () => {
    if (btn) return;
    btn = thumbButton(api, () => api.done());
  };
  api.hint(() => (btn ? { el: btn } : { el: api.root, demo: async () => reveal() }));
  api.instruct(cfg.instr).then(async () => {
    await sleep(3500);
    if (!api.finished) {
      await api.say(api.T('Gevonden? Tik dan op de duim!'));
      reveal();
    }
  });
}

// ---------------- R5 Bewegen ----------------
// cfg: { show: () => el, n, instr, word: 'spring' }
export function bewegen(api, cfg) {
  const fig = showcase(api, cfg.show);
  fig.classList.remove('bob');
  let started = false;
  const go = bigButton('▶️', () => run(), 'groen');
  go.style.position = 'absolute';
  place(go, 600 - 70, 560, 140, 140);
  api.root.append(go);
  const counter = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '450px', textAlign: 'center', fontSize: '110px', fontWeight: 900, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,.25)' } });
  api.root.append(counter);

  async function run() {
    if (started) return;
    started = true;
    go.remove();
    const n = cfg.n || 5;
    for (let i = 1; i <= n; i++) {
      counter.textContent = i;
      sfx.count(i);
      fig.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-90px)' }, { transform: 'translateY(0)' }], { duration: 600, easing: 'ease-out' });
      await speech.say(String(i), 'piet');
      await sleep(TEST ? 5 : 450);
      api.touch();
    }
    counter.textContent = '';
    sparkleOn(fig, 14);
    await api.say(api.T('Wauw, wat goed! Klaar? Tik op de duim.'));
    thumbButton(api, () => api.done());
  }

  api.hint(() => {
    const b = api.root.querySelector('.big-btn');
    return b ? { el: b } : null;
  });
  api.instruct(cfg.instr);
}

// ---------------- R2 Foto voor Sint ----------------
// cfg: { show: () => el, instr, label }
export function foto(api, cfg) {
  showcase(api, cfg.show, 130, 240);
  const input = h('input', { type: 'file', accept: 'image/*', capture: 'environment', style: { display: 'none' } });
  api.root.append(input);
  let tries = 0;
  let fallback = null;
  const cam = bigButton('📷', () => { tries++; input.value = ''; input.click(); if (tries >= 2) setTimeout(showFallback, 4000); });
  cam.style.position = 'absolute';
  place(cam, 600 - 90, 470, 180, 180);
  cam.style.fontSize = '96px';
  api.root.append(cam);

  input.addEventListener('change', async () => {
    const f = input.files && input.files[0];
    if (!f) return;
    try {
      const url = await store.fileToDataUrl(f, 640, false);
      const id = await store.putPhoto(url);
      const s = store.get();
      if (s.ronde) { s.ronde.fotos = s.ronde.fotos || []; s.ronde.fotos.push({ id, label: cfg.label || '' }); store.save(); }
      showPolaroid(url);
    } catch (e) {
      showFallback();
    }
  });

  async function showPolaroid(url) {
    cam.remove();
    if (fallback) fallback.remove();
    const pol = h('div', { style: { position: 'absolute', left: '400px', top: '140px', width: '400px', padding: '18px 18px 60px', background: '#fff', borderRadius: '6px', boxShadow: '0 14px 30px rgba(0,0,0,.35)', transform: 'rotate(-4deg)', zIndex: 20 } },
      h('img', { src: url, style: { width: '100%', height: '340px', objectFit: 'cover', display: 'block' } }));
    api.root.append(pol);
    pol.classList.add('pop-in');
    sfx.click();
    sparkleOn(pol, 12);
    await api.say(api.T('Wat een mooie foto! Die bewaart Sint in zijn Grote Boek.'), 'sint');
    api.done();
  }

  function showFallback() {
    if (fallback || api.finished) return;
    fallback = thumbButton(api, () => api.done());
    fallback.style.left = '820px';
    fallback.style.top = '490px';
  }

  api.hint(() => ({
    el: fallback || cam,
    demo: async () => {
      if (TEST) { api.done(); return; }
      if (fallback) { fallback.click(); return; }
      await handTap(cam);
      showFallback();
    },
  }));
  api.instruct(cfg.instr);
}

// ---------------- R3 Zingen / roepen (alleen volume) ----------------
// cfg: { show: () => el, instr, seconds }
export function zingen(api, cfg) {
  const fig = showcase(api, cfg.show, 120, 260);
  const meter = h('div', { class: 'meter', style: { top: '420px' } }, h('div'));
  api.root.append(meter);
  const bar = meter.firstChild;
  const need = (cfg.seconds || 5) * 1000;
  let have = 0;
  let stream = null;
  let raf = 0;
  let doneFlag = false;
  let fallback = null;
  api.cleanup(() => { doneFlag = true; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); });
  const mic = bigButton('🎤', () => startMic());
  mic.style.position = 'absolute';
  place(mic, 600 - 75, 540, 150, 150);
  api.root.append(mic);

  const finish = () => {
    if (doneFlag) return;
    doneFlag = true;
    cancelAnimationFrame(raf);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    bar.style.width = '100%';
    sparkleOn(fig, 14);
    api.done();
  };

  async function startMic() {
    mic.remove();
    // vangnet: na 15 seconden altijd een duim
    setTimeout(showFallback, TEST ? 10 : 15000);
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = audioCtx() || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') await ctx.resume();
      const src = ctx.createMediaStreamSource(stream);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      let last = performance.now();
      const loop = (t) => {
        if (doneFlag) return;
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / buf.length);
        const dt = t - last; last = t;
        if (rms > 0.04) { have += dt; api.touch(); fig.style.transform = `scale(${1 + Math.min(.25, rms)})`; } else fig.style.transform = '';
        bar.style.width = Math.min(100, (have / need) * 100) + '%';
        if (have >= need) { finish(); return; }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } catch (e) {
      showFallback();
    }
  }

  function showFallback() {
    if (fallback || doneFlag || api.finished) return;
    fallback = thumbButton(api, finish);
    fallback.style.left = '880px';
  }

  api.hint(() => {
    if (fallback) return { el: fallback };
    const m = api.root.querySelector('.big-btn');
    if (m) return { el: m, demo: async () => { await handTap(m); if (TEST) finish(); else showFallback(); } };
    return { el: meter, demo: async () => { if (TEST) finish(); else showFallback(); } };
  });
  api.instruct(cfg.instr);
}

// ---------------- R4 QR-kaartje (extra magie) ----------------
// cfg: { symbool, show: () => el, instr }
export function qr(api, cfg) {
  const want = cfg.symbool;
  showcase(api, cfg.show, 120, 220);
  let stream = null, timer = 0, ended = false;
  const camBox = h('div', { class: 'cam-box', style: { display: 'none' } }, h('video', { playsinline: true, muted: true, autoplay: true }), h('div', { class: 'frame' }));
  api.root.append(camBox);
  const video = camBox.querySelector('video');
  const cam = bigButton('📷', () => start());
  cam.style.position = 'absolute';
  place(cam, 600 - 90, 470, 180, 180);
  cam.style.fontSize = '96px';
  api.root.append(cam);
  const help = h('button', { class: 'small-btn', style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '30px', display: 'none' }, text: '🤔 Lukt het niet?' });
  help.addEventListener('click', () => { sfx.tap(); choose(); });
  api.root.append(help);
  setTimeout(() => { help.style.display = ''; }, TEST ? 0 : 8000);

  const stop = () => {
    clearInterval(timer);
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
  };
  api.cleanup(() => { ended = true; stop(); });

  async function start() {
    cam.remove();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      video.srcObject = stream;
      await video.play().catch(() => {});
      camBox.style.display = '';
      api.root.querySelector('.bob')?.remove();
      const c = document.createElement('canvas');
      const g = c.getContext('2d', { willReadFrequently: true });
      timer = setInterval(() => {
        if (ended || !video.videoWidth || !window.jsQR) return;
        const w = 480, hh = Math.round((video.videoHeight / video.videoWidth) * 480);
        c.width = w; c.height = hh;
        g.drawImage(video, 0, 0, w, hh);
        const res = window.jsQR(g.getImageData(0, 0, w, hh).data, w, hh, { inversionAttempts: 'dontInvert' });
        if (res && res.data) found(res.data);
      }, 250);
    } catch (e) {
      choose();
    }
  }

  let lastWrong = 0;
  function found(data) {
    const m = /SINTERKLESCAPE:(\w+)/i.exec(data);
    if (!m) return;
    if (m[1].toLowerCase() === want) win();
    else if (performance.now() - lastWrong > 5000) {
      lastWrong = performance.now();
      sfx.wrong();
      api.say(api.T('Dat is een ander kaartje! Zoek het kaartje met {x}.', { x: TEKENS[want].n }));
    }
  }

  async function win() {
    if (ended) return;
    ended = true;
    stop();
    camBox.remove();
    help.remove();
    const big = showcase(api, ding(want, 260), 200, 300);
    sfx.party();
    sparkleOn(big, 16);
    await api.say(api.T('Je hebt het kaartje gevonden! Goed gezocht!'));
    api.done();
  }

  let choosing = false;
  async function choose() {
    if (choosing || ended) return;
    choosing = true;
    stop();
    api.root.replaceChildren();
    const keys = [want, ...api.rng.sample(Object.keys(TEKENS).filter((k) => k !== want), 3)];
    const opts = api.rng.shuffle(keys);
    const ps = row(4, { cx: 600, y: 360, size: 190, gap: 40 });
    opts.forEach((k, i) => {
      const c = h('button', { class: 'card' });
      place(c, ps[i].x, ps[i].y, 190, 190);
      c.append(ding(k, 140));
      c.addEventListener('click', () => { if (k === want) { api.good(c); ended = true; api.done(); } else api.bad(c); });
      api.root.append(c);
    });
    api.hint(() => ({ el: api.root.querySelectorAll('.card')[opts.indexOf(want)] }));
    await api.instruct(api.T('Welk plaatje staat er op het kaartje? Tik erop!'));
  }

  api.hint(() => ({ el: help.style.display === 'none' ? cam : help, demo: async () => choose() }));
  api.instruct(cfg.instr);
}

export const symboolVoor = (plek) => KAART_SYMBOOL[plek];

// Schermen: start, intro, kaart, plek, finale, oorkonde, plakboek.

import { h, place, sleep, TEST } from './util.js';
import * as A from './art.js';
import * as store from './store.js';
import * as speech from './speech.js';
import { sfx, unlock as unlockAudio } from './sfx.js';
import { confetti, sparkle, sparkleOn, bigButton } from './ui.js';
import { T, ding, portret, kind, familie, teken, TEKENS, PAARD } from './data.js';
import { PLEKKEN, PROBLEMEN, FINALE_INTRO, plekById } from './content.js';
import * as round from './round.js';
import { runTask } from './task.js';
import { makeRng } from './util.js';
import { makeCertificate } from './certificate.js';

const st = () => document.getElementById('stage');
const svgEl = (markup, w, hh = w) => h('div', { style: { width: w + 'px', height: hh + 'px' }, html: markup });

let unlocked = false;

function screen(bgKey, decorKey) {
  const s = h('div', { class: 'screen', style: { background: A.bg[bgKey] || bgKey } });
  if (decorKey) s.innerHTML = A.decor(decorKey);
  st().replaceChildren(s);
  return s;
}

// ---------------- start ----------------
export function startScreen() {
  speech.stop();
  const s = screen('start');
  const title = h('div', { class: 'title-word', style: { position: 'absolute', left: 0, right: 0, top: '40px', textAlign: 'center' }, text: 'Sinterklescape' });
  const sint = h('button', { style: { position: 'absolute', left: '430px', top: '170px', width: '340px', height: '442px', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }, class: 'bob', html: A.sint() });
  const tap = h('div', { class: 'emoji', style: { position: 'absolute', left: '700px', top: '500px', fontSize: '110px', pointerEvents: 'none' }, text: '👆' });
  tap.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-24px)' }, { transform: 'translateY(0)' }], { duration: 900, iterations: Infinity });
  const k = kind();
  const face = k.fotoId ? portret(k, 140) : null;
  if (face) place(face, 140, 560);
  s.append(title, sint, tap);
  if (face) s.append(face);
  // sneeuw / sterren
  for (let i = 0; i < 18; i++) {
    const star = h('div', { class: 'emoji', text: '✨', style: { position: 'absolute', left: (i * 137) % 1200 + 'px', top: 160 + ((i * 251) % 640) + 'px', fontSize: 20 + (i % 3) * 10 + 'px', opacity: 0.7 } });
    s.append(star);
  }
  const go = async () => {
    if (!unlocked) { unlockAudio(); speech.unlock(); unlocked = true; }
    sfx.party();
    sint.style.pointerEvents = 'none';
    tap.remove();
    sparkleOn(sint, 14);
    const r = round.current();
    await speech.say(T(store.get().kind.naam ? 'Hallo {naam}! Wat fijn dat je er bent!' : 'Hallo lieve helper! Wat fijn dat je er bent!'), 'sint');
    if (!r.introGezien) await introScreen();
    else mapScreen();
  };
  sint.addEventListener('click', go);
  s.addEventListener('click', (e) => { if (e.target === s) go(); });
}

// ---------------- intro van een ronde ----------------
export async function introScreen() {
  const r = round.current();
  const prob = PROBLEMEN.find((p) => p.id === r.probleem) || PROBLEMEN[0];
  const s = screen(r.probleem === 'paard' ? 'stal' : r.probleem === 'lek' ? 'stoomboot' : 'werkkamer', r.probleem === 'paard' ? 'stal' : r.probleem === 'lek' ? 'stoomboot' : 'werkkamer');
  const sint = h('div', { style: { position: 'absolute', left: '80px', top: '230px', width: '360px', height: '468px' }, class: 'bob', html: A.sint() });
  s.append(sint);
  // de zes voorwerpen "waaien" weg
  const items = PLEKKEN.map((p, i) => {
    const el = svgEl(A.itemArt[p.item](), 120);
    place(el, 520 + (i % 3) * 200, 220 + Math.floor(i / 3) * 200);
    el.classList.add('pop-in');
    el.style.animationDelay = i * 120 + 'ms';
    s.append(el);
    return el;
  });
  const skip = h('button', { class: 'corner-btn btn-huis', html: '<span class="emoji">⏭️</span>' });
  s.append(skip);
  let skipped = false;
  skip.addEventListener('click', () => { skipped = true; speech.stop(); });

  const lines = [];
  if (store.get().geschiedenis.length) {
    const vorige = store.get().geschiedenis[store.get().geschiedenis.length - 1];
    const vp = PROBLEMEN.find((p) => p.id === vorige.probleem);
    lines.push(T('Vorige keer heb jij mij zo goed geholpen met ' + (vp ? vp.naam : 'pakjesavond') + '. Maar nu is er iets nieuws!'));
  }
  prob.intro.forEach((l) => lines.push(T(l)));
  for (let i = 0; i < lines.length && !skipped; i++) {
    if (i === lines.length - 2 && !skipped) {
      sfx.whoosh();
      items.forEach((el, k) => el.animate([{ transform: 'translate(0,0) rotate(0)' }, { transform: `translate(${(k % 2 ? 1 : -1) * 600}px, ${-300 - k * 40}px) rotate(${360 + k * 90}deg)`, opacity: 0 }], { duration: TEST ? 10 : 1400, delay: k * 90, fill: 'forwards', easing: 'ease-in' }));
    }
    await speech.say(lines[i], 'sint');
  }
  r.introGezien = true;
  store.save();
  mapScreen();
}

// ---------------- kaart ----------------
export function mapScreen() {
  speech.stop();
  document.body.classList.add('game');
  const r = round.current();
  const s = screen('kaart');
  // landschap
  s.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 1200 860" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">
    <path d="M0 175 Q300 120 600 170 T1200 160 V860 H0Z" fill="#a8d98f"/>
    <path d="M60 820 C 260 700 200 420 420 400 S 700 560 760 400 S 1000 260 1150 330" fill="none" stroke="#f3e2b8" stroke-width="46" stroke-linecap="round"/>
    <path d="M60 820 C 260 700 200 420 420 400 S 700 560 760 400 S 1000 260 1150 330" fill="none" stroke="#e6cf98" stroke-width="46" stroke-linecap="round" stroke-dasharray="2 40"/>
    ${[[1040, 60], [220, 30], [640, 20]].map(([x, y]) => `<g transform="translate(${x} ${y}) scale(.7)">${A.wolk().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`).join('')}
    ${[[330, 300], [610, 620], [1100, 560], [40, 380], [1000, 760], [700, 330]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="26" fill="#5fae4a"/><rect x="${x - 5}" y="${y + 18}" width="10" height="20" fill="#7a4a24"/>`).join('')}
  </svg>`);

  PLEKKEN.forEach((p) => {
    const ps = r.plekken[p.id];
    const done = ps.klaar >= ps.taken.length;
    const b = h('button', { class: 'map-place', 'aria-label': p.naam, html: A.plekArt[p.id]() });
    place(b, p.map.x + 60, p.map.y + 60);
    const dots = h('div', { class: 'dots' });
    ps.taken.forEach((_, i) => dots.append(h('i', { class: i < ps.klaar ? 'on' : '' })));
    const badge = h('div', { class: 'item-badge' + (r.voorwerpen.includes(p.item) ? '' : ' missing') }, svgEl(A.itemArt[p.item](), 60));
    b.append(dots, badge);
    if (done) b.append(h('div', { class: 'flag emoji', text: '🚩' }));
    b.addEventListener('click', () => { sfx.tap(); speech.stop(); placeFlow(p); });
    s.append(b);
  });

  // daken (finale)
  const all = round.allCollected();
  const daken = h('button', { class: 'map-place', 'aria-label': 'De daken', html: A.plekArt.daken() });
  place(daken, 1010, 170, 170, 170);
  if (!all) daken.append(h('div', { class: 'emoji', style: { position: 'absolute', right: '0', bottom: '0', fontSize: '56px' }, text: '🔒' }));
  else daken.classList.add('hint-glow');
  daken.addEventListener('click', () => {
    sfx.tap();
    if (!all) speech.say(T('De daken zijn voor het laatst! Verzamel eerst alle zes de dingen voor Sint.'), 'sint');
    else finaleFlow();
  });
  s.append(daken);

  // voorwerpenbalk
  const bar = h('div', { class: 'item-bar' });
  PLEKKEN.forEach((p) => bar.append(h('div', { class: 'slot ' + (r.voorwerpen.includes(p.item) ? 'have' : 'missing') }, svgEl(A.itemArt[p.item](), 62))));
  s.append(bar);

  // plakboek
  if (store.get().geschiedenis.length) {
    const pb = h('button', { class: 'corner-btn', style: { left: '18px', bottom: '18px', background: '#8e44ad' }, html: '<span class="emoji">📒</span>' });
    pb.addEventListener('click', () => { sfx.tap(); scrapbook(); });
    s.append(pb);
  }
  // kind-portret linksboven
  const k = kind();
  const face = portret(k, 96);
  place(face, 22, 18);
  s.append(face);

  const left = PLEKKEN.length - r.voorwerpen.length;
  if (all) speech.say(T('We hebben alles! Tik op de daken, dan gaan we op pad!'), 'sint');
  else if (r.voorwerpen.length === 0 && PLEKKEN.every((p) => r.plekken[p.id].klaar === 0)) speech.say(T('Waar wil je naartoe? Tik op een plek!'), 'piet');
  else speech.say(T('Nog ' + left + ' ' + (left === 1 ? 'ding' : 'dingen') + ' te vinden. Waar gaan we heen?'), 'piet');
}

// ---------------- een plek ----------------
async function placeFlow(plek) {
  const r = round.current();
  const ps = r.plekken[plek.id];
  const rng = makeRng(r.seed + ps.klaar);

  // al klaar? dan een bonusopdracht
  if (ps.klaar >= ps.taken.length) {
    const s = screen(plek.id, plek.id);
    const fig = svgEl(plek.who === 'sint' ? A.sint() : A.piet({ color: A.pietColor(2) }), 300, 390);
    place(fig, 450, 160);
    s.append(fig);
    await speech.say(T('Hier heb je alles al gedaan, {naam}! Wil je nog een bonusopdracht doen?'), plek.who);
    const yes = bigButton('👍', async () => {
      const id = round.bonusTask(plek);
      const t = round.makeTask(plek, id, ':bonus' + ps.bonus);
      await runTask(st(), { type: t.def.type, cfg: t.cfg, who: plek.who }, { plek: plek.id, index: 0, total: 1, rng: t.rng });
      mapScreen();
    }, 'groen');
    const no = bigButton('🗺️', () => mapScreen());
    place(yes, 420, 600, 150, 150); yes.style.position = 'absolute';
    place(no, 640, 600, 150, 150); no.style.position = 'absolute';
    s.append(yes, no);
    return;
  }

  // intro
  const s = screen(plek.id, plek.id);
  const fig = svgEl(plek.who === 'sint' ? A.sint() : A.piet({ color: A.pietColor(PLEKKEN.indexOf(plek)) }), 330, 430);
  place(fig, 120, 260);
  fig.classList.add('bob');
  const item = svgEl(A.itemArt[plek.item](), 230);
  place(item, 640, 240);
  item.style.filter = 'grayscale(1) opacity(.45)';
  const go = bigButton('▶️', () => { started = true; speech.stop(); }, 'groen');
  go.style.position = 'absolute';
  place(go, 690, 560, 150, 150);
  const back = h('button', { class: 'corner-btn btn-huis', html: '<span class="emoji">🗺️</span>' });
  let started = false, quit = false;
  back.addEventListener('click', () => { quit = true; speech.stop(); mapScreen(); });
  s.append(fig, item, go, back);
  const prob = PROBLEMEN.find((p) => p.id === r.probleem);
  const lines = ps.klaar === 0
    ? [T(rng.pick(plek.intro)), T(prob.plekLijn), T('Als je ' + PER(ps) + ' opdrachten doet, krijg je ' + plek.itemNaam + '. Tik op de groene knop!')]
    : [T('Welkom terug, {naam}! We gaan verder. Tik op de groene knop!')];
  (async () => { for (const l of lines) { if (started || quit) break; await speech.say(l, plek.who); } })();
  while (!started && !quit) await sleep(100);
  if (quit) return;

  // opdrachten
  while (ps.klaar < ps.taken.length) {
    const taskId = ps.taken[ps.klaar];
    let t;
    try { t = round.makeTask(plek, taskId); } catch (e) { console.error(e); round.markDone(plek.id); continue; }
    const res = await runTask(st(), { type: t.def.type, cfg: t.cfg, who: plek.who }, { plek: plek.id, index: ps.klaar, total: ps.taken.length, rng: t.rng });
    if (res === 'quit') { mapScreen(); return; }
    round.markDone(plek.id);
  }

  // voorwerp verzameld
  round.collect(plek.id, plek.item);
  await itemCollected(plek);
}

const PER = (ps) => ps.taken.length;

async function itemCollected(plek) {
  const r = round.current();
  const s = screen(plek.id, plek.id);
  const item = svgEl(A.itemArt[plek.item](), 340);
  place(item, 430, 180);
  item.classList.add('pop-in');
  s.append(item);
  sfx.fanfare();
  confetti(140);
  setTimeout(() => sparkleOn(item, 16), 300);
  const left = PLEKKEN.length - r.voorwerpen.length;
  await speech.say(T('Hoera, {naam}! Je hebt ' + plek.itemNaam + ' gevonden!'), plek.who);
  if (left > 0) await speech.say(T('Nog ' + left + ' ' + (left === 1 ? 'ding' : 'dingen') + ' te gaan!'), plek.who);
  else await speech.say(T('Dat was de laatste! Nu kunnen we over de daken!'), 'sint');
  await sleep(500);
  mapScreen();
}

// ---------------- finale ----------------
async function finaleFlow() {
  const r = round.current();
  const s = screen('daken', 'daken');
  const sint = svgEl(A.sint(), 300, 390);
  place(sint, 120, 300);
  const paard = svgEl(A.paard({ zadel: true }), 420, 322);
  place(paard, 560, 380);
  paard.classList.add('bob');
  s.append(sint, paard);
  sfx.hoof();
  await speech.sayAll(FINALE_INTRO.map((l) => T(l)), 'sint');

  const mijnTeken = teken();
  const stappen = [
    {
      type: 'doolhof', cfg: { rows: 4, cols: 6, token: () => svgEl(A.paard({ zadel: true }), 130, 100), goal: () => huisDing(mijnTeken, 130), blocker: () => svgEl(A.schoorsteen(), 90), instr: T('Help ' + PAARD + ' over de daken naar jouw huis! Tik steeds op het dak naast het paard.') },
    },
    (() => {
      const rng = makeRng(r.seed + 99);
      const mensen = rng.sample(familie(3, rng), 3);
      return {
        type: 'sorteer', cfg: {
          bins: mensen.map((p) => ({ key: p.id, render: (sz) => huisPortret(p, sz) })),
          items: mensen.map((p, i) => ({ key: p.id, render: (sz) => pakjeMet(p, ['#d7263d', '#2f7de1', '#45b649'][i], sz), say: T('Dit pakje is voor {p}!', { p }) })),
          instr: T('Nu de pakjes bezorgen! Sleep elk pakje naar het goede huis.'),
        },
      };
    })(),
    (() => {
      const rng = makeRng(r.seed + 7);
      const andere = rng.sample(Object.keys(TEKENS).filter((k) => k !== mijnTeken), 3);
      const all = rng.shuffle([mijnTeken, ...andere]);
      return {
        type: 'kies', cfg: { rounds: [{
          instr: T('En nu jouw schoen! Welke schoen is van jou, {naam}? Kijk naar jouw teken.'),
          options: all.map((k) => ({ key: k, render: (sz) => schoenMet(k, sz) })),
          correct: mijnTeken,
        }] },
      };
    })(),
  ];
  for (let i = 0; i < stappen.length; i++) {
    const res = await runTask(st(), { ...stappen[i], who: 'sint' }, { plek: 'daken', index: i, total: stappen.length, rng: makeRng(r.seed + i * 13) });
    if (res === 'quit') { mapScreen(); return; }
  }
  await celebration();
}

function huisDing(tk, size) {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(svgEl(A.huis(), size));
  const b = ding(tk, size * 0.34);
  Object.assign(b.style, { position: 'absolute', left: size * 0.33 + 'px', top: size * 0.5 + 'px' });
  w.append(b);
  return w;
}
function huisPortret(p, size) {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(svgEl(A.huis(), size));
  const b = portret(p, size * 0.4);
  Object.assign(b.style, { position: 'absolute', left: size * 0.3 + 'px', top: size * 0.5 + 'px' });
  w.append(b);
  return w;
}
function pakjeMet(p, c, size) {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(svgEl(A.pakje(c), size));
  const b = portret(p, size * 0.48);
  Object.assign(b.style, { position: 'absolute', left: size * 0.26 + 'px', top: size * 0.4 + 'px' });
  w.append(b);
  return w;
}
function schoenMet(tk, size) {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(ding('schoen', size));
  const b = ding(tk, size * 0.4);
  Object.assign(b.style, { position: 'absolute', right: '0', top: '0', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 6px rgba(0,0,0,.3)' });
  w.append(b);
  return w;
}

async function celebration() {
  const r = round.current();
  round.finishRound();
  const s = screen('daken', 'daken');
  const sint = svgEl(A.sint(), 340, 442);
  place(sint, 430, 200);
  sint.classList.add('bob');
  s.append(sint);
  sfx.fanfare();
  confetti(220);
  const tm = setInterval(() => confetti(60), 2500);
  await speech.say(T('Het is gelukt, {naam}! Dankzij jou komen alle pakjes op tijd.'), 'sint');
  await speech.say(T('Jij bent een echte Hulppiet! Dankjewel!'), 'sint');

  // diashow van de foto's van deze ronde
  const fotos = (r.fotos || []).map((f) => store.photo(f.id)).filter(Boolean);
  if (fotos.length) {
    await speech.say(T('Kijk, dit zijn de foto\'s die jij voor mij gemaakt hebt!'), 'sint');
    for (const url of fotos.slice(0, 6)) {
      const pol = h('div', { style: { position: 'absolute', left: '380px', top: '120px', width: '440px', padding: '18px 18px 60px', background: '#fff', borderRadius: '6px', boxShadow: '0 14px 30px rgba(0,0,0,.4)', transform: `rotate(${Math.random() * 10 - 5}deg)`, zIndex: 30 } }, h('img', { src: url, style: { width: '100%', height: '380px', objectFit: 'cover', display: 'block' } }));
      s.append(pol);
      pol.classList.add('pop-in');
      sfx.click();
      await sleep(2200);
      pol.remove();
    }
  }
  clearInterval(tm);
  await certificateScreen();
}

// ---------------- oorkonde ----------------
export async function certificateScreen(opts = {}) {
  const s = screen('start');
  const url = await makeCertificate(opts);
  const img = h('img', { class: 'cert-img', src: url, alt: 'Oorkonde' });
  s.append(img);
  img.classList.add('pop-in');
  sfx.party();
  const again = bigButton('🔄', async () => {
    round.newRound();
    await introScreen();
  }, 'groen');
  again.style.position = 'absolute';
  place(again, 1040, 690, 130, 130);
  const map = bigButton('🗺️', () => mapScreen());
  map.style.position = 'absolute';
  place(map, 30, 690, 130, 130);
  const save = h('button', { class: 'small-btn', style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '18px' }, text: '💾 Bewaren (voor papa of mama)' });
  save.addEventListener('click', () => saveImage(url));
  s.append(again, map, save);
  if (!opts.silent) {
    await speech.say(T('Dit is jouw oorkonde, {naam}. Officiële Hulppiet!'), 'sint');
    await speech.say(T('Wil je nog een avontuur? Tik op de groene knop!'), 'sint');
  }
}

async function saveImage(url) {
  try {
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], 'oorkonde-hulppiet.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Oorkonde Hulppiet' });
      return;
    }
  } catch (e) { /* val terug op downloaden */ }
  const a = h('a', { href: url, download: 'oorkonde-hulppiet.png' });
  document.body.append(a);
  a.click();
  a.remove();
}

// ---------------- plakboek ----------------
async function scrapbook() {
  speech.stop();
  const s = screen('werkkamer');
  const back = h('button', { class: 'corner-btn btn-huis', html: '<span class="emoji">🗺️</span>' });
  back.addEventListener('click', () => mapScreen());
  s.append(back);
  const book = svgEl(A.grootBoek(), 120);
  place(book, 540, 20);
  s.append(book);
  const g = store.get().geschiedenis;
  const wrap = h('div', { style: { position: 'absolute', left: '60px', right: '60px', top: '160px', bottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center', alignContent: 'flex-start', overflow: 'hidden' } });
  s.append(wrap);
  speech.say(T('Dit is jouw plakboek, {naam}! Tik op een oorkonde.'), 'sint');
  for (const entry of g.slice(-6)) {
    const url = await makeCertificate({ datum: entry.datum, small: true });
    const card = h('button', { style: { border: 'none', padding: '10px', background: '#fff', borderRadius: '14px', boxShadow: '0 8px 20px rgba(0,0,0,.3)', cursor: 'pointer' } }, h('img', { src: url, style: { width: '300px', display: 'block' } }));
    const fotos = (entry.fotos || []).map((id) => store.photo(id)).filter(Boolean).slice(0, 3);
    if (fotos.length) {
      const row = h('div', { style: { display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'center' } });
      fotos.forEach((f) => row.append(h('img', { src: f, style: { width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px' } })));
      card.append(row);
    }
    card.addEventListener('click', () => { sfx.tap(); certificateScreen({ datum: entry.datum, silent: true }); });
    wrap.append(card);
  }
}

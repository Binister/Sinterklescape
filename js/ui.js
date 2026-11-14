// Interactie-hulpjes: slepen, vasthouden, feestjes, hand-demo.

import { h, toStage, getScale, centerOf, sleep, TEST } from './util.js';
import { sfx } from './sfx.js';

export const stage = () => document.getElementById('stage');

/** Klein feestje van sterretjes op een plek (stage-coördinaten). */
export function sparkle(x, y, n = 8, chars = ['⭐', '✨', '🌟']) {
  const st = stage();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 70 + Math.random() * 50;
    const s = h('div', { class: 'sparkle', text: chars[i % chars.length] });
    s.style.left = x + 'px'; s.style.top = y + 'px';
    s.style.setProperty('--dx', Math.cos(a) * r + 'px');
    s.style.setProperty('--dy', Math.sin(a) * r + 'px');
    st.append(s);
    setTimeout(() => s.remove(), 900);
  }
}

export function sparkleOn(el, n) {
  const c = centerOf(el);
  sparkle(c.x, c.y, n);
}

export function confetti(count = 120) {
  const st = stage();
  const colors = ['#d7263d', '#f2b632', '#2f7de1', '#45b649', '#8e44ad', '#f47eb4', '#fff'];
  for (let i = 0; i < count; i++) {
    const c = h('div', { class: 'confetti' });
    c.style.background = colors[i % colors.length];
    c.style.left = Math.random() * 1200 + 'px';
    c.style.top = '-30px';
    st.append(c);
    const dx = (Math.random() - 0.5) * 300;
    const rot = Math.random() * 720;
    const dur = 2200 + Math.random() * 1800;
    c.animate([
      { transform: 'translate(0,0) rotate(0)' },
      { transform: `translate(${dx}px, ${900 + Math.random() * 100}px) rotate(${rot}deg)` },
    ], { duration: dur, delay: Math.random() * 600, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
    setTimeout(() => c.remove(), dur + 700);
  }
}

export function wiggle(el) {
  if (!el) return;
  el.classList.remove('wiggle');
  void el.offsetWidth;
  el.classList.add('wiggle');
  setTimeout(() => el.classList.remove('wiggle'), 550);
}

/**
 * Knop die je een tijd ingedrukt moet houden (voor ouders).
 * ringEl krijgt de CSS-variabele --p (0..100).
 */
export function holdButton(el, ms, onDone, ringEl = el) {
  let start = 0, raf = 0, active = false;
  const tick = () => {
    if (!active) return;
    const p = Math.min(100, ((performance.now() - start) / ms) * 100);
    ringEl.style.setProperty('--p', p);
    if (p >= 100) { active = false; ringEl.style.setProperty('--p', 0); onDone(); return; }
    raf = requestAnimationFrame(tick);
  };
  const down = (e) => { e.preventDefault(); active = true; start = performance.now(); tick(); };
  const up = () => { active = false; cancelAnimationFrame(raf); ringEl.style.setProperty('--p', 0); };
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointerleave', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('contextmenu', (e) => e.preventDefault());
}

/**
 * Maak een element versleepbaar binnen de stage.
 * opts.onDrop(el, clientX, clientY) → true als geaccepteerd (anders veert het terug).
 * Het element moet absoluut gepositioneerd zijn (left/top in stage-px).
 */
export function draggable(el, { onDrop, onStart } = {}) {
  el.classList.add('draggable');
  let sx, sy, ox, oy, pid = null;
  const home = () => ({ left: el.dataset.homeLeft, top: el.dataset.homeTop });
  el.dataset.homeLeft = el.style.left;
  el.dataset.homeTop = el.style.top;
  el.addEventListener('pointerdown', (e) => {
    if (el.dataset.locked) return;
    if (pid !== null) return;
    e.preventDefault();
    pid = e.pointerId;
    try { el.setPointerCapture(pid); } catch (er) { /* negeren */ }
    const p = toStage(e.clientX, e.clientY);
    sx = p.x; sy = p.y;
    ox = parseFloat(el.style.left) || 0;
    oy = parseFloat(el.style.top) || 0;
    el.classList.remove('returning');
    el.classList.add('dragging');
    sfx.pick();
    onStart && onStart(el);
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    const p = toStage(e.clientX, e.clientY);
    el.style.left = ox + (p.x - sx) + 'px';
    el.style.top = oy + (p.y - sy) + 'px';
  });
  const end = (e) => {
    if (e.pointerId !== pid) return;
    pid = null;
    el.classList.remove('dragging');
    const ok = onDrop ? onDrop(el, e.clientX, e.clientY) : false;
    if (!ok) sendHome(el);
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', (e) => { if (e.pointerId === pid) { pid = null; el.classList.remove('dragging'); sendHome(el); } });
  return { home };
}

export function setHome(el) {
  el.dataset.homeLeft = el.style.left;
  el.dataset.homeTop = el.style.top;
}

export function sendHome(el) {
  el.classList.add('returning');
  el.style.left = el.dataset.homeLeft;
  el.style.top = el.dataset.homeTop;
  setTimeout(() => el.classList.remove('returning'), 380);
}

/** Zit het (client)punt binnen het doel, met een ruime magneet-marge (stage-px)? */
export function hitTest(target, clientX, clientY, margin = 50) {
  const r = target.getBoundingClientRect();
  const m = margin * getScale();
  return clientX >= r.left - m && clientX <= r.right + m && clientY >= r.top - m && clientY <= r.bottom + m;
}

/** Verplaats element met animatie naar stage-positie (left/top). */
export async function moveTo(el, left, top, ms = 450) {
  el.style.transition = `left ${ms}ms ease, top ${ms}ms ease`;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  await sleep(ms + 20);
  el.style.transition = '';
}

/** Laat element "vliegen" naar het midden van target (en verdwijnen). */
export async function flyTo(el, target, ms = 600) {
  const a = el.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const s = getScale();
  const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / s;
  const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) / s;
  const anim = el.animate([
    { transform: 'translate(0,0) scale(1)' },
    { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: 0.2 },
  ], { duration: TEST ? 10 : ms, easing: 'cubic-bezier(.5,0,.7,1)', fill: 'forwards' });
  await anim.finished.catch(() => {});
}

/** Toon een wijzende hand die naar een element beweegt (voor de piet-demo). */
export async function pointHand(targetEl, fromXY) {
  const st = stage();
  const hand = h('div', { class: 'hand', text: '👆' });
  const start = fromXY || { x: 1080, y: 760 };
  hand.style.left = start.x + 'px';
  hand.style.top = start.y + 'px';
  st.append(hand);
  await sleep(50);
  const c = centerOf(targetEl);
  hand.style.left = c.x - 30 + 'px';
  hand.style.top = c.y - 10 + 'px';
  await sleep(950);
  return hand;
}

export async function handTap(targetEl) {
  const hand = await pointHand(targetEl);
  hand.animate([{ transform: 'scale(1)' }, { transform: 'scale(.85)' }, { transform: 'scale(1)' }], { duration: 300 });
  await sleep(320);
  hand.remove();
}

/** Demo: hand pakt el en sleept het naar target; daarna roept het onArrive aan. */
export async function handDrag(el, target, onArrive) {
  const hand = await pointHand(el);
  const c = centerOf(target);
  const r = el.getBoundingClientRect();
  const w = r.width / getScale(), hh = r.height / getScale();
  el.classList.add('dragging');
  hand.style.left = c.x - 30 + 'px';
  hand.style.top = c.y - 10 + 'px';
  await moveTo(el, c.x - w / 2, c.y - hh / 2, 900);
  el.classList.remove('dragging');
  hand.remove();
  onArrive && onArrive();
}

/** Grote ronde knop met een emoji. */
export function bigButton(emoji, onClick, cls = '') {
  const b = h('button', { class: 'big-btn ' + cls }, h('span', { class: 'emoji', text: emoji }));
  b.addEventListener('click', (e) => { sfx.tap(); onClick(e); });
  return b;
}

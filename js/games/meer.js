// Speltypes: puzzel, doolhof, aankleden/inpakken, versieren.

import { h, place, sleep } from '../util.js';
import { draggable, hitTest, handDrag, handTap, setHome, moveTo, sparkleOn } from '../ui.js';
import { sfx } from '../sfx.js';
import * as A from '../art.js';
import { scatter, box } from './common.js';
import { KLEUREN } from '../util.js';

// ---------------- T5 Puzzel ----------------
// cfg: { render: () => el (vult een vierkant), pieces: 4|6, instr }
export function puzzel(api, cfg) {
  const { root, rng } = api;
  const n = cfg.pieces || 4;
  const cols = n === 4 ? 2 : 3;
  const rows = n === 4 ? 2 : 2;
  const W = n === 4 ? 440 : 510, H = n === 4 ? 440 : 340;
  const pw = W / cols, ph = H / rows;
  const bx = 640, by = 150 + (560 - H) / 2;

  // bord met vage voorbeeldplaat
  const board = h('div', { style: { position: 'absolute', left: bx + 'px', top: by + 'px', width: W + 'px', height: H + 'px', background: '#fff', borderRadius: '18px', boxShadow: '0 8px 24px rgba(0,0,0,.25)', overflow: 'hidden' } });
  const ghost = h('div', { style: { position: 'absolute', inset: 0, opacity: 0.18, filter: 'grayscale(1)' } }, cfg.render());
  board.append(ghost);
  root.append(board);
  const slots = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const s = h('div', { style: { position: 'absolute', left: c * pw + 'px', top: r * ph + 'px', width: pw + 'px', height: ph + 'px', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.2)' } });
    board.append(s);
    slots.push({ el: s, r, c, filled: false });
  }

  const pos = scatter(rng, n, { x: 60, y: 160, w: 540, h: 560, size: Math.max(pw, ph), gap: 10 });
  const pieces = slots.map((s, i) => {
    const p = h('div', { style: { overflow: 'hidden', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,.3)', background: '#fff' } });
    place(p, pos[i].x, pos[i].y, pw, ph);
    const inner = h('div', { style: { position: 'absolute', left: -s.c * pw + 'px', top: -s.r * ph + 'px', width: W + 'px', height: H + 'px', pointerEvents: 'none' } }, cfg.render());
    p.append(inner);
    root.append(p);
    const piece = { el: p, slot: s, done: false };
    draggable(p, {
      onDrop: (node, cx, cy) => {
        if (hitTest(s.el, cx, cy, 10)) { snap(piece); return true; }
        const other = slots.find((o) => o !== s && hitTest(o.el, cx, cy, -10));
        if (other) api.bad(p);
        return false;
      },
    });
    return piece;
  });

  async function snap(piece) {
    piece.done = true;
    piece.el.dataset.locked = '1';
    await moveTo(piece.el, bx + piece.slot.c * pw, by + piece.slot.r * ph, 150);
    piece.el.style.boxShadow = 'none';
    piece.el.style.borderRadius = '0';
    piece.el.style.zIndex = 5;
    api.good(piece.el, { say: false });
    sfx.drop();
    if (pieces.every((x) => x.done)) {
      await sleep(300);
      board.style.boxShadow = '0 0 0 10px #45b649, 0 8px 24px rgba(0,0,0,.25)';
      api.done();
    }
  }

  api.hint(() => {
    const p = pieces.find((x) => !x.done);
    return p ? { el: p.el, demo: () => handDrag(p.el, p.slot.el, () => snap(p)) } : null;
  });
  api.instruct(cfg.instr);
}

// ---------------- T7 Doolhof ----------------
// cfg: { rows, cols, token: () => el, goal: () => el, blocker: () => el, instr, cellBg }
export function doolhof(api, cfg) {
  const { root, rng } = api;
  const R = cfg.rows || 3, C = cfg.cols || 5;
  const cs = Math.min(150, Math.floor(1000 / C), Math.floor(560 / R));
  const gx = 600 - (C * cs) / 2, gy = 170 + (560 - R * cs) / 2;
  const maze = genMaze(rng, R, C);
  const cells = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const open = maze.open.has(r + ',' + c);
    const el = h('div', { class: 'maze-cell ' + (open ? 'open' : 'block') });
    place(el, gx + c * cs + 4, gy + r * cs + 4, cs - 8, cs - 8);
    if (cfg.cellBg && open) el.style.background = cfg.cellBg;
    if (!open && cfg.blocker) {
      const b = cfg.blocker();
      b.style.width = b.style.height = '100%';
      el.append(b);
    }
    el.dataset.r = r; el.dataset.c = c;
    root.append(el);
    cells.push({ el, r, c, open });
    if (open) el.addEventListener('click', () => tryMove(r, c, el));
  }
  const [er, ec] = maze.end;
  const goal = box(cfg.goal(), gx + ec * cs + cs * 0.1, gy + er * cs + cs * 0.05, cs * 0.8, cs * 0.8);
  goal.style.pointerEvents = 'none';
  root.append(goal);
  let [pr, pc] = maze.start;
  const token = box(cfg.token(), gx + pc * cs + cs * 0.08, gy + pr * cs + cs * 0.02, cs * 0.84, cs * 0.84);
  token.style.zIndex = 8;
  token.style.pointerEvents = 'none';
  token.style.transition = 'left .35s ease, top .35s ease';
  root.append(token);
  let moving = false;

  async function tryMove(r, c, el) {
    if (moving) return;
    const adj = Math.abs(r - pr) + Math.abs(c - pc) === 1;
    if (!adj) {
      if (r === pr && c === pc) return;
      api.bad(el);
      return;
    }
    moving = true;
    pr = r; pc = c;
    token.style.left = gx + pc * cs + cs * 0.08 + 'px';
    token.style.top = gy + pr * cs + cs * 0.02 + 'px';
    sfx.step();
    api.touch();
    await sleep(360);
    moving = false;
    if (pr === er && pc === ec) {
      sparkleOn(goal, 12);
      api.done();
    }
  }

  api.hint(() => {
    // volgende stap op het kortste pad
    const path = bfs(maze.open, [pr, pc], maze.end);
    if (!path || path.length < 2) return null;
    const [nr, nc] = path[1];
    const cell = cells.find((x) => x.r === nr && x.c === nc);
    return { el: cell.el };
  });
  api.instruct(cfg.instr);
}

function genMaze(rng, R, C) {
  // Monotoon pad van links naar rechts: per kolom een stukje omhoog/omlaag, dan een stap naar rechts.
  const start = [rng.int(0, R - 1), 0];
  const end = [rng.int(0, R - 1), C - 1];
  const open = new Set();
  const add = (r, c) => open.add(r + ',' + c);
  let r = start[0];
  for (let c = 0; c < C; c++) {
    const target = c === C - 1 ? end[0] : rng.int(0, R - 1);
    add(r, c);
    while (r !== target) { r += Math.sign(target - r); add(r, c); }
  }
  // 1 à 2 doodlopende zijtakjes (vakjes met precies één open buur)
  const nb = (a, b) => [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]].filter(([x, y]) => open.has(x + ',' + y)).length;
  const cand = [];
  for (let a = 0; a < R; a++) for (let b = 1; b < C - 1; b++) if (!open.has(a + ',' + b) && nb(a, b) === 1) cand.push([a, b]);
  const want = C >= 5 ? 2 : 1;
  let added = 0;
  for (const [a, b] of rng.shuffle(cand)) {
    if (added >= want) break;
    if (nb(a, b) === 1) { add(a, b); added++; }
  }
  return { open, start, end };
}

function bfs(open, s, e) {
  const key = (p) => p[0] + ',' + p[1];
  const q = [[s]];
  const seen = new Set([key(s)]);
  while (q.length) {
    const path = q.shift();
    const [r, c] = path[path.length - 1];
    if (r === e[0] && c === e[1]) return path;
    for (const [dr, dc] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) {
      const n = [r + dr, c + dc];
      if (open.has(key(n)) && !seen.has(key(n))) { seen.add(key(n)); q.push([...path, n]); }
    }
  }
  return null;
}

// ---------------- T10 Aankleden / inpakken ----------------
// cfg: { base: () => el, baseW, baseH, parts: [{ key, render: () => el, x, y, w, h }], instr }
// part x/y/w/h zijn relatief t.o.v. de linkerbovenhoek van de basis.
export function aankleden(api, cfg) {
  const { root, rng } = api;
  const bw = cfg.baseW || 360, bh = cfg.baseH || 470;
  const bx = 600 - bw / 2, by = 150 + (600 - bh) / 2;
  const base = box(cfg.base(), bx, by, bw, bh);
  base.style.pointerEvents = 'none';
  root.append(base);
  const sidePos = rng.shuffle([
    { x: 90, y: 180 }, { x: 90, y: 420 }, { x: 960, y: 180 }, { x: 960, y: 420 }, { x: 250, y: 600 }, { x: 830, y: 600 },
  ]);
  const parts = cfg.parts.map((p, i) => {
    const g = box(p.render(), bx + p.x, by + p.y, p.w, p.h, 'slot-ghost');
    root.append(g);
    const sz = Math.max(p.w, p.h);
    const sc = Math.min(1, 150 / sz);
    const el = box(p.render(), sidePos[i].x, sidePos[i].y, p.w * sc, p.h * sc);
    root.append(el);
    const part = { ...p, ghost: g, el, done: false, sc };
    draggable(el, {
      onDrop: (node, cx, cy) => {
        if (hitTest(g, cx, cy, 40)) { fit(part); return true; }
        const other = parts.find((o) => o !== part && !o.done && hitTest(o.ghost, cx, cy, 0));
        if (other) api.bad(el);
        return false;
      },
    });
    return part;
  });

  async function fit(part) {
    part.done = true;
    part.el.dataset.locked = '1';
    part.el.style.transition = 'left .2s, top .2s, width .2s, height .2s';
    place(part.el, bx + part.x, by + part.y, part.w, part.h);
    part.ghost.remove();
    api.good(part.el, { say: false });
    sfx.drop();
    await sleep(250);
    part.el.style.pointerEvents = 'none';
    if (parts.every((x) => x.done)) { await sleep(300); api.done(); }
  }

  api.hint(() => {
    const p = parts.find((x) => !x.done);
    return p ? { el: p.el, demo: () => handDrag(p.el, p.ghost, () => fit(p)) } : null;
  });
  api.instruct(cfg.instr);
}

// ---------------- T11 Versieren ----------------
// cfg: { plaat: key in A.kleurplaten, instr, colors?: [hex] }
export function versieren(api, cfg) {
  const { root } = api;
  const colors = cfg.colors || [KLEUREN.rood, KLEUREN.geel, KLEUREN.blauw, KLEUREN.groen, KLEUREN.paars, KLEUREN.roze];
  let sel = colors[0];
  const pal = h('div', { class: 'palette' });
  const btns = colors.map((c, i) => {
    const b = h('button', { style: { background: c }, class: i === 0 ? 'sel' : '' });
    b.addEventListener('click', () => { sel = c; btns.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); sfx.tap(); api.touch(); });
    pal.append(b);
    return b;
  });
  root.append(pal);
  const wrap = h('div', { style: { position: 'absolute', left: '330px', top: '120px', width: '540px', height: '612px' }, html: A.kleurplaten[cfg.plaat]() });
  root.append(wrap);
  const regions = [...wrap.querySelectorAll('[data-r]')];
  const colored = new Set();
  const ok = h('button', { class: 'big-btn groen', style: { position: 'absolute', right: '170px', bottom: '60px', display: 'none' }, html: '<span class="emoji">👍</span>' });
  root.append(ok);
  regions.forEach((r) => {
    r.style.cursor = 'pointer';
    r.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      r.setAttribute('fill', sel);
      colored.add(r.dataset.r);
      sfx.pick();
      api.touch();
      if (colored.size >= Math.min(3, regions.length) && ok.style.display === 'none') {
        ok.style.display = 'inline-flex';
        ok.classList.add('pop-in');
        api.say(api.T('Mooi! Ben je klaar? Tik dan op de duim.'));
      }
    });
  });
  ok.addEventListener('click', () => { sfx.tap(); sparkleOn(wrap, 14); api.done(); });

  api.hint(() => {
    if (ok.style.display !== 'none') return { el: ok };
    const r = regions.find((x) => !colored.has(x.dataset.r));
    if (!r) return null;
    return { el: btns[0], demo: async () => { await handTap(r); r.dispatchEvent(new PointerEvent('pointerdown')); } };
  });
  api.instruct(cfg.instr);
}

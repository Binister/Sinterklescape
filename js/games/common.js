import { h, place } from '../util.js';

/** Verdeel n posities zonder overlap binnen een rechthoek (stage-px). */
export function scatter(rng, n, { x = 120, y = 150, w = 960, h: hh = 560, size = 90, gap = 16 } = {}) {
  const cell = size + gap;
  const cols = Math.max(1, Math.floor(w / cell));
  const rows = Math.max(1, Math.floor(hh / cell));
  const cells = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([c, r]);
  const chosen = rng.shuffle(cells).slice(0, n);
  const offX = x + (w - cols * cell) / 2;
  const offY = y + (hh - rows * cell) / 2;
  return chosen.map(([c, r]) => ({
    x: offX + c * cell + rng.int(0, gap),
    y: offY + r * cell + rng.int(0, gap),
  }));
}

/** Wrapper om een element absoluut te plaatsen. */
export function box(child, x, y, w, hh, cls = '') {
  const b = h('div', { class: cls });
  place(b, x, y, w, hh);
  if (child) b.append(child);
  return b;
}

/** Rij van posities, gecentreerd. */
export function row(n, { cx = 600, y = 400, size = 160, gap = 40 } = {}) {
  const total = n * size + (n - 1) * gap;
  const x0 = cx - total / 2;
  return Array.from({ length: n }, (_, i) => ({ x: x0 + i * (size + gap), y }));
}

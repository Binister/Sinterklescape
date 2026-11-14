// Speltypes op het scherm: zoekplaat, sorteren, tellen, memory, kiezen.

import { h, place, sleep } from '../util.js';
import { draggable, hitTest, flyTo, handDrag, setHome, sendHome, moveTo, sparkleOn } from '../ui.js';
import { ding } from '../data.js';
import { sfx } from '../sfx.js';
import { scatter, box, row } from './common.js';

// ---------------- T1 Zoekplaat ----------------
// cfg: { target: dingId | render(), count, decoys: [dingId], instr, size }
export function zoek(api, cfg) {
  const { rng, root } = api;
  const size = cfg.size || 96;
  const list = cfg.targets || Array(cfg.count || 5).fill(cfg.target);
  const n = list.length;
  const decoys = cfg.decoys || [];
  const nDecoy = cfg.nDecoy ?? 14;
  const pos = scatter(rng, n + nDecoy, { x: 110, y: 190, w: 980, h: 560, size, gap: 22 });
  const render = (i, sz = size) => (typeof list[i] === 'function' ? list[i](sz) : ding(list[i], sz));

  // teller bovenin
  const counter = h('div', { style: { position: 'absolute', left: '50%', top: '72px', transform: 'translateX(-50%)', display: 'flex', gap: '10px', padding: '10px 16px', background: 'rgba(255,255,255,.8)', borderRadius: '24px', zIndex: 12 } });
  const slots = [];
  for (let i = 0; i < n; i++) {
    const s = h('div', { style: { width: '64px', height: '64px', borderRadius: '16px', background: '#eadcc4', display: 'flex', alignItems: 'center', justifyContent: 'center' } });
    const ghost = render(i, 56);
    ghost.style.filter = 'grayscale(1) opacity(.3)';
    ghost.style.width = ghost.style.height = '56px';
    s.append(ghost);
    slots.push(s);
    counter.append(s);
  }
  root.append(counter);

  const targets = [];
  let found = 0;
  pos.forEach((p, i) => {
    const isTarget = i < n;
    const el = isTarget ? render(i) : ding(rng.pick(decoys), size);
    const wrap = box(el, p.x, p.y, size, size);
    wrap.style.transform = `rotate(${rng.int(-18, 18)}deg)`;
    wrap.style.cursor = 'pointer';
    if (isTarget) {
      targets.push(wrap);
      wrap.addEventListener('click', async () => {
        if (wrap.dataset.found) return;
        wrap.dataset.found = '1';
        const slot = slots[targets.indexOf(wrap)];
        found++;
        api.good(wrap, { say: false });
        await flyTo(wrap, slot, 550);
        wrap.remove();
        slot.firstChild.style.filter = 'none';
        sfx.count(found);
        if (found === n) api.done();
      });
    } else {
      wrap.addEventListener('click', () => api.bad(wrap));
    }
    root.append(wrap);
  });

  api.hint(() => {
    const t = targets.find((x) => !x.dataset.found);
    return t ? { el: t } : null;
  });
  api.instruct(cfg.instr);
}

// ---------------- T2 Sorteren ----------------
// cfg: { bins: [{ key, render(size) }], items: [{ key, render(size), say? }], instr, oneByOne }
export function sorteer(api, cfg) {
  const { root } = api;
  const nb = cfg.bins.length;
  const bw = nb <= 2 ? 300 : nb === 3 ? 270 : 230;
  const bh = 330;
  const positions = row(nb, { cx: 600, y: 140, size: bw, gap: 26 });
  const bins = cfg.bins.map((b, i) => {
    const el = h('div', { class: 'bin', 'data-key': b.key });
    place(el, positions[i].x, positions[i].y, bw, bh);
    const label = h('div', { class: 'bin-label' }, b.render(nb <= 3 ? 150 : 130));
    const content = h('div', { class: 'bin-content' });
    el.append(label, content);
    root.append(el);
    return { ...b, el, content };
  });

  const items = cfg.items.map((it) => ({ ...it }));
  const binKeys = new Set(cfg.bins.map((b) => b.key));
  const spread = cfg.oneByOne === false ? scatter(api.rng, items.length, { x: 80, y: 490, w: 1000, h: 270, size: 120, gap: 18 }) : null;
  const isize = 120;
  let current = 0;

  const makeItem = (it, idx) => {
    const el = box(it.render(isize), 0, 0, isize, isize);
    const p = cfg.oneByOne !== false ? { x: 600 - isize / 2, y: 600 } : spread[idx];
    place(el, p.x, p.y);
    it.el = el;
    el.dataset.key = it.key;
    root.append(el);
    draggable(el, {
      onDrop: (node, cx, cy) => {
        const bin = bins.find((b) => hitTest(b.el, cx, cy, 30));
        if (!bin) return false;
        if (bin.key !== it.key) { api.bad(bin.el); if (it.wrongSay) api.say(it.wrongSay); else if (it.key === 'nee') sfx.quack(); return false; }
        accept(it, bin);
        return true;
      },
    });
    setHome(el);
    return el;
  };

  const accept = async (it, bin) => {
    it.done = true;
    it.el.dataset.locked = '1';
    api.good(bin.el);
    sfx.drop();
    const small = it.render(70);
    it.el.remove();
    bin.content.append(small);
    small.classList.add('pop-in');
    if (items.every((x) => x.done || !binKeys.has(x.key))) { bins.forEach((b) => b.el.classList.add('ok')); await sleep(400); api.done(); return; }
    if (cfg.oneByOne !== false) next();
  };

  const next = async () => {
    const it = items.find((x) => !x.done && !x.el && binKeys.has(x.key));
    if (!it) return;
    const el = makeItem(it, 0);
    el.classList.add('pop-in');
    if (it.say) await api.say(it.say);
  };

  if (cfg.oneByOne !== false) {
    api.instruct(cfg.instr).then(() => next());
  } else {
    items.forEach((it, i) => makeItem(it, i));
    api.instruct(cfg.instr);
  }

  api.hint(() => {
    const it = items.find((x) => !x.done && x.el && binKeys.has(x.key));
    if (!it) return null;
    const bin = bins.find((b) => b.key === it.key);
    return { el: it.el, demo: () => handDrag(it.el, bin.el, () => accept(it, bin)) };
  });
}

// ---------------- T3 Tellen ----------------
// cfg: { thing: dingId, counts: [n...], binRender(size)?, instr }
export function tel(api, cfg) {
  const { root, rng } = api;
  const counts = cfg.counts;
  const nb = counts.length;
  const bw = 250, bh = 300;
  const positions = row(nb, { cx: 600, y: 130, size: bw, gap: 40 });
  const bins = counts.map((c, i) => {
    const el = h('div', { class: 'bin' });
    place(el, positions[i].x, positions[i].y, bw, bh);
    const dots = h('div', { class: 'dots-label' });
    for (let k = 0; k < c; k++) dots.append(h('i'));
    const label = h('div', { class: 'bin-label', style: { flexDirection: 'column', gap: '6px' } });
    if (cfg.binRender) label.append(cfg.binRender(70));
    label.append(dots);
    const content = h('div', { class: 'bin-content' });
    el.append(label, content);
    root.append(el);
    return { el, content, need: c, have: 0 };
  });
  const total = counts.reduce((a, b) => a + b, 0);
  const pool = total + (cfg.extra ?? 2);
  const isize = 84;
  const pos = scatter(rng, pool, { x: 140, y: 480, w: 920, h: 250, size: isize, gap: 14 });
  const items = pos.map((p) => {
    const el = box(ding(cfg.thing, isize), p.x, p.y, isize, isize);
    root.append(el);
    const it = { el, done: false };
    draggable(el, {
      onDrop: (node, cx, cy) => {
        const bin = bins.find((b) => hitTest(b.el, cx, cy, 24));
        if (!bin) return false;
        if (bin.have >= bin.need) {
          api.bad(bin.el);
          api.say(api.T('Dit zakje is al vol!'));
          return false;
        }
        put(it, bin);
        return true;
      },
    });
    return it;
  });

  const put = async (it, bin) => {
    it.done = true;
    bin.have++;
    it.el.remove();
    const small = ding(cfg.thing, 52);
    bin.content.append(small);
    small.classList.add('pop-in');
    sfx.count(bin.have);
    api.touch();
    if (bin.have === bin.need) {
      bin.el.classList.add('ok');
      api.good(bin.el);
    }
    if (bins.every((b) => b.have === b.need)) { await sleep(300); api.done(); }
  };

  api.hint(() => {
    const bin = bins.find((b) => b.have < b.need);
    const it = items.find((x) => !x.done);
    if (!bin || !it) return null;
    return { el: bin.el, demo: () => handDrag(it.el, bin.el, () => put(it, bin)) };
  });
  api.instruct(cfg.instr);
}

// ---------------- T4 Memory ----------------
// cfg: { faces: [{ key, render(size) }], instr }  (3 of 4 paren)
export function memory(api, cfg) {
  const { root, rng } = api;
  const faces = cfg.faces;
  const deck = rng.shuffle(faces.flatMap((f) => [f, f]));
  const n = deck.length;
  const cols = n <= 6 ? 3 : 4;
  const rows = Math.ceil(n / cols);
  const cw = 170, ch = 190, gap = 30;
  const x0 = 600 - (cols * cw + (cols - 1) * gap) / 2;
  const y0 = 150 + (560 - (rows * ch + (rows - 1) * gap)) / 2;
  let open = [];
  let lock = false;
  let pairs = 0;
  const cards = deck.map((f, i) => {
    const c = h('button', { class: 'card', 'data-key': f.key });
    place(c, x0 + (i % cols) * (cw + gap), y0 + Math.floor(i / cols) * (ch + gap), cw, ch);
    const back = h('div', { class: 'emoji', style: { fontSize: '80px' }, text: '🎁' });
    const front = h('div', { style: { display: 'none' } }, f.render(130));
    c.style.background = 'linear-gradient(135deg, #d7263d, #a3162a)';
    c.append(back, front);
    const card = { el: c, key: f.key, back, front, matched: false, isOpen: false };
    c.addEventListener('click', () => flip(card));
    root.append(c);
    return card;
  });

  const show = (card, on) => {
    card.isOpen = on;
    card.back.style.display = on ? 'none' : '';
    card.front.style.display = on ? '' : 'none';
    card.el.style.background = on ? '#fff' : 'linear-gradient(135deg, #d7263d, #a3162a)';
    card.el.animate([{ transform: 'scaleX(.1)' }, { transform: 'scaleX(1)' }], { duration: 200 });
  };

  async function flip(card) {
    if (lock || card.matched || card.isOpen) return;
    sfx.flip();
    api.touch();
    show(card, true);
    open.push(card);
    if (open.length < 2) return;
    lock = true;
    const [a, b] = open;
    if (a.key === b.key) {
      a.matched = b.matched = true;
      pairs++;
      await sleep(250);
      api.good(b.el);
      a.el.style.boxShadow = b.el.style.boxShadow = '0 0 0 6px #45b649';
      open = [];
      lock = false;
      if (pairs === faces.length) { await sleep(400); api.done(); }
    } else {
      await sleep(1100);
      show(a, false); show(b, false);
      open = [];
      lock = false;
    }
  }

  api.hint(() => {
    // als er één open is: wijs zijn partner aan; anders een paar
    const cand = open.length === 1 ? cards.find((c) => c !== open[0] && c.key === open[0].key) : cards.find((c) => !c.matched);
    if (!cand) return null;
    return {
      el: cand.el,
      demo: async () => {
        if (open.length === 1) { await flip(cand); return; }
        const partner = cards.find((c) => c !== cand && c.key === cand.key);
        await flip(cand);
        await sleep(300);
        await flip(partner);
      },
    };
  });
  api.instruct(cfg.instr);
}

// ---------------- Kiezen (T6 wat hoort er niet bij, T8 patroon, T9 rijm, T12 schaduw, huis kiezen) ----------------
// cfg: { rounds: [{ instr, prompt?: () => el, options: [{ key, render(size) }], correct, sayOptions?: [text], onCorrect?(promptEl, optEl) }] }
export function kies(api, cfg) {
  const { root } = api;
  const rounds = cfg.rounds;
  let r = 0;
  let cur = null;

  async function showRound() {
    root.replaceChildren();
    const rd = rounds[r];
    const n = rd.options.length;
    const size = rd.size || (n <= 3 ? 200 : 170);
    const hasPrompt = !!rd.prompt;
    const y = hasPrompt ? 470 : 300;
    let promptEl = null;
    if (hasPrompt) {
      promptEl = h('div', { style: { position: 'absolute', left: '0', right: '0', top: '120px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, rd.prompt());
      root.append(promptEl);
    }
    const ps = row(n, { cx: 600, y, size, gap: n <= 3 ? 70 : 40 });
    const opts = rd.options.map((o, i) => {
      const c = h('button', { class: 'card', 'data-key': o.key });
      place(c, ps[i].x, ps[i].y, size, size);
      c.append(o.render(Math.round(size * 0.78)));
      c.classList.add('pop-in');
      c.style.animationDelay = i * 80 + 'ms';
      c.addEventListener('click', () => choose(o, c));
      root.append(c);
      return { o, c };
    });
    cur = { rd, opts, promptEl, locked: false };
    await api.instruct(rd.instr);
    if (rd.sayOptions && cur && cur.rd === rd) {
      for (let i = 0; i < opts.length; i++) {
        if (!cur || cur.rd !== rd || cur.locked) break;
        opts[i].c.classList.add('hint-glow');
        await api.say(rd.sayOptions[i]);
        opts[i].c.classList.remove('hint-glow');
      }
    }
  }

  async function choose(o, c) {
    if (!cur || cur.locked) return;
    if (o.key !== cur.rd.correct) { api.bad(c); return; }
    cur.locked = true;
    api.good(c);
    c.style.boxShadow = '0 0 0 8px #45b649, 0 10px 20px rgba(0,0,0,.2)';
    if (cur.rd.onCorrect) await cur.rd.onCorrect(cur.promptEl, c);
    await sleep(700);
    r++;
    if (r >= rounds.length) api.done();
    else showRound();
  }

  api.hint(() => {
    if (!cur || cur.locked) return null;
    const x = cur.opts.find((p) => p.o.key === cur.rd.correct);
    return x ? { el: x.c } : null;
  });
  showRound();
}

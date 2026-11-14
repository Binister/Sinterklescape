// Rondes: opdrachten kiezen, voortgang bijhouden, herspeelbaarheid.

import * as store from './store.js';
import { PLEKKEN, PROBLEMEN } from './content.js';
import { makeRng, hashStr } from './util.js';
import { ECHT } from './games/index.js';

export const PER_PLEK = 7;

export function newRound() {
  const s = store.get();
  const vorige = s.ronde;
  if (vorige && vorige.klaar) {
    s.geschiedenis.push({ nummer: vorige.nummer, probleem: vorige.probleem, datum: vorige.klaarDatum || new Date().toISOString().slice(0, 10), fotos: (vorige.fotos || []).map((f) => f.id), taken: Object.values(vorige.plekken).flatMap((p) => p.taken) });
  }
  const nummer = (s.geschiedenis.length || 0) + 1;
  const seed = (Math.random() * 2 ** 31) >>> 0;
  const rng = makeRng(seed);
  const probleem = PROBLEMEN[(nummer - 1) % PROBLEMEN.length].id;
  const gespeeld = new Set(s.geschiedenis.length ? s.geschiedenis[s.geschiedenis.length - 1].taken : []);
  const plekken = {};
  for (const p of PLEKKEN) plekken[p.id] = { taken: chooseTasks(p, rng, gespeeld), klaar: 0, bonus: 0 };
  s.ronde = { nummer, probleem, seed, plekken, voorwerpen: [], fotos: [], introGezien: false, klaar: false };
  store.save();
  return s.ronde;
}

function chooseTasks(plek, rng, gespeeld) {
  const magie = store.get().instellingen.extraMagie;
  const pool = plek.taken.filter((t) => !t.magie || magie);
  const fixed = pool.filter((t) => t.fixed);
  let rest = rng.shuffle(pool.filter((t) => !t.fixed));
  // eerst opdrachten die vorige ronde níet gespeeld zijn
  rest = [...rest.filter((t) => !gespeeld.has(t.id)), ...rest.filter((t) => gespeeld.has(t.id))];
  const out = [...fixed];
  let echt = out.filter((t) => ECHT.has(t.type)).length;
  // extra magie: het kaartje altijd meenemen als het aan staat
  const kaart = rest.find((t) => t.magie);
  if (kaart) { out.push(kaart); echt++; rest = rest.filter((t) => t !== kaart); }
  for (const t of rest) {
    if (out.length >= PER_PLEK) break;
    if (ECHT.has(t.type)) { if (echt >= 2) continue; echt++; }
    out.push(t);
  }
  // volgorde: vaste opdracht eerst, de rest geschud, echte wereld niet als allereerste of twee op rij
  const [first, ...others] = out;
  const shuffled = rng.shuffle(others);
  for (let i = 1; i < shuffled.length; i++) {
    if (ECHT.has(shuffled[i].type) && ECHT.has(shuffled[i - 1].type)) {
      const j = shuffled.findIndex((x, k) => k > i && !ECHT.has(x.type));
      if (j > 0) [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  return [first, ...shuffled].map((t) => t.id);
}

export function current() {
  const s = store.get();
  if (!s.ronde) newRound();
  // nieuwe extra-magie-instelling of nieuwe opdrachten: zorg dat elke plek bestaat
  for (const p of PLEKKEN) if (!s.ronde.plekken[p.id]) s.ronde.plekken[p.id] = { taken: chooseTasks(p, makeRng(s.ronde.seed), new Set()), klaar: 0, bonus: 0 };
  return s.ronde;
}

export function taskDef(plek, taskId) {
  return plek.taken.find((t) => t.id === taskId);
}

/** Maak de config van een opdracht (deterministisch binnen een ronde). */
export function makeTask(plek, taskId, extraSalt = '') {
  const r = current();
  const def = taskDef(plek, taskId);
  const rng = makeRng(hashStr(r.seed + ':' + taskId + extraSalt));
  return { def, rng, cfg: def.make(rng) };
}

export function markDone(plekId) {
  const r = current();
  const p = r.plekken[plekId];
  p.klaar = Math.min(p.taken.length, p.klaar + 1);
  store.save();
  return p;
}

export function collect(plekId, item) {
  const r = current();
  if (!r.voorwerpen.includes(item)) r.voorwerpen.push(item);
  store.save();
}

export const allCollected = () => current().voorwerpen.length >= PLEKKEN.length;

export function finishRound() {
  const r = current();
  r.klaar = true;
  r.klaarDatum = new Date().toISOString().slice(0, 10);
  store.save();
}

/** Een bonusopdracht voor een plek die al klaar is (één die deze ronde niet gespeeld is). */
export function bonusTask(plek) {
  const r = current();
  const st = r.plekken[plek.id];
  const magie = store.get().instellingen.extraMagie;
  const pool = plek.taken.filter((t) => (!t.magie || magie) && !st.taken.includes(t.id));
  const all = pool.length ? pool : plek.taken.filter((t) => !t.magie);
  const rng = makeRng(hashStr(r.seed + ':bonus:' + plek.id + ':' + st.bonus));
  st.bonus++;
  store.save();
  return rng.pick(all).id;
}

/** Na het wijzigen van "extra magie": plekken die nog niet begonnen zijn opnieuw samenstellen. */
export function refreshUnstarted() {
  const r = current();
  const rng = makeRng(r.seed + 5);
  const s = store.get();
  const gespeeld = new Set(s.geschiedenis.length ? s.geschiedenis[s.geschiedenis.length - 1].taken : []);
  for (const p of PLEKKEN) {
    const ps = r.plekken[p.id];
    if (ps.klaar === 0) ps.taken = chooseTasks(p, rng, gespeeld);
  }
  store.save();
}

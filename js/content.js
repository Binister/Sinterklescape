// Inhoud: plekken, opdrachten (voorraad), verhalen per ronde.

import * as A from './art.js';
import { h } from './util.js';
import * as store from './store.js';
import { ding, portret, kind, familie, fav, kleurHex, teken, TEKENS, DINGEN, PAARD, KAART_SYMBOOL, KLEURNAAM, naamVan, T } from './data.js';

// ---------- render-hulpjes ----------
const svgEl = (markup, size) => h('div', { style: { width: size + 'px', height: size + 'px' }, html: markup });
const R = (id) => (size) => ding(id, size);
const P = (p) => (size) => portret(p, size);
const kindFace = () => store.photo(kind().fotoId);

function pakjeLabel(p, color, size) {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(svgEl(A.pakje(color), size));
  const badge = portret(p, size * 0.5);
  Object.assign(badge.style, { position: 'absolute', left: size * 0.25 + 'px', top: size * 0.38 + 'px' });
  w.append(badge);
  return w;
}

function huisMet(content, size, wall = '#f4e1c1', roof = '#b5452e') {
  const w = h('div', { style: { position: 'relative', width: size + 'px', height: size + 'px' } });
  w.append(svgEl(A.huis(wall, roof), size));
  const badge = typeof content === 'function' ? content(size * 0.36) : content;
  Object.assign(badge.style, { position: 'absolute', left: size * 0.32 + 'px', top: size * 0.47 + 'px' });
  w.append(badge);
  return w;
}

function silhouet(id) {
  return (size) => { const e = ding(id, size); e.style.filter = 'brightness(0) opacity(.85)'; return e; };
}

function rijTekening(ids, size = 110, missing = true) {
  const w = h('div', { style: { display: 'flex', gap: '14px', alignItems: 'center', background: 'rgba(255,255,255,.75)', padding: '18px 24px', borderRadius: '28px' } });
  ids.forEach((id) => w.append(ding(id, size)));
  if (missing) w.append(h('div', { class: 'qslot', style: { width: size + 'px', height: size + 'px', borderRadius: '20px', border: '6px dashed #c98a4b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.6 + 'px', color: '#c98a4b', fontWeight: 900 }, text: '?' }));
  return w;
}


/** Puzzelplaat: elk stukje krijgt iets herkenbaars (achtergrond + hoekversiering). */
function puzzelPlaat(markup, bg, deco = ['⭐', '🎁', '🌙', '🍬', '🎈', '❤️']) {
  return () => {
    const w = h('div', { style: { position: 'relative', width: '100%', height: '100%', background: bg, overflow: 'hidden' } });
    const spots = [['4%', '4%'], ['4%', null, '4%'], [null, '4%', null, '4%'], [null, null, '4%', '4%'], ['4%', '42%'], [null, '42%', null, '4%']];
    deco.forEach((e, i) => {
      const [top, left, right, bottom] = spots[i % spots.length];
      w.append(h('div', { class: 'emoji', text: e, style: { position: 'absolute', top, left, right, bottom, fontSize: '64px' } }));
    });
    w.append(h('div', { style: { position: 'absolute', inset: '6% 20%' }, html: markup }));
    return w;
  };
}

const opts = (ids) => ids.map((id) => ({ key: id, render: R(id) }));

// ---------- generieke opdracht-makers ----------

function wietIsAnders(rng, sets, nRounds = 2) {
  return {
    rounds: rng.sample(sets, nRounds).map(([groep, vreemd, tekst]) => {
      const items = rng.shuffle([...rng.sample(groep, 3), vreemd]);
      return { instr: T(tekst || 'Welke hoort er niet bij? Tik erop!'), options: opts(items), correct: vreemd };
    }),
  };
}

function schaduw(rng, pool, nRounds = 2) {
  const picks = rng.sample(pool, nRounds);
  return {
    rounds: picks.map((id) => {
      const others = rng.sample(pool.filter((x) => x !== id), 2);
      const all = rng.shuffle([id, ...others]);
      return {
        instr: T('Welke schaduw hoort bij {x}? Tik op de goede schaduw!', { x: naamVan(id) }),
        prompt: () => ding(id, 220),
        options: all.map((k) => ({ key: k, render: silhouet(k) })),
        correct: id,
      };
    }),
  };
}

function patroon(rng, pool, nRounds = 2) {
  return {
    rounds: Array.from({ length: nRounds }, (_, i) => {
      const len = i === 0 ? 2 : rng.pick([2, 3]);
      const units = rng.sample(pool, len);
      const seq = [];
      const total = len === 2 ? 5 : 5;
      for (let k = 0; k < total; k++) seq.push(units[k % len]);
      const answer = units[total % len];
      const wrong = rng.sample(pool.filter((x) => x !== answer), 2);
      return {
        instr: T('Kijk goed naar de rij. Wat komt er op het vraagteken?'),
        prompt: () => rijTekening(seq, 100),
        options: opts(rng.shuffle([answer, ...wrong])),
        correct: answer,
        size: 170,
        onCorrect: (promptEl) => {
          const q = promptEl.querySelector('.qslot');
          if (q) { q.replaceWith(ding(answer, 100)); }
        },
      };
    }),
  };
}

export const RIJMPJES = [
  { tekst: 'Sinterklaas rijdt op het dak, met een hele grote...', goed: 'zak', fout: ['bal', 'auto'] },
  { tekst: 'Kijk, daar zit een muis, bij Sint in het...', goed: 'huis', fout: ['banaan', 'trein'] },
  { tekst: 'Sinterklaas heeft een lange baard, en hij rijdt op een wit...', goed: 'paard', fout: ['auto', 'appel'] },
  { tekst: 'Ik zet mijn schoen bij de kachel neer, en op de muts van Piet zit een...', goed: 'veer', fout: ['vis', 'pizza'] },
  { tekst: 'Op het paard zit Sint, met zijn mijter en zijn lange...', goed: 'baard', fout: ['bal', 'boom'] },
  { tekst: 'Sint heeft een rode jas, en het paard eet groen...', goed: 'gras', fout: ['ijsje', 'auto'] },
  { tekst: 'Piet heeft een mooie hoed, en die staat hem heel...', goed: 'duim', fout: ['vis', 'appel'] },
  { tekst: 'In de lucht staat de maan, en Piet eet een...', goed: 'banaan', fout: ['bal', 'huis'] },
  { tekst: 'Sint kijkt naar boven, heel ver, en daar ziet hij een gouden...', goed: 'ster', fout: ['trein', 'boom'] },
];

function rijm(rng, n = 2) {
  return {
    rounds: rng.sample(RIJMPJES, n).map((r) => {
      const all = rng.shuffle([r.goed, ...r.fout]);
      return {
        instr: T(r.tekst),
        prompt: () => svgEl(A.sint(), 260),
        options: opts(all),
        correct: r.goed,
        sayOptions: all.map((k) => T('Is het... ' + naamVan(k).replace(/^(de|het) /, '') + '?')),
      };
    }),
  };
}

// ---------- de plekken ----------

const SET = {
  boot: ['anker', 'boei', 'kompas', 'verrekijker', 'touw', 'vlag', 'koffer', 'zeilboot'],
  cadeau: ['beer', 'bal', 'trein', 'auto', 'verf', 'vlieger', 'dobbelsteen', 'puzzel', 'robot', 'gitaar', 'step', 'jojo', 'blokken', 'ballon', 'raket'],
  keuken: ['ei', 'melk', 'boter', 'honing', 'koekje', 'spons', 'kruiden', 'kom'],
  stal: ['hooi', 'emmer', 'borstel', 'wortel', 'appel', 'laars', 'hout'],
  sint: ['ring', 'bril', 'mijter', 'staf', 'boek', 'mantel'],
  school: ['rugzak', 'potlood', 'schaar', 'liniaal', 'bel', 'ladder', 'muts', 'veer'],
  gek: ['sok', 'eend', 'tandenborstel', 'skateboard', 'zonnebril', 'paraplu', 'pinguin', 'zwembroek', 'hamer'],
  kleuren: ['rood', 'geelv', 'blauwv', 'groenv', 'paarsv', 'oranjev'],
};

export const PLEKKEN = [
  {
    id: 'stoomboot', naam: 'de stoomboot', item: 'kist', itemNaam: 'de kist met cadeaus', who: 'piet', map: { x: 90, y: 150 },
    intro: ['Ahoi, {naam}! Ik ben Piet van de stoomboot. De kist met cadeaus moet van de boot. Help je mee?', 'Hallo {naam}! Welkom op de stoomboot. Zonder de kist met cadeaus kan pakjesavond niet doorgaan!'],
    taken: [
      { id: 'boot-haven', type: 'doolhof', fixed: true, make: (rng) => ({ rows: 3, cols: 5, token: () => svgEl(A.stoomboot(), 130), goal: () => svgEl(A.plekArt.pakhuis(), 130), blocker: () => ding('rots', 110), cellBg: '#4aa3df', instr: T('Help de stoomboot naar de kade! Tik steeds op het water naast de boot.') }) },
      { id: 'boot-kisten', type: 'tel', make: (rng) => ({ thing: 'kist', counts: rng.pick([[2, 3], [1, 3], [2, 4], [3, 2]]), binRender: R('kar'), instr: T('Alle kisten moeten van de boot! Doe in elke kar zoveel kisten als er stippen zijn.') }) },
      { id: 'boot-puzzel', type: 'puzzel', make: () => ({ pieces: 4, render: () => h('div', { style: { width: '100%', height: '100%', background: 'linear-gradient(#bfe3ff 0 60%, #4aa3df 60%)' }, html: A.stoomboot() }), instr: T('Oei, de foto van de stoomboot is in stukjes! Maak jij de puzzel?') }) },
      { id: 'boot-bagage', type: 'sorteer', make: (rng) => {
        const items = rng.shuffle([['ring', 'sint'], ['boek', 'sint'], ['ladder', 'piet'], ['rugzak', 'piet'], ['wortel', 'paard'], ['hooi', 'paard']]);
        return {
          bins: [{ key: 'sint', render: (s) => svgEl(A.sint(), s) }, { key: 'piet', render: (s) => svgEl(A.piet({ color: A.pietColor(1) }), s) }, { key: 'paard', render: (s) => svgEl(A.paard(), s) }],
          items: items.slice(0, 5).map(([id, k]) => ({ key: k, render: R(id), say: T('Van wie is {x}?', { x: naamVan(id) }) })),
          instr: T('De koffers zijn opengewaaid! Van wie is alles? Sleep het naar Sint, Piet of het paard.'),
        };
      } },
      { id: 'boot-anders', type: 'kies', make: (rng) => wietIsAnders(rng, [[SET.boot, 'pizza'], [SET.boot, 'eend'], [SET.boot, 'skateboard'], [SET.boot, 'kameel']], 2) },
      { id: 'boot-schaduw', type: 'kies', make: (rng) => schaduw(rng, ['anker', 'zeilboot', 'vlag', 'koffer', 'boei', 'kompas']) },
      { id: 'boot-touwen', type: 'zoek', make: (rng) => ({ target: 'touw', count: 5, decoys: SET.boot.filter((x) => x !== 'touw').concat(['vis2', 'pinguin']), instr: T('De touwen van de boot zijn weg! Zoek vijf touwen.') }) },
      { id: 'boot-roep', type: 'zingen', echt: true, make: () => ({ show: () => svgEl(A.stoomboot(), 260), seconds: 3, instr: T('Roep heel hard: Sinterklaas! Dan hoort de kapitein je. Tik eerst op de microfoon.') }) },
      { id: 'boot-zwaai', type: 'bewegen', echt: true, make: () => ({ show: () => svgEl(A.stoomboot(), 280), n: 5, instr: T('Zwaai naar de stoomboot! Tik op de knop en zwaai vijf keer mee.') }) },
      { id: 'boot-vlaggen', type: 'kies', make: (rng) => patroon(rng, ['vlag', 'ster', 'anker', 'vis2', 'boei']) },
      { id: 'boot-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.stoomboot, show: R('brief'), instr: T('Oei! Een kaartje van de boot is naar jouw huis gewaaid. Zoek het kaartje met de vis, en tik dan op de camera!') }) },
    ],
  },
  {
    id: 'pakhuis', naam: 'het pakhuis', item: 'zak', itemNaam: 'de pakjeszak', who: 'piet', map: { x: 400, y: 120 },
    intro: ['Hoi {naam}! Ik ben Piet van het pakhuis. Alle pakjes liggen door elkaar. Help je mij sorteren?', 'Welkom in het pakhuis, {naam}! Hier maken we alle pakjes klaar. Maar wat een rommel!'],
    taken: [
      { id: 'pak-sorteren', type: 'sorteer', fixed: true, make: (rng) => {
        const mensen = rng.sample(familie(3, rng), 3);
        const kleuren = rng.shuffle(Object.values({ a: '#d7263d', b: '#2f7de1', c: '#45b649', d: '#8e44ad', e: '#f28c28' }));
        const items = rng.shuffle(mensen.flatMap((p, i) => [{ p, c: kleuren[i] }, { p, c: kleuren[(i + 3) % kleuren.length] }])).slice(0, 5);
        return {
          bins: mensen.map((p) => ({ key: p.id, render: P(p) })),
          items: items.map(({ p, c }) => ({ key: p.id, render: (s) => pakjeLabel(p, c, s), say: T('Dit pakje is voor {p}!', { p }) })),
          instr: T('Sint heeft voor iedereen een pakje. Sleep elk pakje naar wie het hoort. Kijk goed naar de foto!'),
        };
      } },
      { id: 'pak-lijstjes', type: 'zoek', make: () => ({ target: 'verlanglijst', count: 6, decoys: SET.cadeau, instr: T('De wind heeft alle verlanglijstjes weggeblazen! Zoek zes verlanglijstjes.') }) },
      { id: 'pak-inpakken', type: 'aankleden', make: () => {
        const c = kleurHex(fav().kleur);
        return {
          base: () => svgEl(A.pakje(c, '#f2b632', { noBow: true }), 360), baseW: 360, baseH: 360,
          parts: [
            { key: 'strik', render: () => svgEl(A.strik(), 160), x: 100, y: 10, w: 160, h: 96 },
            { key: 'teken', render: () => ding(teken(), 110), x: 125, y: 190, w: 110, h: 110 },
          ],
          instr: T('Dit pakje is voor jou, {naam}! Maak het af: sleep de strik erop, en jouw teken.'),
        };
      } },
      { id: 'pak-zak', type: 'tel', make: (rng) => ({ thing: 'cadeau', counts: rng.pick([[3], [4], [2, 3], [3, 4]]), binRender: (s) => svgEl(A.itemArt.zak(), s), instr: T('Doe de pakjes in de zakken. In elke zak zoveel pakjes als er stippen zijn.') }) },
      { id: 'pak-anders', type: 'kies', make: (rng) => wietIsAnders(rng, [[SET.cadeau, 'broccoli', 'Welke is geen cadeautje? Tik erop!'], [SET.cadeau, 'sok', 'Welke is geen cadeautje? Tik erop!'], [SET.cadeau, 'tandenborstel', 'Welke is geen cadeautje? Tik erop!']], 2) },
      { id: 'pak-schaduw', type: 'kies', make: (rng) => schaduw(rng, ['beer', 'trein', 'gitaar', 'vlieger', 'step', 'robot', 'raket']) },
      { id: 'pak-inhuis', type: 'zoekInHuis', echt: true, make: () => ({ show: R('cadeau'), instr: T('Zoek in huis iets wat in een pakje zou passen! Een knuffel, een blokje of een boekje. Laat het aan Piet zien!') }) },
      { id: 'pak-versieren', type: 'versieren', make: () => ({ plaat: 'pakpapier', instr: T('Versier het pakpapier! Kies een kleur, en tik op het pakje.') }) },
      { id: 'pak-memory', type: 'memory', make: (rng) => {
        const pool = SET.cadeau.slice();
        const f = fav().speelgoed;
        const pick = rng.sample(pool.filter((x) => x !== f), f ? 2 : 3);
        if (f) pick.push(f);
        return { faces: pick.map((id) => ({ key: id, render: R(id) })), instr: T('Zoek steeds twee dezelfde cadeautjes! Tik op twee pakjes.') };
      } },
      { id: 'pak-patroon', type: 'kies', make: (rng) => patroon(rng, ['beer', 'bal', 'trein', 'auto', 'ballon', 'raket']) },
      { id: 'pak-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.pakhuis, show: R('verlanglijst'), instr: T('Eén verlanglijstje is helemaal naar jouw huis gewaaid! Zoek het kaartje met de ster, en tik dan op de camera.') }) },
    ],
  },
  {
    id: 'bakkerij', naam: 'de pepernotenbakkerij', item: 'pepernoten', itemNaam: 'de pepernoten', who: 'piet', map: { x: 720, y: 140 },
    intro: ['Mmm, {naam}! Ik ben de bakkerspiet. Zonder pepernoten is het geen pakjesavond! Bak je mee?', 'Welkom in de bakkerij, {naam}! We moeten nog heel veel pepernoten bakken.'],
    taken: [
      { id: 'bak-deeg', type: 'sorteer', fixed: true, make: (rng) => {
        const goed = rng.sample(['meel', 'boter', 'melk', 'ei', 'honing', 'kruiden'], 4);
        const fout = rng.sample(SET.gek, 3);
        return {
          oneByOne: false,
          bins: [{ key: 'kom', render: R('kom') }],
          items: rng.shuffle([...goed.map((id) => ({ key: 'kom', render: R(id) })), ...fout.map((id) => ({ key: 'nee', render: R(id), wrongSay: T('Haha, {x}? Die hoort niet in het deeg!', { x: naamVan(id) }) }))]),
          instr: T('We maken pepernotendeeg! Sleep alleen de dingen voor het deeg in de kom. Geen gekke dingen!'),
        };
      } },
      { id: 'bak-zakjes', type: 'tel', make: (rng) => ({ thing: 'pepernoot', counts: rng.shuffle(rng.pick([[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 2, 4]])), binRender: R('tasje'), instr: T('Doe de pepernoten in de zakjes. In elk zakje zoveel pepernoten als er stippen zijn.') }) },
      { id: 'bak-pop', type: 'versieren', make: () => ({ plaat: 'speculaaspop', instr: T('Versier de speculaaspop! Kies een kleur en tik op de pop.') }) },
      { id: 'bak-patroon', type: 'kies', make: (rng) => patroon(rng, ['pepernoot', 'koekje', 'snoep', 'chocola', 'speculaas']) },
      { id: 'bak-letter', type: 'kies', make: (rng) => {
        const naam = (kind().naam || 'S').trim();
        const L = (naam[0] || 'S').toUpperCase();
        const andere = rng.sample('ABDEKLMNOPRSTVW'.split('').filter((x) => x !== L), 2);
        const all = rng.shuffle([L, ...andere]);
        return { rounds: [{
          instr: T('Sint heeft voor iedereen een chocoladeletter. Welke letter is van jou? Jouw naam begint met een {x}.', { x: L }),
          prompt: () => svgEl(A.sint(), 260),
          options: all.map((l) => ({ key: l, render: (s) => svgEl(A.chocoladeletter(l), s) })),
          correct: L,
        }] };
      } },
      { id: 'bak-zoek', type: 'zoek', make: () => ({ target: 'pepernoot', count: 6, decoys: SET.keuken, instr: T('Er zijn pepernoten van de bakplaat gerold! Zoek er zes.') }) },
      { id: 'bak-zing', type: 'zingen', echt: true, make: () => ({ show: () => svgEl(A.itemArt.pepernoten(), 240), seconds: 6, instr: T('De pepernoten zitten in de oven. Zing een sinterklaasliedje, dan worden ze extra lekker! Tik eerst op de microfoon.') }) },
      { id: 'bak-puzzel', type: 'puzzel', make: () => ({ pieces: 4, render: puzzelPlaat(A.piet({ face: kindFace(), color: '#f6f6f6', capColor: '#fff' }), 'repeating-linear-gradient(45deg, #fff3e0 0 30px, #fde4c4 30px 60px)', ['🍪', '🥛', '🧈', '🥚']), instr: T('Kijk, een foto van de bakkerspiet! Maak jij de puzzel?') }) },
      { id: 'bak-rijm', type: 'kies', make: (rng) => rijm(rng, 2) },
      { id: 'bak-anders', type: 'kies', make: (rng) => wietIsAnders(rng, [[['meel', 'boter', 'melk', 'ei', 'honing'], 'sok', 'Wat hoort er niet in het deeg? Tik erop!'], [['meel', 'boter', 'melk', 'ei', 'kruiden'], 'hamer', 'Wat hoort er niet in het deeg? Tik erop!'], [['koekje', 'chocola', 'snoep', 'pepernoot'], 'spons', 'Welke kun je niet eten? Tik erop!']], 2) },
      { id: 'bak-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.bakkerij, show: R('brief'), instr: T('Het recept van de pepernoten is weggewaaid, naar jouw huis! Zoek het kaartje met het hartje, en tik dan op de camera.') }) },
    ],
  },
  {
    id: 'stal', naam: 'de stal', item: 'zadel', itemNaam: 'het zadel', who: 'piet', map: { x: 90, y: 470 },
    intro: ['Hallo {naam}! Dit is de stal van ' + PAARD + ', het paard van Sint. Hij moet sterk zijn voor de daken!', 'Hoi {naam}! ' + PAARD + ' heeft je hulp nodig. Ga je mee de stal in?'],
    taken: [
      { id: 'stal-wortels', type: 'tel', fixed: true, make: (rng) => ({ thing: 'wortel', counts: rng.pick([[3], [2, 3], [1, 4], [3, 3]]), binRender: R('emmer'), instr: T(PAARD + ' heeft honger! Doe in elke emmer zoveel wortels als er stippen zijn.') }) },
      { id: 'stal-hoefijzers', type: 'zoek', make: () => ({ target: 'hoefijzer', count: 4, decoys: SET.stal, instr: T(PAARD + ' is zijn hoefijzers kwijt! Ze liggen ergens in het stro. Zoek er vier.') }) },
      { id: 'stal-zadel', type: 'aankleden', make: () => ({
        base: () => svgEl(A.paard(), 480), baseW: 480, baseH: 368,
        parts: [
          { key: 'zadel', render: () => svgEl(A.itemArt.zadel(), 150), x: 168, y: 60, w: 150, h: 150 },
          { key: 'strik', render: () => svgEl(A.strik('#d7263d'), 110), x: 330, y: 30, w: 110, h: 66 },
          { key: 'bel', render: () => ding('bel', 70), x: 345, y: 140, w: 70, h: 70 },
        ],
        instr: T('Maak ' + PAARD + ' mooi voor pakjesavond! Sleep het zadel, de strik en de bel op de goede plek.'),
      }) },
      { id: 'stal-schoen', type: 'foto', echt: true, make: () => ({ show: R('schoen'), label: 'schoen', instr: T('Zet je schoen klaar, met een wortel voor ' + PAARD + '! Maak er dan een foto van. Tik op de camera.') }) },
      { id: 'stal-memory', type: 'memory', make: (rng) => {
        const mensen = rng.sample([kind(), ...familie(3, rng)], 3);
        return { faces: mensen.map((p) => ({ key: p.id, render: P(p) })), instr: T('Zoek steeds twee dezelfde foto\'s! Tik op twee kaartjes.') };
      } },
      { id: 'stal-schaduw', type: 'kies', make: (rng) => ({ rounds: [{
        instr: T('Welke schaduw is van ' + PAARD + '? Tik erop!'),
        prompt: () => svgEl(A.paard(), 300),
        options: rng.shuffle([{ key: 'p', render: (s) => { const e = svgEl(A.paard(), s); e.style.filter = 'brightness(0) opacity(.85)'; return e; } }, { key: 'h', render: silhouet('hond') }, { key: 'k', render: silhouet('olifant') }]),
        correct: 'p',
      }, ...schaduw(rng, ['wortel', 'appel', 'emmer', 'laars', 'borstel'], 1).rounds] }) },
      { id: 'stal-galop', type: 'bewegen', echt: true, make: () => ({ show: () => svgEl(A.paard(), 300), n: 5, instr: T('Galoppeer als ' + PAARD + ' door de kamer! Tik op de knop, en spring vijf keer mee.') }) },
      { id: 'stal-deken', type: 'versieren', make: () => ({ plaat: 'deken', instr: T('Versier de deken van ' + PAARD + '! Kies een kleur en tik op de deken.') }) },
      { id: 'stal-eten', type: 'kies', make: (rng) => wietIsAnders(rng, [[['wortel', 'appel', 'hooi'], 'pizza', 'Wat eet een paard niet? Tik erop!'], [['wortel', 'appel', 'hooi'], 'ijsje', 'Wat eet een paard niet? Tik erop!'], [['wortel', 'appel', 'hooi'], 'peper', 'Wat eet een paard niet? Tik erop!']], 2) },
      { id: 'stal-doolhof', type: 'doolhof', make: () => ({ rows: 3, cols: 5, token: () => svgEl(A.piet({ face: kindFace(), color: A.pietColor(2) }), 120), goal: () => svgEl(A.paard(), 140), blocker: () => ding('hooi', 100), cellBg: '#e8c06a', instr: T('Loop naar ' + PAARD + '! Tik steeds op het vakje naast jou.') }) },
      { id: 'stal-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.stal, show: () => svgEl(A.hoefijzer(), 200), instr: T(PAARD + ' heeft een gouden hoefijzer verloren, bij jou in huis! Zoek het kaartje met de maan, en tik dan op de camera.') }) },
    ],
  },
  {
    id: 'werkkamer', naam: 'de werkkamer van Sint', item: 'boek', itemNaam: 'het Grote Boek', who: 'sint', map: { x: 470, y: 440 },
    intro: ['Dag {naam}, kom binnen in mijn werkkamer. Mijn Grote Boek is helemaal in de war. Help je mij?', 'Welkom, {naam}! Hier schrijf ik alles op in mijn Grote Boek. Maar ik kan het niet alleen.'],
    taken: [
      { id: 'werk-boek', type: 'kies', fixed: true, make: (rng) => grootBoekRondes(rng) },
      { id: 'werk-rijm', type: 'kies', make: (rng) => rijm(rng, 2) },
      { id: 'werk-memory', type: 'memory', make: (rng) => {
        const mensen = rng.sample([kind(), ...familie(3, rng)], Math.min(4, 1 + familie(3, rng).length));
        return { faces: mensen.map((p) => ({ key: p.id, render: P(p) })), instr: T('Sint wil de foto\'s in zijn boek plakken. Zoek steeds twee dezelfde!') };
      } },
      { id: 'werk-aankleden', type: 'aankleden', make: () => ({
        base: () => svgEl(A.sint({ mijter: false, staf: false }), 360), baseW: 360, baseH: 468,
        parts: [
          { key: 'mijter', render: () => svgEl(A.mijter(), 150), x: 105, y: -10, w: 150, h: 150 },
          { key: 'staf', render: () => svgEl(A.staf(), 170), x: -10, y: 60, w: 170, h: 170 },
          { key: 'boek', render: () => svgEl(A.grootBoek(), 110), x: 230, y: 280, w: 110, h: 110 },
        ],
        instr: T('Help Sint aankleden! Sleep de mijter, de staf en het Grote Boek naar de goede plek.'),
      }) },
      { id: 'werk-puzzel', type: 'puzzel', make: () => ({ pieces: 6, render: puzzelPlaat(A.piet({ face: kindFace(), color: A.pietColor(3) }), 'radial-gradient(circle at 50% 40%, #ffe9a8, #f2b632)', ['⭐', '🎁', '🌙', '📖', '🎈', '❤️']), instr: T('Kijk, wie is dat? Dat ben jij, als Piet! Maak de puzzel voor het Grote Boek.') }) },
      { id: 'werk-zoek', type: 'zoek', make: () => ({ targets: ['bril', 'ring', 'boek'], decoys: ['potlood', 'kaars', 'brief', 'schaar', 'bel', 'koekje', 'veer', 'kroon'], nDecoy: 18, size: 88, instr: T('Sint is zijn bril, zijn ring en zijn Grote Boek kwijt! Zoek jij ze?') }) },
      { id: 'werk-rood', type: 'zoekInHuis', echt: true, make: () => ({ show: () => svgEl(A.mantel(), 300), instr: T('Zoek in huis iets wat net zo rood is als de mantel van Sint! Laat het aan Sint zien.') }) },
      { id: 'werk-foto', type: 'foto', echt: true, make: () => ({ show: () => svgEl(A.grootBoek(), 220), label: 'lief', instr: T('Maak een foto van iets wat jij heel lief vindt, voor in mijn Grote Boek. Tik op de camera!') }) },
      { id: 'werk-anders', type: 'kies', make: (rng) => wietIsAnders(rng, [[['ring', 'bril', 'mijter', 'staf', 'boek'], 'skateboard', 'Wat is niet van Sint? Tik erop!'], [['ring', 'bril', 'mijter', 'staf', 'boek'], 'zwembroek', 'Wat is niet van Sint? Tik erop!'], [['ring', 'bril', 'mijter', 'staf', 'boek'], 'zonnebril', 'Wat is niet van Sint? Tik erop!']], 2) },
      { id: 'werk-mijter', type: 'versieren', make: () => ({ plaat: 'mijter', instr: T('Versier een mijter voor Sint! Kies een kleur en tik op de mijter.') }) },
      { id: 'werk-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.werkkamer, show: () => svgEl(A.grootBoek(), 200), instr: T('Een bladzijde uit mijn Grote Boek is naar jouw huis gewaaid! Zoek het kaartje met de kroon, en tik dan op de camera.') }) },
    ],
  },
  {
    id: 'pietenschool', naam: 'de pietenschool', item: 'routekaart', itemNaam: 'de routekaart', who: 'piet', map: { x: 800, y: 460 },
    intro: ['Welkom op de pietenschool, {naam}! Hier leren pieten klimmen en de weg vinden. Doe je mee?', 'Hoi {naam}! Wil jij ook een echte piet worden? Dan moet je naar de pietenschool!'],
    taken: [
      { id: 'school-daken', type: 'doolhof', fixed: true, make: () => ({ rows: 4, cols: 5, token: () => svgEl(A.piet({ face: kindFace(), color: A.pietColor(4) }), 110), goal: () => svgEl(A.schoorsteen(), 110), blocker: () => ding('antenne', 90), instr: T('Klimles! Loop over de daken naar de schoorsteen. Tik steeds op het dak naast jou.') }) },
      { id: 'school-huis', type: 'kies', make: (rng) => {
        const mijn = teken();
        const andere = rng.sample(Object.keys(TEKENS).filter((k) => k !== mijn), 3);
        const all = rng.shuffle([mijn, ...andere]);
        const muren = ['#f4e1c1', '#ffd6d6', '#d6ecff', '#e2f5d0'];
        return { rounds: [{ instr: T('Welk huis is van jou, {naam}? Kijk goed: jouw teken is {x}.', { x: TEKENS[mijn].n }), options: all.map((k, i) => ({ key: k, render: (s) => huisMet(ding(k, s * 0.36), s, muren[i]) })), correct: mijn }] };
      } },
      { id: 'school-patroon', type: 'kies', make: (rng) => patroon(rng, SET.kleuren) },
      { id: 'school-aankleden', type: 'aankleden', make: () => ({
        base: () => svgEl(A.piet({ face: kindFace(), cap: false, collar: false, color: A.pietColor(5) }), 360), baseW: 360, baseH: 468,
        parts: [
          { key: 'muts', render: () => svgEl(A.pietMuts(), 220), x: 70, y: 40, w: 220, h: 147 },
          { key: 'kraag', render: () => svgEl(A.kraag(), 160), x: 100, y: 240, w: 160, h: 80 },
          { key: 'rugzak', render: () => ding('rugzak', 100), x: 250, y: 300, w: 100, h: 100 },
        ],
        instr: T('Jij wordt een echte piet! Sleep de muts, de kraag en de rugzak naar de goede plek.'),
      }) },
      { id: 'school-spring', type: 'bewegen', echt: true, make: () => ({ show: () => svgEl(A.piet({ color: A.pietColor(0) }), 260), n: 5, instr: T('Klimles! Pieten moeten hoog kunnen springen. Tik op de knop, en spring vijf keer zo hoog als je kan!') }) },
      { id: 'school-lied', type: 'zingen', echt: true, make: () => ({ show: () => svgEl(A.piet({ color: A.pietColor(1) }), 240), seconds: 6, instr: T('Voor je pietendiploma moet je een liedje zingen! Tik op de microfoon en zing maar.') }) },
      { id: 'school-schaduw', type: 'kies', make: (rng) => schaduw(rng, ['ladder', 'schaar', 'bel', 'rugzak', 'potlood', 'veer']) },
      { id: 'school-mutsen', type: 'tel', make: (rng) => ({ thing: 'muts', counts: rng.pick([[2, 3], [1, 4], [3, 2], [2, 2]]), binRender: R('rugzak'), instr: T('Elke klas krijgt pietenmutsen. Doe in elk vak zoveel mutsen als er stippen zijn.') }) },
      { id: 'school-pieten', type: 'zoek', make: (rng) => ({ targets: Array.from({ length: 5 }, (_, i) => (s) => svgEl(A.piet({ color: A.pietColor(i) }), s)), decoys: SET.school.filter((x) => x !== 'muts'), size: 96, instr: T('Verstoppertje! Vijf pieten hebben zich verstopt. Zoek ze allemaal!') }) },
      { id: 'school-memory', type: 'memory', make: (rng) => ({ faces: rng.sample(SET.school, 4).map((id) => ({ key: id, render: R(id) })), instr: T('Zoek steeds twee dezelfde! Tik op twee pakjes.') }) },
      { id: 'school-kaartje', type: 'qr', echt: true, magie: true, make: () => ({ symbool: KAART_SYMBOOL.pietenschool, show: () => svgEl(A.itemArt.routekaart(), 200), instr: T('Een stukje van de routekaart is naar jouw huis gevlogen! Zoek het kaartje met de raket, en tik dan op de camera.') }) },
    ],
  },
];

function grootBoekRondes(rng) {
  const f = fav();
  const rondes = [];
  const add = (key, tekst, pool) => {
    const goed = f[key];
    if (!goed) return;
    const andere = rng.sample(pool.filter((x) => x !== goed), 2);
    rondes.push({ instr: T(tekst), prompt: () => svgEl(A.grootBoek(), 230), options: opts(rng.shuffle([goed, ...andere])), correct: goed });
  };
  add('dier', 'In mijn Grote Boek staat jouw lievelingsdier. Weet jij nog welk dier dat is? Tik erop!', ['dino', 'poes', 'hond', 'paardje', 'eenhoorn', 'konijn', 'vis2', 'vogel', 'olifant', 'beertje', 'leeuw', 'uil']);
  add('eten', 'Sint heeft opgeschreven wat jij het allerlekkerste vindt. Wat is dat? Tik erop!', ['pannenkoek', 'pizza', 'friet', 'appel', 'banaan', 'aardbei', 'ijsje', 'chocola', 'spaghetti', 'worst', 'kaas', 'koekje']);
  add('speelgoed', 'En waar speel jij het liefste mee? Tik erop!', ['bal', 'beer', 'trein', 'auto', 'blokken', 'jojo', 'verf', 'puzzel', 'fiets', 'robot', 'vlieger', 'gitaar']);
  if (f.kleur) {
    const andere = rng.sample(Object.keys(KLEURNAAM).filter((k) => k !== f.kleur), 2);
    rondes.push({
      instr: T('Wat is jouw lievelingskleur, {naam}? Tik erop!'),
      prompt: () => svgEl(A.grootBoek(), 230),
      options: rng.shuffle([f.kleur, ...andere]).map((k) => ({ key: k, render: (s) => h('div', { style: { width: s + 'px', height: s + 'px', borderRadius: '50%', background: kleurHex(k), border: '6px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,.2)' } }) })),
      correct: f.kleur,
    });
  }
  const fam = familie(0);
  if (fam.length) {
    const p = rng.pick(fam);
    const andere = rng.sample(familie(3, rng).filter((x) => x.id !== p.id), 2);
    rondes.push({ instr: T('In mijn boek staat ook {p}. Waar is {p}? Tik op de goede foto!', { p }), prompt: () => svgEl(A.grootBoek(), 230), options: rng.shuffle([p, ...andere]).map((x) => ({ key: x.id, render: P(x) })), correct: p.id });
  }
  if (rondes.length < 2) {
    rondes.push({ instr: T('Sint zoekt zijn mijter. Welke is de mijter? Tik erop!'), prompt: () => svgEl(A.grootBoek(), 230), options: opts(rng.shuffle(['mijter', 'beer', 'ballon'])), correct: 'mijter' });
    rondes.push({ instr: T('En waar is de staf van Sint? Tik erop!'), prompt: () => svgEl(A.grootBoek(), 230), options: opts(rng.shuffle(['staf', 'auto', 'appel'])), correct: 'staf' });
  }
  return { rounds: rng.sample(rondes, Math.min(3, rondes.length)) };
}

// ---------- verhalen per ronde ----------

export const PROBLEMEN = [
  {
    id: 'storm', naam: 'de grote storm',
    intro: ['Oh nee, {naam}! Er is een hele grote storm geweest.', 'Alles is weggewaaid: de pakjeszak, de pepernoten, het zadel van ' + PAARD + ' en zelfs mijn Grote Boek!', 'Ik heb zes dingen nodig voor pakjesavond. Wil jij ze voor mij zoeken? Tik op een plek op de kaart!'],
    plekLijn: 'De storm heeft hier alles door elkaar gegooid.',
  },
  {
    id: 'lek', naam: 'de lekke stoomboot',
    intro: ['Help, {naam}! De stoomboot heeft een lek gekregen.', 'Alles is nat geworden en de pieten hebben alles in de haast door elkaar gelegd!', 'Ik heb zes dingen nodig voor pakjesavond. Help jij mij ze te verzamelen? Tik op een plek op de kaart!'],
    plekLijn: 'Door het lek in de boot is alles hier in de war.',
  },
  {
    id: 'paard', naam: 'het weggelopen paard',
    intro: ['Oei, {naam}! ' + PAARD + ' is weggelopen. Hij schrok van een harde knal.', 'Op zijn rug zaten de spullen voor pakjesavond, en die zijn overal gevallen!', 'Ik heb zes dingen nodig. Zoek jij ze mee? Tik op een plek op de kaart!'],
    plekLijn: PAARD + ' is hier langs gerend, en alles is gevallen.',
  },
];

export const FINALE_INTRO = [
  'Hoera, {naam}! We hebben alles: de kist, de pakjeszak, de pepernoten, het zadel, het Grote Boek en de routekaart.',
  'Nu kunnen we op pakjesavond over de daken. Help jij ' + PAARD + ' de weg te vinden?',
];

export const plekById = (id) => PLEKKEN.find((p) => p.id === id);

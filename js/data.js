// Gegevens: dingen (met uitspraak), favorieten, tekens en tekst-sjablonen.

import * as A from './art.js';
import * as store from './store.js';
import { h, KLEUREN } from './util.js';

export const PAARD = 'Ozosnel';

/** Een "ding": emoji of SVG, met een Nederlandse naam voor de stem. */
export const DINGEN = {
  // cadeaus / speelgoed
  beer: { e: '🧸', n: 'de knuffelbeer' }, bal: { e: '⚽', n: 'de bal' }, trein: { e: '🚂', n: 'de trein' },
  boekje: { e: '📚', n: 'de boekjes' }, auto: { e: '🚗', n: 'de auto' }, verf: { e: '🎨', n: 'de verf' },
  vlieger: { e: '🪁', n: 'de vlieger' }, dobbelsteen: { e: '🎲', n: 'de dobbelsteen' }, puzzel: { e: '🧩', n: 'de puzzel' },
  robot: { e: '🤖', n: 'de robot' }, gitaar: { e: '🎸', n: 'de gitaar' }, step: { e: '🛴', n: 'de step' },
  fiets: { e: '🚲', n: 'de fiets' }, jojo: { e: '🪀', n: 'de jojo' }, blokken: { e: '🧱', n: 'de blokken' },
  ballon: { e: '🎈', n: 'de ballon' }, pop: { e: '🪆', n: 'de pop' }, raket: { e: '🚀', n: 'de raket' },
  // eten
  wortel: { e: '🥕', n: 'de wortel' }, appel: { e: '🍎', n: 'de appel' }, hooi: { e: '🌾', n: 'het hooi' },
  banaan: { e: '🍌', n: 'de banaan' }, pizza: { e: '🍕', n: 'de pizza' }, ijsje: { e: '🍦', n: 'het ijsje' },
  pannenkoek: { e: '🥞', n: 'de pannenkoek' }, friet: { e: '🍟', n: 'de friet' }, aardbei: { e: '🍓', n: 'de aardbei' },
  spaghetti: { e: '🍝', n: 'de spaghetti' }, worst: { e: '🌭', n: 'de worst' }, kaas: { e: '🧀', n: 'de kaas' },
  chocola: { e: '🍫', n: 'de chocola' }, broccoli: { e: '🥦', n: 'de broccoli' }, peper: { e: '🌶️', n: 'de peper' },
  koekje: { e: '🍪', n: 'het koekje' }, snoep: { e: '🍬', n: 'het snoepje' }, druiven: { e: '🍇', n: 'de druiven' },
  // bakken
  meel: { e: '🌾', n: 'het meel' }, boter: { e: '🧈', n: 'de boter' }, melk: { e: '🥛', n: 'de melk' },
  ei: { e: '🥚', n: 'het ei' }, honing: { e: '🍯', n: 'de honing' }, kruiden: { e: '🫚', n: 'de kruiden' },
  // gekke dingen
  sok: { e: '🧦', n: 'de sok' }, eend: { e: '🦆', n: 'de badeend' }, potlood: { e: '✏️', n: 'het potlood' },
  spons: { e: '🧽', n: 'de spons' }, hamer: { e: '🔨', n: 'de hamer' }, tandenborstel: { e: '🪥', n: 'de tandenborstel' },
  skateboard: { e: '🛹', n: 'het skateboard' }, zonnebril: { e: '🕶️', n: 'de zonnebril' }, paraplu: { e: '☂️', n: 'de paraplu' },
  pinguin: { e: '🐧', n: 'de pinguïn' }, kameel: { e: '🐪', n: 'de kameel' }, zwembroek: { e: '🩳', n: 'de zwembroek' },
  // sint & boot
  ring: { e: '💍', n: 'de ring' }, bril: { e: '👓', n: 'de bril' }, boek: { s: A.grootBoek, n: 'het Grote Boek' },
  mijter: { s: A.mijter, n: 'de mijter' }, staf: { s: A.staf, n: 'de staf' }, mantel: { s: A.mantel, n: 'de mantel' },
  anker: { e: '⚓', n: 'het anker' }, boei: { e: '🛟', n: 'de reddingsboei' }, zeilboot: { e: '⛵', n: 'de zeilboot' },
  koffer: { e: '🧳', n: 'de koffer' }, touw: { e: '🪢', n: 'het touw' }, vlag: { e: '🚩', n: 'de vlag' },
  kompas: { e: '🧭', n: 'het kompas' }, verrekijker: { e: '🔭', n: 'de verrekijker' },
  // stal & school
  hoefijzer: { s: A.hoefijzer, n: 'het hoefijzer' }, zadel: { s: A.itemArt.zadel, n: 'het zadel' },
  borstel: { e: '🪮', n: 'de borstel' }, emmer: { e: '🪣', n: 'de emmer' }, ladder: { e: '🪜', n: 'de ladder' },
  rugzak: { e: '🎒', n: 'de rugzak' }, muts: { s: () => A.pietMuts('#8e44ad'), n: 'de pietenmuts' }, veer: { e: '🪶', n: 'de veer' },
  schoen: { e: '👟', n: 'de schoen' }, laars: { e: '🥾', n: 'de laars' }, kaars: { e: '🕯️', n: 'de kaars' },
  bel: { e: '🔔', n: 'de bel' }, schaar: { e: '✂️', n: 'de schaar' }, liniaal: { e: '📏', n: 'de liniaal' },
  // sinterklaas-eten
  pepernoot: { s: A.pepernoot, n: 'de pepernoot' }, speculaas: { s: A.speculaaspop, n: 'de speculaaspop' },
  kist: { s: A.itemArt.kist, n: 'de kist' }, kom: { e: '🥣', n: 'de kom' }, kar: { e: '🛒', n: 'de kar' }, tasje: { e: '🛍️', n: 'het zakje' },
  rood: { e: '🟥', n: 'rood' }, geelv: { e: '🟨', n: 'geel' }, blauwv: { e: '🟦', n: 'blauw' }, groenv: { e: '🟩', n: 'groen' }, paarsv: { e: '🟪', n: 'paars' }, oranjev: { e: '🟧', n: 'oranje' },
  rots: { e: '🪨', n: 'de rots' }, antenne: { e: '📡', n: 'de antenne' }, hout: { e: '🪵', n: 'het hout' }, kroon: { e: '👑', n: 'de kroon' },
  verlanglijst: { e: '📜', n: 'het verlanglijstje' }, cadeau: { e: '🎁', n: 'het cadeautje' }, brief: { e: '✉️', n: 'de brief' },
  // rijmwoorden
  huis: { e: '🏠', n: 'huis' }, paard: { e: '🐴', n: 'paard' }, baard: { e: '🧔', n: 'baard' },
  duim: { e: '👍', n: 'goed' }, gras: { e: '🌱', n: 'gras' }, hoed: { e: '🎩', n: 'hoed' },
  maan: { e: '🌙', n: 'maan' }, vis: { e: '🐟', n: 'vis' }, muis: { e: '🐭', n: 'muis' },
  ster: { e: '⭐', n: 'ster' }, boom: { e: '🌳', n: 'boom' }, kat: { e: '🐱', n: 'kat' }, zak: { s: A.itemArt.zak, n: 'zak' },
  // dieren (favorieten)
  dino: { e: '🦖', n: 'de dino' }, poes: { e: '🐱', n: 'de poes' }, hond: { e: '🐶', n: 'de hond' },
  eenhoorn: { e: '🦄', n: 'de eenhoorn' }, konijn: { e: '🐰', n: 'het konijn' }, vogel: { e: '🐦', n: 'de vogel' },
  olifant: { e: '🐘', n: 'de olifant' }, beertje: { e: '🐻', n: 'de beer' }, leeuw: { e: '🦁', n: 'de leeuw' },
  uil: { e: '🦉', n: 'de uil' }, vis2: { e: '🐠', n: 'de vis' }, paardje: { e: '🐴', n: 'het paard' },
};

export const FAV = {
  kleur: Object.keys(KLEUREN),
  dier: ['dino', 'poes', 'hond', 'paardje', 'eenhoorn', 'konijn', 'vis2', 'vogel', 'olifant', 'beertje', 'leeuw', 'uil'],
  eten: ['pannenkoek', 'pizza', 'friet', 'appel', 'banaan', 'aardbei', 'ijsje', 'chocola', 'spaghetti', 'worst', 'kaas', 'koekje'],
  speelgoed: ['bal', 'beer', 'trein', 'auto', 'blokken', 'jojo', 'verf', 'puzzel', 'fiets', 'robot', 'vlieger', 'gitaar'],
};

export const KLEURNAAM = { rood: 'rood', oranje: 'oranje', geel: 'geel', groen: 'groen', blauw: 'blauw', paars: 'paars', roze: 'roze', turkoois: 'turquoise' };

export const TEKENS = {
  ster: { e: '⭐', n: 'de ster' }, maan: { e: '🌙', n: 'de maan' }, hart: { e: '❤️', n: 'het hartje' }, bloem: { e: '🌸', n: 'de bloem' },
  vis: { e: '🐟', n: 'de vis' }, raket: { e: '🚀', n: 'de raket' }, kroon: { e: '👑', n: 'de kroon' }, appel: { e: '🍎', n: 'de appel' },
};

/** Symbolen voor de QR-kaartjes (extra magie), vast per plek. */
export const KAART_SYMBOOL = {
  pakhuis: 'ster', bakkerij: 'hart', werkkamer: 'kroon', pietenschool: 'raket', stoomboot: 'vis', stal: 'maan',
};

/** Render een ding als element (emoji-span of SVG-div) met een vierkante maat. */
export function ding(id, size = 90) {
  const d = DINGEN[id] || TEKENS[id] || { e: '❓' };
  if (d.s) {
    return h('div', { class: 'ding', 'data-id': id, style: { width: size + 'px', height: size + 'px' }, html: d.s() });
  }
  return h('div', { class: 'ding emoji', 'data-id': id, style: { width: size + 'px', height: size + 'px', fontSize: Math.round(size * 0.82) + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, text: d.e });
}

export const naamVan = (id) => (DINGEN[id] || TEKENS[id] || { n: '' }).n;

// ---------------- personen ----------------

const NEP_FAMILIE = [
  { naam: 'Kim', e: '👧' }, { naam: 'Sem', e: '👦' }, { naam: 'Lotte', e: '👩' }, { naam: 'Daan', e: '🧒' },
  { naam: 'Opa Jan', e: '👴' }, { naam: 'Juf Anna', e: '👩‍🏫' },
];

/** Het kind als persoon-object. */
export function kind() {
  const k = store.get().kind;
  return { id: 'kind', naam: k.naam || 'lieve helper', uitspraak: k.uitspraak || '', fotoId: k.fotoId, e: '🧒', isKind: true };
}

/** Familie (echt, of verzonnen als er te weinig is). min = minimaal aantal. */
export function familie(min = 0, rng) {
  const fam = store.get().familie.map((p, i) => ({ id: 'fam' + i, naam: p.naam, uitspraak: p.uitspraak, fotoId: p.fotoId, rol: p.rol, e: rolEmoji(p.rol) }));
  if (fam.length >= min) return fam;
  const extra = (rng ? rng.shuffle(NEP_FAMILIE) : NEP_FAMILIE).slice(0, min - fam.length).map((p, i) => ({ id: 'nep' + i, naam: p.naam, e: p.e, nep: true }));
  return fam.concat(extra);
}

export const ROLLEN = {
  papa: '👨', mama: '👩', broer: '👦', zus: '👧', baby: '👶', opa: '👴', oma: '👵', hond: '🐶', kat: '🐱', konijn: '🐰', huisdier: '🐾', anders: '🙂',
};
export const rolEmoji = (r) => ROLLEN[r] || '🙂';

/** Portret van een persoon: foto in een cirkel of emoji op een kleurtje. */
export function portret(p, size = 120) {
  const url = p.fotoId ? store.photo(p.fotoId) : null;
  if (url) return h('img', { class: 'photo-circle', src: url, draggable: 'false', style: { width: size + 'px', height: size + 'px', border: Math.max(3, size / 22) + 'px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,.25)' } });
  return h('div', { class: 'photo-circle emoji', style: { width: size + 'px', height: size + 'px', fontSize: size * 0.62 + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffe9c7', border: Math.max(3, size / 22) + 'px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,.25)' }, text: p.e || '🙂' });
}

// ---------------- tekst ----------------

/**
 * Vul een sjabloon in. {naam} = kind; {p} = persoon in vars.p; {x} = vars.x.
 * Resultaat { d, s }: weergave en uitspraak (met uitspraak-correcties).
 */
export function T(tpl, vars = {}) {
  const k = kind();
  const all = { naam: k, ...vars };
  const out = { d: tpl, s: tpl };
  out.d = tpl.replace(/\{(\w+)\}/g, (_, key) => {
    const v = all[key];
    if (v == null) return '';
    return typeof v === 'object' ? v.naam : String(v);
  });
  out.s = tpl.replace(/\{(\w+)\}/g, (_, key) => {
    const v = all[key];
    if (v == null) return '';
    return typeof v === 'object' ? (v.uitspraak || v.naam) : String(v);
  });
  return out;
}

export const fav = () => store.get().kind.favorieten || {};
export const kleurHex = (k) => KLEUREN[k] || KLEUREN.rood;
export const teken = () => store.get().kind.teken || 'ster';

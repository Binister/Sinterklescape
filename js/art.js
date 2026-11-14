// Alle tekeningen als SVG-strings. Platte, vrolijke prentenboekstijl.

const INK = '#2b1d14';
const S = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
let uid = 0;
const nid = () => 'u' + (++uid);

export function svg(viewBox, body, cls = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${cls}" width="100%" height="100%">${body}</svg>`;
}

// ---------------- personages ----------------

export function sint(opts = {}) {
  return svg('0 0 200 260', `
    ${opts.staf === false ? '' : '<path d="M38 252 V64 C38 28 84 28 78 58 C75 72 58 70 61 58" fill="none" stroke="#e0a82e" stroke-width="9" stroke-linecap="round"/>'}
    <path d="M48 256 Q50 150 100 128 Q150 150 152 256 Z" fill="#c8102e" ${S}/>
    <path d="M80 256 Q84 172 100 160 Q116 172 120 256 Z" fill="#fff"/>
    <path d="M80 256 Q84 172 100 160 Q116 172 120 256" fill="none" stroke="#f2b632" stroke-width="9"/>
    <path d="M48 256 Q50 150 100 128 Q150 150 152 256" fill="none" ${S}/>
    <circle cx="46" cy="176" r="13" fill="#fff" ${S}/>
    <circle cx="100" cy="98" r="31" fill="#f5c9a5" ${S}/>
    <path d="M67 100 Q66 158 100 178 Q134 158 133 100 Q122 122 100 120 Q78 122 67 100 Z" fill="#fff" ${S}/>
    <path d="M84 116 Q100 106 116 116 Q108 124 100 118 Q92 124 84 116 Z" fill="#fff" ${S}/>
    <circle cx="89" cy="94" r="4" fill="${INK}"/><circle cx="111" cy="94" r="4" fill="${INK}"/>
    <path d="M83 85 q6 -4 12 0 M105 85 q6 -4 12 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="100" cy="106" r="6" fill="#e9a07c"/>
    ${opts.mijter === false ? `<path d="M70 86 Q72 62 100 60 Q128 62 130 86 Q100 74 70 86 Z" fill="#fff" ${S}/>` : `<path d="M68 80 L71 30 Q100 2 129 30 L132 80 Z" fill="#c8102e" ${S}/>
    <path d="M69 78 H131" stroke="#f2b632" stroke-width="9"/>
    <path d="M100 30 V64 M88 44 H112" stroke="#f2b632" stroke-width="7" stroke-linecap="round"/>`}
  `);
}

const PIET_KLEUREN = ['#2f7de1', '#8e44ad', '#45b649', '#f28c28', '#1fb5a9', '#d7263d'];

/** Roetveegpiet. opts: { face: dataUrl, color, cap: true|false, collar: true|false } */
export function piet(opts = {}) {
  const id = nid();
  const color = opts.color || PIET_KLEUREN[0];
  const capColor = opts.capColor || '#2b1d14';
  const cap = opts.cap !== false;
  const collar = opts.collar !== false;
  const face = opts.face
    ? `<clipPath id="${id}"><circle cx="100" cy="102" r="40"/></clipPath>
       <circle cx="100" cy="102" r="40" fill="#f0e2c8"/>
       <image href="${opts.face}" x="60" y="62" width="80" height="80" clip-path="url(#${id})" preserveAspectRatio="xMidYMid slice"/>
       <circle cx="100" cy="102" r="40" fill="none" ${S}/>`
    : `<circle cx="100" cy="102" r="40" fill="#e8b48c" ${S}/>
       <ellipse cx="80" cy="118" rx="9" ry="5" fill="#5a4a42" opacity=".55"/>
       <ellipse cx="122" cy="94" rx="7" ry="4" fill="#5a4a42" opacity=".5"/>
       <ellipse cx="106" cy="128" rx="5" ry="3" fill="#5a4a42" opacity=".45"/>
       <circle cx="86" cy="98" r="5" fill="${INK}"/><circle cx="114" cy="98" r="5" fill="${INK}"/>
       <circle cx="88" cy="96" r="1.6" fill="#fff"/><circle cx="116" cy="96" r="1.6" fill="#fff"/>
       <path d="M84 114 Q100 130 116 114" fill="none" ${S}/>
       <circle cx="74" cy="110" r="6" fill="#f08a7a" opacity=".5"/><circle cx="126" cy="110" r="6" fill="#f08a7a" opacity=".5"/>`;
  return svg('0 0 200 260', `
    <path d="M54 256 Q54 162 100 150 Q146 162 146 256 Z" fill="${color}" ${S}/>
    <path d="M70 256 V200 M130 256 V200" stroke="rgba(0,0,0,.18)" stroke-width="8"/>
    <rect x="57" y="200" width="86" height="13" fill="#2b1d14"/>
    <rect x="92" y="198" width="16" height="17" rx="3" fill="#f2b632" ${S}/>
    ${collar ? `<path d="M62 154 Q100 182 138 154 Q124 138 100 138 Q76 138 62 154 Z" fill="#fff" ${S}/>` : ''}
    ${face}
    ${cap ? `<path d="M52 92 Q58 46 104 46 Q152 48 152 86 Q100 70 52 92 Z" fill="${capColor}" ${S}/>
             <path d="M128 62 Q172 12 182 36 Q164 60 130 72 Z" fill="#fff" ${S}/>
             <path d="M134 66 Q160 40 176 36" fill="none" stroke="#ccc" stroke-width="3"/>` : ''}
  `);
}
export const pietColor = (i) => PIET_KLEUREN[i % PIET_KLEUREN.length];

/** Het witte paard. opts: { zadel, deken } */
export function paard(opts = {}) {
  return svg('0 0 300 230', `
    <path d="M62 112 Q24 120 30 176 Q44 150 60 140" fill="#cfcfd6" ${S}/>
    <rect x="86" y="140" width="20" height="74" rx="9" fill="#fff" ${S}/>
    <rect x="112" y="144" width="20" height="72" rx="9" fill="#f1f1f4" ${S}/>
    <rect x="182" y="144" width="20" height="72" rx="9" fill="#f1f1f4" ${S}/>
    <rect x="206" y="140" width="20" height="74" rx="9" fill="#fff" ${S}/>
    <rect x="84" y="204" width="24" height="12" rx="4" fill="#5a4a42"/><rect x="204" y="204" width="24" height="12" rx="4" fill="#5a4a42"/>
    <ellipse cx="152" cy="118" rx="94" ry="46" fill="#fff" ${S}/>
    <path d="M206 100 Q214 52 244 30 L270 62 Q240 80 236 124 Z" fill="#fff" ${S}/>
    <path d="M236 22 Q262 14 286 50 Q292 66 280 74 Q266 80 256 68 Q240 54 230 40 Z" fill="#fff" ${S}/>
    <path d="M226 26 Q200 50 208 96 Q218 60 236 40 Z" fill="#cfcfd6" ${S}/>
    <path d="M238 20 L232 2 L248 16 Z" fill="#fff" ${S}/>
    <circle cx="258" cy="40" r="4.5" fill="${INK}"/>
    <circle cx="281" cy="62" r="3" fill="${INK}"/>
    ${opts.deken ? `<path d="M108 80 Q152 66 196 80 L200 150 Q152 162 104 150 Z" fill="${opts.deken}" ${S}/>` : ''}
    ${opts.zadel ? `<path d="M120 76 Q152 60 184 76 Q186 104 152 108 Q118 104 120 76 Z" fill="#8b3a1a" ${S}/>
       <path d="M128 76 Q152 66 176 76" fill="none" stroke="#f2b632" stroke-width="5"/>
       <path d="M150 104 V146" stroke="${INK}" stroke-width="4"/><rect x="140" y="144" width="20" height="10" rx="3" fill="#f2b632" ${S}/>` : ''}
  `);
}

export function stoomboot() {
  return svg('0 0 300 200', `
    <rect x="150" y="34" width="34" height="62" fill="#d7263d" ${S}/>
    <rect x="150" y="34" width="34" height="14" fill="#2b1d14"/>
    <circle cx="176" cy="20" r="11" fill="#ddd" opacity=".8"/><circle cx="192" cy="8" r="8" fill="#ddd" opacity=".6"/>
    <rect x="80" y="74" width="140" height="44" rx="6" fill="#fff" ${S}/>
    <circle cx="110" cy="96" r="9" fill="#9fd4ff" ${S}/><circle cx="150" cy="96" r="9" fill="#9fd4ff" ${S}/><circle cx="190" cy="96" r="9" fill="#9fd4ff" ${S}/>
    <path d="M20 118 H284 L256 170 H52 Z" fill="#1d2b53" ${S}/>
    <path d="M32 132 H272" stroke="#d7263d" stroke-width="8"/>
    <path d="M66 74 V30 L98 44 L66 56" fill="#f2b632" ${S}/>
    <path d="M0 176 Q25 166 50 176 T100 176 T150 176 T200 176 T250 176 T300 176 V200 H0 Z" fill="#4aa3df"/>
  `);
}

// ---------------- gebouwen voor de kaart ----------------

function gebouw({ wall, roof, door = '#7a3e1c', sign = '', signBg = '#fff', extra = '' }) {
  return svg('0 0 220 220', `
    <path d="M24 100 L110 26 L196 100 Z" fill="${roof}" ${S}/>
    <rect x="38" y="96" width="144" height="104" fill="${wall}" ${S}/>
    <rect x="92" y="138" width="36" height="62" rx="16" fill="${door}" ${S}/>
    <rect x="52" y="116" width="28" height="28" rx="4" fill="#ffe9a8" ${S}/>
    <rect x="140" y="116" width="28" height="28" rx="4" fill="#ffe9a8" ${S}/>
    <circle cx="110" cy="72" r="26" fill="${signBg}" ${S}/>
    <text x="110" y="84" font-size="32" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">${sign}</text>
    ${extra}
  `);
}

export const plekArt = {
  stoomboot: () => svg('0 0 220 220', `
    <circle cx="110" cy="110" r="104" fill="#bfe3ff" ${S}/>
    <g transform="translate(6 40) scale(.7)">${stoomboot().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`),
  pakhuis: () => gebouw({ wall: '#c98a4b', roof: '#7a3e1c', sign: '🎁', extra: `<path d="M38 120 H182 M38 150 H182 M38 180 H182" stroke="rgba(0,0,0,.15)" stroke-width="4"/>` }),
  bakkerij: () => gebouw({ wall: '#fbe3c2', roof: '#d7263d', sign: '🍪', extra: `<rect x="150" y="30" width="20" height="40" fill="#8a8a8a" ${S}/>` }),
  stal: () => gebouw({ wall: '#b5452e', roof: '#5a2a18', sign: '🐴', door: '#fff', extra: `<path d="M92 160 L128 196 M128 160 L92 196" stroke="#b5452e" stroke-width="5"/>` }),
  werkkamer: () => gebouw({ wall: '#8e44ad', roof: '#f2b632', sign: '📖', extra: `<path d="M38 96 h18 v-12 h16 v12 h18" fill="none" ${S}/>` }),
  pietenschool: () => gebouw({ wall: '#2f7de1', roof: '#1d2b53', sign: '🎓', extra: `<path d="M110 26 V6 M110 6 h16 v10 h-16" fill="#f2b632" ${S}/>` }),
  daken: () => svg('0 0 220 220', `
    <circle cx="110" cy="110" r="104" fill="#1d2b53" ${S}/>
    <circle cx="160" cy="60" r="18" fill="#ffe08a"/>
    <path d="M30 150 L70 112 L110 150 Z M100 150 L140 104 L180 150 Z" fill="#b5452e" ${S}/>
    <rect x="34" y="148" width="72" height="44" fill="#e8d2b0" ${S}/><rect x="104" y="148" width="72" height="44" fill="#f4e1c1" ${S}/>
    <rect x="148" y="104" width="14" height="26" fill="#8a8a8a" ${S}/>
    <text x="60" y="80" font-size="22" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">⭐</text>`),
};

// ---------------- voorwerpen (opbrengst per plek) ----------------

export const itemArt = {
  kist: () => svg('0 0 120 120', `
    <rect x="14" y="48" width="92" height="56" rx="6" fill="#9a5b2e" ${S}/>
    <path d="M14 52 Q14 22 60 22 Q106 22 106 52 Z" fill="#b8733d" ${S}/>
    <path d="M14 52 H106" ${S}/>
    <rect x="52" y="44" width="16" height="22" rx="3" fill="#f2b632" ${S}/>
    <path d="M30 26 V104 M90 26 V104" stroke="#f2b632" stroke-width="6"/>`),
  zak: () => svg('0 0 120 120', `
    <path d="M30 40 Q14 70 22 98 Q30 112 60 112 Q90 112 98 98 Q106 70 90 40 Z" fill="#b98a55" ${S}/>
    <path d="M36 40 Q60 30 84 40 L80 26 Q60 34 40 26 Z" fill="#b98a55" ${S}/>
    <path d="M36 42 Q60 50 84 42" fill="none" stroke="#d7263d" stroke-width="7"/>
    <text x="60" y="88" font-size="30" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji">🎁</text>`),
  pepernoten: () => svg('0 0 120 120', [[38, 80], [64, 86], [88, 76], [50, 58], [76, 58], [62, 36]].map(([x, y]) => pepernootBody(x, y, 16)).join('')),
  zadel: () => svg('0 0 120 120', `
    <path d="M14 50 Q60 24 106 50 Q108 84 60 90 Q12 84 14 50 Z" fill="#8b3a1a" ${S}/>
    <path d="M24 50 Q60 34 96 50" fill="none" stroke="#f2b632" stroke-width="6"/>
    <path d="M60 88 V108" ${S}/><rect x="48" y="104" width="24" height="10" rx="3" fill="#f2b632" ${S}/>`),
  boek: () => grootBoek(),
  routekaart: () => svg('0 0 120 120', `
    <path d="M14 22 L44 12 L76 22 L106 12 V98 L76 108 L44 98 L14 108 Z" fill="#f8e7c3" ${S}/>
    <path d="M44 12 V98 M76 22 V108" stroke="#d6bf92" stroke-width="3"/>
    <path d="M24 86 Q40 60 58 70 T92 36" fill="none" stroke="#d7263d" stroke-width="4" stroke-dasharray="6 6"/>
    <path d="M86 28 l12 12 M98 28 l-12 12" stroke="#d7263d" stroke-width="5" stroke-linecap="round"/>`),
};

export function grootBoek() {
  return svg('0 0 120 120', `
    <rect x="16" y="18" width="88" height="88" rx="8" fill="#c8102e" ${S}/>
    <rect x="16" y="18" width="14" height="88" rx="4" fill="#7a1018" ${S}/>
    <rect x="40" y="34" width="52" height="56" rx="6" fill="none" stroke="#f2b632" stroke-width="4"/>
    <path d="M66 46 V78 M54 58 H78" stroke="#f2b632" stroke-width="5" stroke-linecap="round"/>`);
}

function pepernootBody(x, y, r) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#b5651d" ${S}/>
    <circle cx="${x - r * .35}" cy="${y - r * .2}" r="${r * .12}" fill="#7a3e10"/>
    <circle cx="${x + r * .3}" cy="${y - r * .35}" r="${r * .1}" fill="#7a3e10"/>
    <circle cx="${x + r * .1}" cy="${y + r * .35}" r="${r * .12}" fill="#7a3e10"/>
    <path d="M${x - r * .6} ${y - r * .5} q${r * .3} ${-r * .3} ${r * .7} ${-r * .3}" fill="none" stroke="#e0a060" stroke-width="3" stroke-linecap="round"/>`;
}
export const pepernoot = () => svg('0 0 60 60', pepernootBody(30, 30, 24));

export function hoefijzer() {
  return svg('0 0 100 100', `
    <path d="M24 88 V48 A26 26 0 0 1 76 48 V88 H60 V50 A10 10 0 0 0 40 50 V88 Z" fill="#9aa3ad" ${S}/>
    <circle cx="32" cy="60" r="3" fill="${INK}"/><circle cx="68" cy="60" r="3" fill="${INK}"/><circle cx="34" cy="76" r="3" fill="${INK}"/><circle cx="66" cy="76" r="3" fill="${INK}"/>`);
}

export function mijter() {
  return svg('0 0 100 100', `
    <path d="M22 92 L24 34 Q50 2 76 34 L78 92 Z" fill="#c8102e" ${S}/>
    <path d="M22 88 H78" stroke="#f2b632" stroke-width="8"/>
    <path d="M50 30 V68 M38 46 H62" stroke="#f2b632" stroke-width="7" stroke-linecap="round"/>`);
}

export function staf() {
  return svg('0 0 100 100', `<path d="M44 96 V36 C44 6 84 6 80 30 C78 42 62 40 64 30" fill="none" stroke="#e0a82e" stroke-width="9" stroke-linecap="round"/>`);
}

export function mantel() {
  return svg('0 0 100 100', `
    <path d="M14 96 Q18 34 50 20 Q82 34 86 96 Z" fill="#c8102e" ${S}/>
    <path d="M40 96 Q42 50 50 40 Q58 50 60 96" fill="#fff" stroke="#f2b632" stroke-width="6"/>`);
}

export function pietMuts(color = '#2b1d14') {
  return svg('0 0 120 80', `
    <path d="M8 62 Q14 18 60 18 Q108 20 108 56 Q56 40 8 62 Z" fill="${color}" ${S}/>
    <path d="M84 34 Q112 -4 118 14 Q106 34 86 42 Z" fill="#fff" ${S}/>`);
}

export function kraag() {
  return svg('0 0 120 60', `<path d="M6 22 Q60 64 114 22 Q94 4 60 4 Q26 4 6 22 Z" fill="#fff" ${S}/>`);
}

export function chocoladeletter(letter = 'S') {
  return svg('0 0 100 100', `
    <rect x="14" y="10" width="72" height="84" rx="8" fill="#5a2e14" ${S}/>
    <text x="50" y="76" text-anchor="middle" font-size="64" font-weight="900" fill="#8a4b24" stroke="${INK}" stroke-width="2.5" font-family="ui-rounded, Arial Rounded MT Bold, sans-serif">${letter}</text>`);
}

export function speculaaspop() {
  return svg('0 0 100 120', `
    <path d="M50 6 a16 16 0 1 1 0.1 0 Z M34 34 Q20 36 8 46 Q4 56 16 58 L32 52 L26 112 Q36 118 46 110 L50 84 L54 110 Q64 118 74 112 L68 52 L84 58 Q96 56 92 46 Q80 36 66 34 Z" fill="#c07a3a" ${S}/>
    <circle cx="44" cy="20" r="2.6" fill="${INK}"/><circle cx="56" cy="20" r="2.6" fill="${INK}"/>`);
}

/** Pakje in een kleur, met strik. */
export function pakje(color = '#d7263d', ribbon = '#f2b632', opts = {}) {
  return svg('0 0 100 100', `
    <rect x="12" y="34" width="76" height="60" rx="6" fill="${color}" ${S}/>
    <rect x="8" y="24" width="84" height="18" rx="5" fill="${color}" ${S}/>
    <path d="M50 24 V94" stroke="${ribbon}" stroke-width="10"/>
    ${opts.noBow ? '' : `<path d="M50 24 Q30 2 26 16 Q24 26 50 24 Q70 2 74 16 Q76 26 50 24 Z" fill="${ribbon}" ${S}/>`}`);
}

export function doos(color = '#c98a4b') {
  return svg('0 0 100 100', `
    <rect x="12" y="30" width="76" height="64" rx="6" fill="${color}" ${S}/>
    <path d="M12 30 L26 14 H74 L88 30" fill="${color}" ${S}/>`);
}

export function strik(color = '#f2b632') {
  return svg('0 0 100 60', `<path d="M50 34 Q16 -6 8 20 Q4 44 50 34 Q84 -6 92 20 Q96 44 50 34 Z" fill="${color}" ${S}/><circle cx="50" cy="32" r="8" fill="${color}" ${S}/>`);
}

/** Huis (voorkant) met schoorsteen. opts: { wall, roof, chimneyLabel (html in schoorsteen-cirkel niet; los) } */
export function huis(wall = '#f4e1c1', roof = '#b5452e') {
  return svg('0 0 140 160', `
    <rect x="92" y="18" width="22" height="46" fill="#8a8a8a" ${S}/>
    <path d="M8 76 L70 18 L132 76 Z" fill="${roof}" ${S}/>
    <rect x="20" y="74" width="100" height="82" fill="${wall}" ${S}/>
    <rect x="56" y="108" width="28" height="48" rx="12" fill="#7a3e1c" ${S}/>
    <rect x="30" y="88" width="20" height="20" rx="3" fill="#ffe9a8" ${S}/>
    <rect x="90" y="88" width="20" height="20" rx="3" fill="#ffe9a8" ${S}/>`);
}

export function schoorsteen() {
  return svg('0 0 80 100', `<rect x="14" y="14" width="52" height="84" fill="#9a4a3a" ${S}/><rect x="8" y="6" width="64" height="16" rx="3" fill="#7a3a2a" ${S}/>
    <path d="M14 40 H66 M14 66 H66 M40 22 V40 M28 40 V66 M52 40 V66 M40 66 V98" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`);
}

export function wolk(fill = '#fff') {
  return svg('0 0 200 100', `<path d="M40 80 Q10 80 14 58 Q18 36 46 42 Q52 14 86 18 Q112 2 134 26 Q170 18 176 48 Q196 56 186 74 Q180 84 160 82 Z" fill="${fill}" opacity=".95"/>`);
}

// ---------------- kleurplaten (T11) ----------------
// Elk gebied heeft data-r; het spel kleurt ze in.

export const kleurplaten = {
  speculaaspop: () => svg('0 0 300 340', `
    <path data-r="lijf" d="M150 20 a46 46 0 1 1 0.1 0 Z M104 100 Q60 104 26 130 Q14 158 48 164 L92 148 L76 314 Q104 332 132 310 L150 236 L168 310 Q196 332 224 314 L208 148 L252 164 Q286 158 274 130 Q240 104 196 100 Z" fill="#f6ead6" ${S}/>
    <circle data-r="oog1" cx="134" cy="60" r="10" fill="#fff" ${S}/><circle data-r="oog2" cx="166" cy="60" r="10" fill="#fff" ${S}/>
    <path d="M128 84 Q150 100 172 84" fill="none" ${S}/>
    <circle data-r="knoop1" cx="150" cy="150" r="13" fill="#fff" ${S}/><circle data-r="knoop2" cx="150" cy="190" r="13" fill="#fff" ${S}/><circle data-r="knoop3" cx="150" cy="230" r="13" fill="#fff" ${S}/>
    <path data-r="sjaal" d="M110 106 Q150 128 190 106 L196 124 Q150 146 104 124 Z" fill="#fff" ${S}/>`),
  mijter: () => svg('0 0 300 340', `
    <path data-r="mijter" d="M60 320 L66 110 Q150 0 234 110 L240 320 Z" fill="#fff" ${S}/>
    <path data-r="rand" d="M58 280 H242 V320 H58 Z" fill="#fff" ${S}/>
    <path data-r="kruis" d="M136 90 H164 V140 H200 V168 H164 V240 H136 V168 H100 V140 H136 Z" fill="#fff" ${S}/>
    <circle data-r="steen" cx="150" cy="300" r="12" fill="#fff" ${S}/>`),
  pakpapier: () => svg('0 0 300 340', `
    <rect data-r="doos" x="40" y="110" width="220" height="210" rx="12" fill="#fff" ${S}/>
    <rect data-r="deksel" x="28" y="80" width="244" height="50" rx="10" fill="#fff" ${S}/>
    <rect data-r="lint" x="134" y="80" width="32" height="240" fill="#fff" ${S}/>
    <path data-r="strik" d="M150 80 Q90 10 80 50 Q76 84 150 80 Q210 10 220 50 Q224 84 150 80 Z" fill="#fff" ${S}/>
    <circle data-r="stip1" cx="88" cy="200" r="18" fill="#fff" ${S}/><circle data-r="stip2" cx="212" cy="250" r="18" fill="#fff" ${S}/>`),
  deken: () => svg('0 0 300 340', `
    <path data-r="deken" d="M30 80 Q150 40 270 80 L280 280 Q150 320 20 280 Z" fill="#fff" ${S}/>
    <path data-r="streep1" d="M26 140 Q150 104 274 140 L276 172 Q150 136 24 172 Z" fill="#fff" ${S}/>
    <path data-r="streep2" d="M22 220 Q150 184 278 220 L279 252 Q150 216 21 252 Z" fill="#fff" ${S}/>
    <circle data-r="ster" cx="150" cy="110" r="16" fill="#fff" ${S}/>`),
};

// ---------------- achtergronden ----------------

export const bg = {
  pakhuis: 'linear-gradient(#e9c79a, #d9a066 60%, #b8733d)',
  bakkerij: 'repeating-linear-gradient(45deg, #fff3e0 0 40px, #fde4c4 40px 80px)',
  stal: 'linear-gradient(#f4d79a, #e8c06a 55%, #c9973c)',
  werkkamer: 'radial-gradient(circle at 50% 30%, #b06ac9, #6d2d8a)',
  pietenschool: 'linear-gradient(#bde0ff, #8cc4ff 60%, #6aa9e8)',
  stoomboot: 'linear-gradient(#bfe3ff 0 55%, #4aa3df 55% 100%)',
  daken: 'radial-gradient(circle at 80% 15%, #3a5394, #1d2b53 50%, #101834)',
  kaart: 'linear-gradient(#9fd4ff 0 20%, #b9e3a6 20% 100%)',
  start: 'radial-gradient(circle at 50% 40%, #e2343f, #7a1018 70%)',
};

/** Decoratie per plek (achter de opdracht), absoluut gepositioneerde SVG-laag. */
export function decor(plek) {
  const d = {
    pakhuis: `<rect x="0" y="700" width="1200" height="160" fill="#8b5a2b"/><path d="M0 700 H1200" stroke="#6b3e1c" stroke-width="8"/>
      ${[80, 260, 940, 1080].map((x) => `<rect x="${x}" y="560" width="120" height="140" fill="#b8733d" stroke="#6b3e1c" stroke-width="6"/><path d="M${x} 560 l120 140 M${x + 120} 560 l-120 140" stroke="#6b3e1c" stroke-width="5"/>`).join('')}`,
    bakkerij: `<rect x="0" y="720" width="1200" height="140" fill="#c98a4b"/><rect x="900" y="420" width="260" height="300" rx="20" fill="#7a7a7a" stroke="${INK}" stroke-width="6"/><rect x="930" y="500" width="200" height="140" rx="14" fill="#2b1d14"/><rect x="940" y="510" width="180" height="120" rx="10" fill="#f28c28" opacity=".7"/>`,
    stal: `<rect x="0" y="690" width="1200" height="170" fill="#d4a849"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${i * 42} 700 q10 -30 20 0" stroke="#b58a2a" stroke-width="5" fill="none"/>`).join('')}`,
    werkkamer: `<rect x="0" y="720" width="1200" height="140" fill="#5a2a18"/><rect x="60" y="180" width="200" height="300" rx="100" fill="#3a1a50" opacity=".5"/><rect x="940" y="180" width="200" height="300" rx="100" fill="#3a1a50" opacity=".5"/>`,
    pietenschool: `<rect x="0" y="720" width="1200" height="140" fill="#3fa34d"/>`,
    stoomboot: `<path d="M0 520 Q60 500 120 520 T240 520 T360 520 T480 520 T600 520 T720 520 T840 520 T960 520 T1080 520 T1200 520" stroke="#fff" stroke-width="6" fill="none" opacity=".5"/>`,
    daken: `${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 197) % 1200}" cy="${(i * 89) % 400}" r="${(i % 3) + 1.5}" fill="#fff" opacity=".8"/>`).join('')}<circle cx="1000" cy="110" r="60" fill="#ffe08a"/>`,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 860" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none">${d[plek] || ''}</svg>`;
}

// Ouder-instellingen (niet geschaald, gewone pagina-stijl).

import { h } from './util.js';
import * as store from './store.js';
import * as speech from './speech.js';
import { FAV, DINGEN, TEKENS, ROLLEN, KLEURNAAM, kleurHex } from './data.js';
import { PLEKKEN } from './content.js';
import * as round from './round.js';

const ov = () => document.getElementById('overlay');

export function openParent({ firstRun = false, onClose } = {}) {
  speech.stop();
  document.body.classList.remove('game');
  const s = store.get();
  const root = h('div', { class: 'parent' });
  const wrap = h('div', { class: 'wrap' });
  root.append(wrap);
  ov().replaceChildren(root);
  ov().classList.add('on');

  const close = () => {
    if (!s.kind.naam.trim()) { alert('Vul eerst de naam van je kind in.'); return; }
    s.ingesteld = true;
    store.save();
    ov().classList.remove('on');
    ov().replaceChildren();
    document.body.classList.add('game');
    onClose && onClose();
  };

  if (!firstRun) wrap.append(h('button', { class: 'closex', 'aria-label': 'Sluiten', text: '✕', onclick: close }));
  wrap.append(
    h('h1', { text: firstRun ? 'Welkom bij Sinterklescape' : 'Ouder-instellingen' }),
    h('p', { class: 'sub', text: firstRun
      ? 'Een speurtocht voor kinderen van 4 tot 6 jaar, die ze zelfstandig spelen. Vul hieronder in voor wie het spel is. Alles wordt alleen op deze iPad bewaard. Deze instellingen kun je later terugvinden door het tandwiel rechtsonder 3 seconden ingedrukt te houden.'
      : 'Alles wordt alleen op deze iPad bewaard.' }),
  );
  if (!store.isStorageOk()) wrap.append(h('section', {}, h('b', { text: '⚠️ Deze browser kan niets bewaren (privémodus?). Het spel werkt, maar onthoudt niets na sluiten.' })));

  // ---------- kind ----------
  const kind = s.kind;
  const sk = h('section', {}, h('h2', { text: '🧒 Het kind' }));
  const naamIn = h('input', { type: 'text', value: kind.naam, placeholder: 'Bijvoorbeeld: Noor', autocomplete: 'off' });
  naamIn.addEventListener('input', () => { kind.naam = naamIn.value; store.save(); });
  const uitIn = h('input', { type: 'text', value: kind.uitspraak, placeholder: 'Alleen invullen als de stem de naam verkeerd zegt', autocomplete: 'off' });
  uitIn.addEventListener('input', () => { kind.uitspraak = uitIn.value; store.save(); });
  const test = h('button', { class: 'pbtn', text: '🔊 Test', onclick: () => { speech.unlock(); speech.say({ d: 'Hallo ' + kind.naam, s: 'Hallo ' + (kind.uitspraak || kind.naam) + '!' }, 'sint'); } });
  sk.append(h('label', { text: 'Naam' }), naamIn,
    h('label', { text: 'Uitspraak (optioneel)' }), h('div', { class: 'row' }, uitIn, test),
    h('div', { class: 'hint', text: 'Schrijf de naam zoals hij klinkt, bijvoorbeeld "Sjoert" voor Sjoerd.' }));
  sk.append(h('label', { text: 'Foto van het gezicht' }), photoPicker(kind.fotoId, '🧒', (id) => { kind.fotoId = id; store.save(); }));
  sk.append(h('div', { class: 'hint', text: 'Een foto van dichtbij, recht van voren, werkt het best. Die komt terug als piet-gezicht, in puzzels en op de oorkonde.' }));
  sk.append(h('label', { text: 'Teken van het kind' }), h('div', { class: 'hint', text: 'Zo herkent het kind zijn eigen pakje, schoen en huis zonder te hoeven lezen.' }));
  sk.append(pickGrid(Object.keys(TEKENS), (k) => TEKENS[k].e, kind.teken, (k) => { kind.teken = k; store.save(); }));
  wrap.append(sk);

  // ---------- favorieten ----------
  const sf = h('section', {}, h('h2', { text: '❤️ Favorieten' }), h('p', { class: 'hint', text: 'Sint "weet" dit uit zijn Grote Boek. Kies samen met je kind, of verras het.' }));
  sf.append(h('label', { text: 'Lievelingskleur' }));
  sf.append(pickGrid(FAV.kleur, () => '', kind.favorieten.kleur, (k) => { kind.favorieten.kleur = k; store.save(); }, (b, k) => { b.style.background = kleurHex(k); b.classList.add('swatch'); b.title = KLEURNAAM[k]; }));
  [['dier', 'Lievelingsdier'], ['eten', 'Lievelingseten'], ['speelgoed', 'Lievelingsspeelgoed']].forEach(([key, lbl]) => {
    sf.append(h('label', { text: lbl }));
    sf.append(pickGrid(FAV[key], (k) => DINGEN[k].e, kind.favorieten[key], (k) => { kind.favorieten[key] = k; store.save(); }));
  });
  wrap.append(sf);

  // ---------- familie ----------
  const sfam = h('section', {}, h('h2', { text: '👨‍👩‍👧 Familie en huisdieren' }), h('p', { class: 'hint', text: 'Tot 8 personen of dieren. Zij krijgen pakjes, komen in de memory en op de daken. Zonder familie verzint het spel een paar mensen.' }));
  const list = h('div');
  sfam.append(list);
  const renderFam = () => {
    list.replaceChildren();
    s.familie.forEach((p, i) => {
      const url = store.photo(p.fotoId);
      const av = url ? h('img', { src: url }) : h('div', { class: 'avatar', text: ROLLEN[p.rol] || '🙂' });
      const nameIn = h('input', { type: 'text', value: p.naam, placeholder: 'Naam (bijv. Oma)' });
      nameIn.addEventListener('input', () => { p.naam = nameIn.value; store.save(); });
      const uit = h('input', { type: 'text', value: p.uitspraak || '', placeholder: 'Uitspraak (optioneel)' });
      uit.addEventListener('input', () => { p.uitspraak = uit.value; store.save(); });
      const rol = h('select', {}, ...Object.keys(ROLLEN).map((r) => h('option', { value: r, text: ROLLEN[r] + ' ' + r, selected: p.rol === r })));
      rol.addEventListener('change', () => { p.rol = rol.value; store.save(); renderFam(); });
      const del = h('button', { class: 'pbtn danger', text: 'Verwijder', onclick: async () => { await store.deletePhoto(p.fotoId); s.familie.splice(i, 1); store.save(); renderFam(); } });
      const pic = photoPicker(p.fotoId, ROLLEN[p.rol], (id) => { p.fotoId = id; store.save(); renderFam(); }, true);
      list.append(h('div', { class: 'person' }, av, h('div', { class: 'grow' }, h('div', { class: 'row' }, nameIn, rol), h('div', { class: 'row', style: { marginTop: '8px' } }, uit, pic, del))));
    });
    if (s.familie.length < 8) list.append(h('div', { style: { marginTop: '10px' } }, h('button', { class: 'pbtn primary', text: '+ Persoon of huisdier toevoegen', onclick: () => { s.familie.push({ naam: '', rol: 'mama', fotoId: null, uitspraak: '' }); store.save(); renderFam(); } })));
  };
  renderFam();
  wrap.append(sfam);

  // ---------- stem ----------
  const sv = h('section', {}, h('h2', { text: '🗣️ Stem' }));
  const voices = speech.listVoices();
  if (!voices.length) {
    sv.append(h('p', { text: '⚠️ Er is (nog) geen Nederlandse stem gevonden. Het spel werkt wel, maar de app kan dan niet praten.' }));
  } else {
    const sel = h('select', {}, ...voices.map((v) => h('option', { value: v.voiceURI, text: v.name + ' (' + v.lang + ')', selected: speech.currentVoiceName() === v.name })));
    sel.addEventListener('change', () => speech.setVoice(sel.value));
    sv.append(h('label', { text: 'Nederlandse stem' }), h('div', { class: 'row' }, sel, h('button', { class: 'pbtn', text: '🔊 Test', onclick: () => { speech.unlock(); speech.say('Hallo! Ik ben Sinterklaas. Wat leuk dat je meedoet!', 'sint'); } })));
  }
  const tempo = h('select', {}, h('option', { value: 'normaal', text: 'Normaal', selected: s.instellingen.spreektempo !== 'langzaam' }), h('option', { value: 'langzaam', text: 'Langzaam', selected: s.instellingen.spreektempo === 'langzaam' }));
  tempo.addEventListener('change', () => { s.instellingen.spreektempo = tempo.value; store.save(); });
  sv.append(h('label', { text: 'Spreektempo' }), tempo,
    h('p', { class: 'hint', text: 'Tip: download een "verbeterde" Nederlandse stem voor een veel natuurlijker geluid: Instellingen › Toegankelijkheid › Gesproken materiaal › Stemmen › Nederlands. Herstart daarna het spel.' }));
  wrap.append(sv);

  // ---------- camera, microfoon, extra magie ----------
  const sc = h('section', {}, h('h2', { text: '📷 Camera, microfoon en extra magie' }));
  const status = h('div', { class: 'hint' });
  const camTest = h('button', { class: 'pbtn', text: 'Test camera', onclick: () => testMedia({ video: { facingMode: 'environment' } }, status, 'Camera') });
  const micTest = h('button', { class: 'pbtn', text: 'Test microfoon', onclick: () => testMedia({ audio: true }, status, 'Microfoon') });
  sc.append(h('p', { class: 'hint', text: 'Sommige opdrachten gebruiken de camera (foto voor Sint, QR-kaartjes) of de microfoon (alleen het volume: "Sint hoort je zingen"). Geef hier alvast toestemming. Weiger je, dan past het spel zich aan.' }),
    h('div', { class: 'row' }, camTest, micTest), status);
  sc.append(toggle('✨ Extra magie: verstopte QR-kaartjes', s.instellingen.extraMagie, (v) => { s.instellingen.extraMagie = v; store.save(); round.refreshUnstarted(); }));
  sc.append(h('p', { class: 'hint' }, 'Print de kaartjes en verstop ze in huis. Per plek komt één opdracht "zoek het kaartje". ', h('a', { href: 'print/kaartjes.html', target: '_blank', text: 'Kaartjes printen →' })));
  sc.append(toggle('🔔 Geluidseffecten', s.instellingen.geluid, (v) => { s.instellingen.geluid = v; store.save(); }));
  wrap.append(sc);

  // ---------- voortgang ----------
  const sp = h('section', {}, h('h2', { text: '📊 Voortgang' }));
  const r = round.current();
  const pl = h('div', { class: 'progress-list' });
  pl.append(h('div', {}, h('span', { text: 'Ronde' }), h('b', { text: String(r.nummer) })));
  PLEKKEN.forEach((p) => {
    const ps = r.plekken[p.id];
    const skip = h('button', { class: 'pbtn', style: { padding: '4px 10px', fontSize: '14px' }, text: 'opdracht overslaan', onclick: () => { if (ps.klaar < ps.taken.length) { round.markDone(p.id); if (ps.klaar >= ps.taken.length) round.collect(p.id, p.item); refresh(); } } });
    pl.append(h('div', {}, h('span', { text: p.naam }), h('span', {}, `${ps.klaar} / ${ps.taken.length} ${r.voorwerpen.includes(p.item) ? '✅' : ''} `, ps.klaar < ps.taken.length ? skip : '')));
  });
  sp.append(pl,
    h('p', { class: 'hint', text: 'Een ronde duurt ongeveer 2 à 3 uur. Daarna kan het kind een nieuwe ronde spelen met een ander verhaal en andere opdrachten.' }),
    h('div', { class: 'row' },
      h('button', { class: 'pbtn', text: 'Nieuwe ronde starten', onclick: () => { if (confirm('Een nieuwe ronde beginnen? De voortgang van deze ronde gaat verloren.')) { round.newRound(); refresh(); } } }),
      h('button', { class: 'pbtn danger', text: 'Alles wissen', onclick: async () => { if (confirm('Alles wissen, ook alle foto\'s en namen?')) { store.reset(); await store.clearPhotos(); location.reload(); } } })));
  wrap.append(sp);

  // ---------- installeren ----------
  wrap.append(h('section', {}, h('h2', { text: '📲 Als app op het beginscherm' }),
    h('p', { class: 'hint', text: 'Open deze pagina in Safari, tik op het deel-icoon en kies "Zet op beginscherm". Dan opent het spel schermvullend en werkt het ook zonder internet. Zet bij Instellingen › Schermtijd eventueel "Begeleide toegang" aan, zodat je kind niet per ongeluk uit het spel gaat.' })));

  wrap.append(h('div', { class: 'sticky-bottom' }, h('button', { class: 'pbtn primary', text: firstRun ? 'Klaar, start het spel! 🎁' : 'Terug naar het spel', onclick: close })));

  function refresh() { openParent({ firstRun, onClose }); }
}

function toggle(label, value, onChange) {
  const cb = h('input', { type: 'checkbox' });
  cb.checked = !!value;
  cb.addEventListener('change', () => onChange(cb.checked));
  return h('label', { class: 'toggle' }, h('span', { text: label }), cb);
}

function pickGrid(keys, labelFn, selected, onPick, decorate) {
  const g = h('div', { class: 'pick' });
  keys.forEach((k) => {
    const b = h('button', { type: 'button', class: k === selected ? 'sel' : '', text: labelFn(k) });
    if (decorate) decorate(b, k);
    b.addEventListener('click', () => { g.querySelectorAll('button').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); onPick(k); });
    g.append(b);
  });
  return g;
}

function photoPicker(currentId, fallbackEmoji, onChange, compact = false) {
  const input = h('input', { type: 'file', accept: 'image/*', style: { display: 'none' } });
  const url = store.photo(currentId);
  const prev = compact ? null : (url ? h('img', { src: url, style: { width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' } }) : h('div', { class: 'avatar', style: { width: '96px', height: '96px', borderRadius: '50%', background: '#eadcc4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }, text: fallbackEmoji }));
  const btn = h('button', { class: 'pbtn', type: 'button', text: currentId ? '📷 Andere foto' : '📷 Foto kiezen' });
  btn.addEventListener('click', () => input.click());
  input.addEventListener('change', async () => {
    const f = input.files && input.files[0];
    if (!f) return;
    btn.textContent = 'Bezig…';
    try {
      const data = await store.fileToDataUrl(f, 480, true);
      const old = currentId;
      const id = await store.putPhoto(data);
      if (old) store.deletePhoto(old);
      currentId = id;
      if (prev) prev.replaceWith(Object.assign(h('img', { src: data, style: { width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover' } })));
      btn.textContent = '✅ Foto opgeslagen';
      onChange(id);
    } catch (e) {
      btn.textContent = '⚠️ Dat lukte niet, probeer opnieuw';
    }
  });
  const w = h('div', { class: 'row', style: { flex: '0 0 auto' } }, input);
  if (prev) w.append(prev);
  w.append(btn);
  return w;
}

async function testMedia(constraints, status, label) {
  try {
    const s = await navigator.mediaDevices.getUserMedia(constraints);
    s.getTracks().forEach((t) => t.stop());
    status.textContent = '✅ ' + label + ' werkt.';
  } catch (e) {
    status.textContent = '⚠️ ' + label + ' werkt niet of is geweigerd (' + (e.name || 'fout') + '). Het spel slaat die opdrachten dan over of gebruikt een vervanging. Toestemming aanpassen: Instellingen › Safari › Camera/Microfoon.';
  }
}

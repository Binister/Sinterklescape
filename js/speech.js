// Spraak via de ingebouwde stem van het apparaat (speechSynthesis).
// Alles heeft een vangnet: zonder stem gaat het spel gewoon door (ondertitel + tijd).

import { TEST } from './util.js';
import * as store from './store.js';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voice = null;
let voices = [];
let token = 0; // verhoogd bij stop(), zodat lopende wachtrijen afbreken
const captionEl = () => document.getElementById('caption');
let captionTimer = null;

const WHO = {
  sint: { pitch: 0.78, rate: 0.88 },
  piet: { pitch: 1.3, rate: 1.0 },
  verteller: { pitch: 1.05, rate: 0.95 },
};

export function listVoices() {
  return voices.filter((v) => /^nl/i.test(v.lang));
}

function chooseVoice() {
  if (!synth) return;
  voices = synth.getVoices() || [];
  const wanted = store.get().instellingen.stem;
  const nl = listVoices();
  voice =
    nl.find((v) => v.voiceURI === wanted) ||
    nl.find((v) => /nl[-_]NL/i.test(v.lang) && /(premium|enhanced|verbeterd|natural)/i.test(v.name)) ||
    nl.find((v) => /nl[-_]NL/i.test(v.lang) && /(xander|claire|ellen|fenna|colette)/i.test(v.name)) ||
    nl.find((v) => /nl[-_]NL/i.test(v.lang)) ||
    nl[0] ||
    null;
}

export function init() {
  if (!synth) return;
  chooseVoice();
  synth.onvoiceschanged = chooseVoice;
  setTimeout(chooseVoice, 500);
  setTimeout(chooseVoice, 2000);
}

export const hasVoice = () => !!(synth && voice);
export const currentVoiceName = () => (voice ? voice.name : null);
export function setVoice(uri) {
  store.get().instellingen.stem = uri;
  store.save();
  chooseVoice();
}

/** Ontgrendel spraak (moet binnen een tik-gebeurtenis gebeuren op iOS). */
export function unlock() {
  if (!synth) return;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    synth.speak(u);
  } catch (e) { /* negeren */ }
}

function showCaption(text) {
  const c = captionEl();
  if (!c) return;
  c.textContent = text;
  c.classList.add('on');
  clearTimeout(captionTimer);
}
function hideCaption() {
  const c = captionEl();
  if (!c) return;
  clearTimeout(captionTimer);
  captionTimer = setTimeout(() => c.classList.remove('on'), 700);
}

/**
 * Spreek een tekst uit. `text` is een string, of { d: weergave, s: uitspraak }.
 * Geeft een Promise die klaar is als de zin is uitgesproken (of na een veilige time-out).
 */
export function say(text, who = 'verteller') {
  const d = typeof text === 'string' ? text : text.d;
  const s = typeof text === 'string' ? text : text.s || text.d;
  const my = token;
  showCaption(d);
  const est = Math.max(1200, s.length * 75) + 1800;
  if (TEST) return new Promise((r) => setTimeout(() => { hideCaption(); r(); }, 5));
  return new Promise((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      if (my === token) hideCaption();
      resolve();
    };
    const timer = setTimeout(finish, est);
    if (!synth || !voice) {
      // geen stem: wacht een leestijd zodat ouder/ondertitel kan helpen
      clearTimeout(timer);
      setTimeout(finish, Math.min(est, 2500));
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(s);
      u.voice = voice;
      u.lang = voice.lang;
      const p = WHO[who] || WHO.verteller;
      const tempo = store.get().instellingen.spreektempo === 'langzaam' ? 0.85 : 1;
      u.pitch = p.pitch;
      u.rate = p.rate * tempo;
      u.onend = finish;
      u.onerror = finish;
      synth.speak(u);
      // Chrome-bug: lange spraak stopt soms; iOS: soms geen onend
    } catch (e) {
      finish();
    }
  });
}

/** Meerdere zinnen na elkaar; breekt af bij stop(). */
export async function sayAll(lines, who) {
  const my = token;
  for (const l of lines) {
    if (my !== token) return false;
    await say(l, who);
  }
  return my === token;
}

export function stop() {
  token++;
  if (synth) {
    try { synth.cancel(); } catch (e) { /* negeren */ }
  }
  hideCaption();
}

export const currentToken = () => token;

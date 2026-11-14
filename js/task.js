// De opdracht-runner: opdrachtscherm, uitleg, hulpladder en beloning.

import { h, sleep, TEST } from './util.js';
import * as speech from './speech.js';
import { sfx } from './sfx.js';
import * as A from './art.js';
import { T } from './data.js';
import { sparkleOn, wiggle, confetti, handTap } from './ui.js';
import { GAMES } from './games/index.js';

const PRAISE = ['Goed zo, {naam}!', 'Super!', 'Knap hoor!', 'Wat goed!', 'Hoera!', 'Jij bent slim, {naam}!', 'Fantastisch!', 'Wauw!'];
const SMALL_PRAISE = ['Ja!', 'Goed!', 'Mooi!', 'Top!', 'Ja hoor!'];
const TRY_AGAIN = ['Hmm, probeer nog eens!', 'Bijna! Nog een keer.', 'Oei, dat is hem niet. Probeer het nog eens!'];

let active = null; // huidige api (voor tests)
export const activeTask = () => active;

/**
 * Speel één opdracht.
 * def: { type, cfg, who } (cfg is al gemaakt), opts: { plek, index, total, rng }
 * Resultaat: 'done' of 'quit'.
 */
export function runTask(stageEl, def, opts) {
  return new Promise((resolve) => {
    const game = GAMES[def.type];
    const screen = h('div', { class: 'screen', style: { background: A.bg[opts.plek] || A.bg.kaart } });
    screen.innerHTML = A.decor(opts.plek);
    const area = h('div', { class: 'task-area' });
    const helper = h('div', { class: 'helper-piet', html: A.piet({ color: A.pietColor(opts.index || 0) }) });
    const oor = h('button', { class: 'corner-btn btn-oor', 'aria-label': 'Nog een keer', html: '<span class="emoji">🔊</span>' });
    const huis = h('button', { class: 'corner-btn btn-huis', 'aria-label': 'Naar de kaart', html: '<span class="emoji">🗺️</span>' });
    const prog = h('div', { class: 'task-progress' });
    if (opts.total > 1) {
      for (let i = 0; i < opts.total; i++) prog.append(h('i', { class: i < opts.index ? 'on' : i === opts.index ? 'now' : '' }));
    }
    screen.append(area, helper, oor, huis, prog);
    stageEl.replaceChildren(screen);

    let instruction = null;
    let errors = 0;
    let idle = 0;
    let level = 0; // 0 niets, 1 herhaald, 2 oplichten, 3 voorgedaan
    let hintFn = null;
    let glowEl = null;
    let finished = false;
    let speaking = false;
    let lastTry = 0;
    let demoBusy = false;
    const cleanups = [];
    const runCleanups = () => { cleanups.splice(0).forEach((f) => { try { f(); } catch (e) { /* negeren */ } }); };

    const clearGlow = () => { if (glowEl) { glowEl.classList.remove('hint-glow'); glowEl = null; } };

    const api = {
      root: area,
      rng: opts.rng,
      plek: opts.plek,
      helper,
      T,
      async say(text, who = def.who || 'piet') {
        speaking = true;
        await speech.say(text, who);
        speaking = false;
        idle = 0;
      },
      async instruct(text, who) {
        instruction = { text, who: who || def.who || 'piet' };
        await api.say(text, instruction.who);
      },
      touch() { idle = 0; },
      hint(fn) { hintFn = fn; },
      cleanup(fn) { cleanups.push(fn); },
      good(el, opts2 = {}) {
        idle = 0; level = Math.min(level, 1); clearGlow();
        sfx.good();
        if (el) sparkleOn(el, 7);
        if (opts2.say !== false && !speaking && Math.random() < 0.35) speech.say(T(opts.rng.pick(SMALL_PRAISE)), 'piet');
      },
      bad(el) {
        idle = 0; errors++;
        sfx.wrong();
        wiggle(el);
        if (performance.now() - lastTry > 4000) {
          lastTry = performance.now();
          speech.say(T(opts.rng.pick(TRY_AGAIN)), 'piet');
        }
        if (errors >= 4) escalate(3);
        else if (errors >= 2) escalate(2);
      },
      async done() {
        if (finished) return;
        finished = true;
        clearInterval(timer);
        clearGlow();
        runCleanups();
        active = null;
        sfx.party();
        confetti(60);
        helper.classList.add('cheer');
        await speech.say(T(opts.rng.pick(PRAISE)), 'piet');
        await sleep(600);
        resolve('done');
      },
      get finished() { return finished; },
    };
    active = api;

    async function escalate(to) {
      if (finished || demoBusy) return;
      if (to <= level && to !== 3) return;
      level = Math.max(level, to);
      if (to === 1) {
        if (instruction) api.say(instruction.text, instruction.who);
      } else if (to === 2) {
        const hnt = hintFn && hintFn();
        if (hnt && hnt.el) { clearGlow(); glowEl = hnt.el; glowEl.classList.add('hint-glow'); }
        if (instruction && !speaking) api.say(instruction.text, instruction.who);
      } else if (to === 3) {
        const hnt = hintFn && hintFn();
        if (!hnt) return;
        demoBusy = true;
        clearGlow();
        await speech.say(T('Kijk, ik doe het even voor!'), 'piet');
        if (hnt.demo) await hnt.demo();
        else if (hnt.el) { await handTap(hnt.el); hnt.el.click(); }
        demoBusy = false;
        errors = 0; idle = 0; level = 0;
      }
    }

    // hulpladder op tijd
    const timer = setInterval(() => {
      if (finished || speaking || demoBusy) return;
      idle++;
      if (idle === 15) escalate(1);
      else if (idle === 30) escalate(2);
      else if (idle >= 60) { idle = 0; escalate(3); }
    }, TEST ? 100000 : 1000);

    area.addEventListener('pointerdown', () => { idle = 0; }, true);

    oor.addEventListener('click', () => {
      sfx.tap();
      speech.stop();
      if (instruction) api.say(instruction.text, instruction.who);
    });
    huis.addEventListener('click', () => {
      sfx.tap();
      if (finished) return;
      finished = true;
      clearInterval(timer);
      runCleanups();
      speech.stop();
      active = null;
      resolve('quit');
    });

    // start het spel
    try {
      game(api, def.cfg);
    } catch (e) {
      console.error('Opdracht faalde', def, e);
      // faalveilig: een kapotte opdracht telt als gedaan
      api.done();
    }

    // voor tests: alles in één keer oplossen
    api.autoSolve = async () => {
      for (let i = 0; i < 80 && !finished; i++) {
        const hnt = hintFn && hintFn();
        if (!hnt) { await sleep(20); continue; }
        if (hnt.demo) await hnt.demo(); else if (hnt.el) hnt.el.click();
        await sleep(20);
      }
    };
  });
}

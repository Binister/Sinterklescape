// Opstarten van Sinterklescape.

import { fitStage, h, TEST } from './util.js';
import * as store from './store.js';
import * as speech from './speech.js';
import { holdButton } from './ui.js';
import { openParent } from './parent.js';
import { startScreen } from './screens.js';
import * as round from './round.js';
import { activeTask } from './task.js';

async function boot() {
  store.load();
  await store.loadPhotos();
  speech.init();
  fitStage();
  window.addEventListener('resize', fitStage);
  window.addEventListener('orientationchange', () => setTimeout(fitStage, 300));
  // geen contextmenu / zoom-gebaren in het spel
  document.addEventListener('contextmenu', (e) => { if (!e.target.closest('.parent') && !e.target.closest('.cert-img')) e.preventDefault(); });
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());

  // ouder-tandwiel: 3 seconden vasthouden
  const gear = h('button', { class: 'btn-gear', 'aria-label': 'Ouder-instellingen (3 seconden vasthouden)', style: { position: 'fixed', right: 'max(8px, env(safe-area-inset-right))', bottom: 'max(8px, env(safe-area-inset-bottom))' } }, h('span', { class: 'ring' }), '⚙️');
  document.body.append(gear);
  holdButton(gear, TEST ? 10 : 3000, () => openParent({ onClose: () => startScreen() }), gear.querySelector('.ring'));

  if (!store.get().ingesteld) {
    openParent({ firstRun: true, onClose: () => { round.current(); startScreen(); } });
  } else {
    document.body.classList.add('game');
    round.current();
    startScreen();
  }

  if ('serviceWorker' in navigator && !TEST && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // voor tests
  window.__sk = { store, round, activeTask };
}

boot();

// Oorkonde "Officiële Hulppiet" als afbeelding (canvas → PNG data-URL).

import * as store from './store.js';
import { kind, TEKENS, teken } from './data.js';

const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
const FONT = 'ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif';

function loadImg(src) {
  return new Promise((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => resolve(null);
    i.src = src;
  });
}

function datumTekst(iso) {
  const d = iso ? new Date(iso + 'T12:00:00') : new Date();
  return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function makeCertificate({ datum, small } = {}) {
  const W = small ? 800 : 1600, H = small ? 565 : 1130;
  const k = W / 1600;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.scale(k, k);

  // achtergrond
  const grad = g.createLinearGradient(0, 0, 0, 1130);
  grad.addColorStop(0, '#fff8e8'); grad.addColorStop(1, '#f6e3bf');
  g.fillStyle = grad; g.fillRect(0, 0, 1600, 1130);
  g.strokeStyle = '#c8102e'; g.lineWidth = 34; g.strokeRect(30, 30, 1540, 1070);
  g.strokeStyle = '#f2b632'; g.lineWidth = 10; g.strokeRect(70, 70, 1460, 990);
  // hoekjes
  g.font = `70px ${EMOJI}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  [[130, 130], [1470, 130], [130, 1000], [1470, 1000]].forEach(([x, y]) => g.fillText('⭐', x, y));

  g.fillStyle = '#7a1018';
  g.font = `900 64px ${FONT}`;
  g.fillText('OORKONDE', 800, 170);
  g.fillStyle = '#c8102e';
  g.font = `900 104px ${FONT}`;
  g.fillText('Officiële Hulppiet', 800, 285);

  // foto
  const kd = kind();
  const url = kd.fotoId ? store.photo(kd.fotoId) : null;
  const cx = 800, cy = 520, r = 150;
  g.save();
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.closePath();
  g.fillStyle = '#ffe9c7'; g.fill();
  g.clip();
  if (url) {
    const img = await loadImg(url);
    if (img) g.drawImage(img, cx - r, cy - r, r * 2, r * 2);
  } else {
    g.font = `190px ${EMOJI}`;
    g.fillText('🧒', cx, cy + 10);
  }
  g.restore();
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2);
  g.lineWidth = 14; g.strokeStyle = '#f2b632'; g.stroke();
  // teken
  g.beginPath(); g.arc(cx + 120, cy + 110, 50, 0, Math.PI * 2); g.fillStyle = '#fff'; g.fill();
  g.font = `64px ${EMOJI}`;
  g.fillText((TEKENS[teken()] || TEKENS.ster).e, cx + 120, cy + 114);

  // naam
  g.fillStyle = '#2b1d14';
  g.font = `900 96px ${FONT}`;
  const naam = (store.get().kind.naam || 'Lieve helper').trim();
  g.fillText(naam, 800, 750);
  g.font = `500 40px ${FONT}`;
  g.fillStyle = '#5a4030';
  g.fillText('heeft Sinterklaas en de pieten geholpen', 800, 830);
  g.fillText('om pakjesavond te redden!', 800, 882);

  // datum + handtekening
  g.font = `500 34px ${FONT}`;
  g.textAlign = 'left';
  g.fillText(datumTekst(datum), 170, 960);
  g.textAlign = 'right';
  g.font = `italic 600 56px "Snell Roundhand", "Brush Script MT", cursive`;
  g.fillStyle = '#1d2b53';
  g.fillText('Sinterklaas', 1280, 950);
  g.beginPath(); g.moveTo(1000, 975); g.lineTo(1290, 975); g.lineWidth = 3; g.strokeStyle = '#1d2b53'; g.stroke();

  // stempel
  g.save();
  g.translate(1400, 900);
  g.rotate(-0.2);
  g.beginPath(); g.arc(0, 0, 90, 0, Math.PI * 2); g.fillStyle = 'rgba(200,16,46,.85)'; g.fill();
  g.beginPath(); g.arc(0, 0, 74, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = '#fff'; g.stroke();
  g.textAlign = 'center';
  g.fillStyle = '#fff';
  g.font = `900 26px ${FONT}`;
  g.fillText('ECHT', 0, -34);
  g.font = `60px ${EMOJI}`;
  g.fillText('🎁', 0, 14);
  g.font = `900 22px ${FONT}`;
  g.fillText('SINT', 0, 56);
  g.restore();

  return c.toDataURL('image/png');
}

// Genereert print/kaartjes.html met QR-codes (eenmalig; heeft het npm-pakket "qrcode" nodig).
// Gebruik: npm i qrcode && node tools/gen-kaartjes.mjs
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';

const KAARTEN = [
  { plek: 'De stoomboot', symbool: 'vis', e: '🐟', tekst: 'Een kaartje van de boot' },
  { plek: 'Het pakhuis', symbool: 'ster', e: '⭐', tekst: 'Het verloren verlanglijstje' },
  { plek: 'De bakkerij', symbool: 'hart', e: '❤️', tekst: 'Het recept van de pepernoten' },
  { plek: 'De stal', symbool: 'maan', e: '🌙', tekst: 'Het gouden hoefijzer' },
  { plek: 'De werkkamer van Sint', symbool: 'kroon', e: '👑', tekst: 'Een bladzijde uit het Grote Boek' },
  { plek: 'De pietenschool', symbool: 'raket', e: '🚀', tekst: 'Een stukje van de routekaart' },
];

const cards = [];
for (const k of KAARTEN) {
  const svg = await QRCode.toString('SINTERKLESCAPE:' + k.symbool, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#2b1d14', light: '#ffffff' } });
  cards.push(`<div class="kaart">
    <div class="titel">${k.tekst}</div>
    <div class="midden"><div class="qr">${svg}</div><div class="sym">${k.e}</div></div>
    <div class="voet">Voor de ouder: verstop dit kaartje vóór je kind naar <b>${k.plek.toLowerCase()}</b> gaat.</div>
  </div>`);
}

writeFileSync('print/kaartjes.html', `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sinterklescape kaartjes</title>
<style>
  @page { size: A4; margin: 10mm; }
  * { box-sizing: border-box; }
  body { font-family: ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif; margin: 0; background: #f6efe3; color: #2b1d14; }
  .uitleg { max-width: 190mm; margin: 12px auto; background: #fff; padding: 14px 18px; border-radius: 12px; }
  .uitleg button { font-size: 18px; padding: 10px 18px; border-radius: 10px; border: none; background: #c8102e; color: #fff; }
  .vel { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; width: 190mm; margin: 0 auto; }
  .kaart { border: 3px dashed #c8102e; border-radius: 6mm; padding: 5mm; background: #fff8e8; height: 88mm; display: flex; flex-direction: column; break-inside: avoid; }
  .titel { font-weight: 900; font-size: 15pt; text-align: center; color: #7a1018; }
  .midden { flex: 1; display: flex; align-items: center; justify-content: space-around; }
  .qr { width: 46mm; height: 46mm; } .qr svg { width: 100%; height: 100%; }
  .sym { font-size: 44pt; font-family: "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif; }
  .voet { font-size: 8.5pt; color: #6b5a4a; text-align: center; }
  @media print { .uitleg { display: none; } body { background: #fff; } }
</style></head><body>
<div class="uitleg">
  <h2>✨ Extra magie: verstopte kaartjes</h2>
  <p>Print dit vel, knip de kaartjes uit en verstop ze in huis (niet te moeilijk: op ooghoogte van je kind). Zet in de ouder-instellingen "Extra magie" aan. Op elke plek komt dan één opdracht waarin je kind een kaartje zoekt en het scant met de camera. Lukt scannen niet, dan kiest je kind het symbool van het kaartje uit vier plaatjes.</p>
  <button onclick="print()">🖨️ Printen</button>
</div>
<div class="vel">
${cards.join('\n')}
</div>
</body></html>
`);
console.log('print/kaartjes.html gemaakt');

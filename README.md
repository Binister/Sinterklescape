# Sinterklescape 🎁

Een sinterklaas-speurtocht voor kinderen van 4 tot 6 jaar. Het kind speelt zelfstandig op een iPad (liggend). De app praat met de ingebouwde Nederlandse stem van de iPad, dus het kind hoeft niet te kunnen lezen.

**Verhaal:** pakjesavond is in gevaar! Sint heeft zes dingen nodig. Het kind kiest op een kaart een plek (stoomboot, pakhuis, pepernotenbakkerij, stal, werkkamer van Sint, pietenschool), doet daar 7 opdrachten en verdient zo een voorwerp. Zijn alle 6 voorwerpen binnen, dan volgt de finale over de daken en een oorkonde "Officiële Hulppiet". Een ronde duurt 2 à 3 uur. Daarna kan een nieuwe ronde beginnen, met een ander verhaal en andere opdrachten.

Zie [SPEC.md](SPEC.md) voor de volledige specificatie.

## Spelen

1. Open de site in **Safari** op de iPad.
2. Tik op het deel-icoon › **Zet op beginscherm**. Het spel opent dan schermvullend en werkt daarna ook zonder internet.
3. De eerste keer opent de ouder-instellingen: vul de naam in, en eventueel foto's, familie en favorieten.
4. Later opnieuw naar de instellingen: houd het **tandwiel rechtsonder 3 seconden** ingedrukt.

Tips:
- Download een verbeterde Nederlandse stem: Instellingen › Toegankelijkheid › Gesproken materiaal › Stemmen › Nederlands.
- Met **Begeleide toegang** (Instellingen › Toegankelijkheid) blijft je kind in het spel.
- **Extra magie:** print `print/kaartjes.html`, verstop de kaartjes in huis en zet "Extra magie" aan in de instellingen.

Alles (namen, foto's, voortgang) blijft alleen op de iPad. Er is geen server en er worden geen gegevens verstuurd.

## Publiceren via GitHub Pages

1. Zorg dat de repository openbaar is.
2. GitHub › Settings › Pages › *Deploy from a branch*, kies de branch en map `/ (root)`.
3. Na een minuutje staat het spel op `https://<gebruiker>.github.io/<repo>/`.

## Ontwikkelen

Statische site zonder build-stap: HTML, CSS en JavaScript-modules.

```bash
python3 -m http.server 8000        # open http://localhost:8000
# ?test=1 achter de URL: geen spraak, korte wachttijden (voor automatische tests)
```

Na het wijzigen van bestanden de offline-cache bijwerken:

```bash
node tools/gen-sw.mjs              # schrijft sw.js met de lijst van alle bestanden
```

De QR-kaartjes opnieuw maken (alleen nodig als de symbolen veranderen):

```bash
npm i qrcode && node tools/gen-kaartjes.mjs
```

### Structuur

| Pad | Inhoud |
|---|---|
| `js/main.js` | opstarten, ouder-tandwiel |
| `js/screens.js` | start, intro, kaart, plekken, finale, oorkonde, plakboek |
| `js/task.js` | opdrachtscherm, uitleg, hulpladder (herhalen → oplichten → voordoen) |
| `js/games/` | de speltypes (zoekplaat, sorteren, tellen, memory, kiezen, puzzel, doolhof, aankleden, versieren, en de echte-wereld-opdrachten) |
| `js/content.js` | plekken, de voorraad opdrachten, rijmpjes en verhalen |
| `js/round.js` | rondes samenstellen, voortgang, herspeelbaarheid |
| `js/data.js` | dingen met uitspraak, favorieten, tekens, familie |
| `js/art.js` | alle SVG-tekeningen |
| `js/parent.js` | ouder-instellingen |
| `js/speech.js`, `js/sfx.js` | stem en geluidseffecten (Web Audio, zonder geluidsbestanden) |
| `print/kaartjes.html` | printbare QR-kaartjes |

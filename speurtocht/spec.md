# Spec — Sinterklaas-speurtocht "Het Grote Boek"

*Concept v0.1 · 14 november 2026 · getoetst aan [constitution.md](constitution.md)*

## 1. Samenvatting

Een buitenspeurtocht voor een groepje van 3–8 kinderen van 4–6 jaar, van 45–60 minuten. Eén ouder regisseert met de eigen telefoon (staand). Een ander gezin kan het spel zelf klaarzetten: de app is voor iedereen gelijk, alleen route, plekken en beloning zijn eigen.

**Verhaal.** De hoofdpiet belt in paniek: een storm heeft de bladzijden van het Grote Boek door de buurt geblazen. Daarin staat wie er lief is geweest, de route over de daken, en de geheime code van de pakjeskist. Zonder die bladzijden kan pakjesavond niet doorgaan. Sint schrijft in **toverinkt**, die alleen zichtbaar wordt met de **Pieten-lezer**: de app die de hoofdpiet op de telefoon "installeert".

**Spellus.**
1. De app toont een foto van de volgende plek.
2. Warm/koud leidt de groep ernaartoe.
3. De kinderen vinden een geprinte bladzijde en scannen hem.
4. Ze herstellen samen de stormschade in de app.
5. De toverinkt toont een geheim symbool.
6. De bladzijde gaat in het (echte) Grote Boek.

**Finale.** De kinderen leggen de bladzijden op volgorde. Samen vormen ze één tekening, en de symbolen staan dan op een rij. Ze voeren de code in en "versturen" die naar de hoofdpiet. Die opent de pakjeskist, meldt in een filmpje dat het feest gered is, en onthult waar de beloning ligt.

## 2. Gebruikers en context

| | |
|---|---|
| Spelers | 3–8 kinderen van 4–6 jaar; ze kunnen niet lezen |
| Regisseur | 1 ouder, houdt de telefoon vast; kinderen bedienen hem om de beurt even |
| Apparaat | De eigen smartphone van de ouder, staand. Primair iPhone met Safari, ook Android met Chrome. |
| Plek | Buiten: buurt, park, speeltuin. Winter: koud, mogelijk schemer of donker, mogelijk nat. |
| Moment | Een willekeurige dag in de sinterklaastijd (niet per se pakjesavond) |
| Duur | 45–60 minuten: 6 stations × ±7 minuten plus start en finale |
| Beloning | Door de ouder te kiezen (zak snoep, klein cadeautje); de app noemt het "de zak" |

## 3. Wat er geprint wordt

Het printvel wordt **per spel** gemaakt (de symbolen zijn willekeurig), op A4.

| Onderdeel | Aantal | Inhoud |
|---|---|---|
| **Startbrief** (optioneel) | 1 | Brief van de hoofdpiet, met een QR-code "start". De ouder legt hem bijvoorbeeld bij de voordeur; wie hem scant, laat de telefoon overgaan. |
| **Bladzijden** | 4–8 (standaard 6) | Formaat A6 staand, 4 per A4. Elke bladzijde heeft: een **strook van de panoramatekening** (Sint op Ozosnel over de daken, bij de pakjeskist); het **nummer in stippen** (•, ••, …) in een hoek; een **QR-code**; een **leeg toverinkt-vlak** met glinsterrand. Het symbool staat *niet* op papier. |
| **Kaft van het Grote Boek** | 1 | Rood met gouden kruis, om een mapje of envelop te vouwen |
| **Pietenpasjes** (optioneel) | 8 | Elk met een plek voor naam of tekening, en 2 vakjes voor een heldensticker |

De **QR-inhoud** is `SKS:<spel-id>:<n>` (en `SKS:<spel-id>:start`). Bladzijden van een ander spel worden herkend en vriendelijk geweigerd ("Deze bladzijde hoort bij een ander boek!").

De **panoramatekening** is één brede SVG die de app in N gelijke stroken knipt. Op volgorde gelegd sluiten de stroken naadloos aan. De tekening is zo ontworpen dat de volgorde ook zonder stippen te raden is (het paard loopt over de naden).

## 4. Klaarzetten (ouder)

Doel: ongeveer 15 minuten plus het verstoppen, één keer de route lopen.

1. **Welkom en uitleg:** wat het spel is, wat je nodig hebt (printer, mapje, beloning, eventueel stickers), en veiligheidstips ("verstop niets aan de overkant van een straat of bij water").
2. **Aantal bladzijden kiezen:** 4–8, standaard 6. Er komt een schatting van de speeltijd bij.
3. **Printen:** de app maakt het printvel (startbrief, bladzijden, kaft, pasjes). Je kunt opnieuw printen.
4. **De route lopen.** Per bladzijde, in volgorde:
   - verstop de bladzijde;
   - tik "Hier ligt bladzijde n": de app slaat de GPS-locatie op (met nauwkeurigheid; de app wacht kort op een goede fix);
   - **maak een foto van de plek** (optioneel maar aanbevolen; zonder foto toont de app een tekening "ergens hier in de buurt");
   - optioneel: verplaatsen of opnieuw vastleggen.
5. **De beloningsplek:** leg de zak neer, tik "Hier ligt de zak", en maak een foto.
6. **Klaar:** een overzicht met een getekende routekaart (de opgeslagen punten), en de keuze "Nu spelen" of "Later spelen".

Opslag: `localStorage` (instellingen, punten) en IndexedDB (plekfoto's), alleen op dit toestel. "Nieuw spel" wist alles.

## 5. Spelverloop

### 5.1 Startscherm (ouder)
Een groot "Start de speurtocht". Een korte uitleg van het ouder-menu verschijnt de eerste keer ("tik het gouden mijtertje rechtsboven voor het menu"). Deze tik ontgrendelt audio en wake lock.

### 5.2 Het telefoontje
- Er verschijnt een belscherm in iOS-stijl: "Hoofdpiet belt…", met een beltoon en trillen. Een kind neemt op door de groene knop te vegen.
- Het gesprek (audio, met een belscherm-timer en een golfvorm) duurt ongeveer 60 seconden. Het probleem wordt uitgelegd: de storm, het Grote Boek, de toverinkt. Daarna "installeer ik de Pieten-lezer op deze telefoon".
- De installatie-animatie (app-icoon, voortgangsring, "ding") opent de Pieten-lezer.
- Met de startbrief begint het spel door de QR-code op de brief te scannen, die het telefoontje start.

### 5.3 De Pieten-lezer: hoofdscherm
- Bovenaan het **Grote Boek:** N lege bladzijde-sleuven, die zich vullen met wat gevonden is.
- In het midden de **volgende opdracht:** een foto van de plek (of tekening), met "Waar is dit?" (gesproken).
- Onderaan de **warm/koud-meter** en een grote knop **📷 Lezen** (de scanner).
- Een **mini-routekaart** (getekend uit de GPS-punten) toont de gevonden stukken in goud.

### 5.4 Onderweg: warm/koud
Afstand tot het volgende punt, gladgestreken over enkele metingen:

| Zone | Afstand | Feedback |
|---|---|---|
| Koud | > 150 m | IJsblauwe meter, langzame "tik" om de 3 s |
| Lauw | 60–150 m | Meter loopt op, tik om de 1,5 s |
| Warm | 25–60 m | Oranje, snellere piepjes, korte trilling |
| Heet | < 25 m | Rood-goud gloeiend, snelle piepjes; de hoofdpiet: "Hier ergens! Zoek maar!" |

- Bij een slechte nauwkeurigheid (> 50 m) toont de meter "zoeken…" en blijft hij op de laatste zone.
- Zonder GPS, of als het geweigerd is, is er geen meter, alleen de foto.
- Na 4 minuten zonder vondst geeft de hoofdpiet een hint ("Kijk eens goed bij de foto!").
- Geluid en trillen zijn uit te zetten in het ouder-menu.

### 5.5 Gevonden: scannen
- Een kind tikt op "Lezen". De camera opent schermvullend met een gouden zoekkader. De zaklampknop staat aan als het donker is.
- Bij de **juiste bladzijde:** "ding", trillen, en de bladzijde vliegt uit het kader naar het midden.
- Bij een **andere bladzijde van dit spel** (vooruit gelopen): "Die hoort later! Bewaar hem maar goed." De bladzijde telt wel; de volgorde is vrij, de foto-aanwijzing is alleen een advies.
- Bij een **bladzijde uit een ander spel:** een vriendelijke weigering.
- **Vangnet:** de ouder kiest in het menu "Bladzijde n gevonden", als de camera faalt of de QR nat of kapot is.

### 5.6 Herstellen: de stormschade
Elke bladzijde is anders beschadigd. Het herstel is een **groepsactie:** iedereen helpt mee of telt mee. Na het herstel gloeit de toverinkt en verschijnt het symbool.

| # | Schade | Interactie | Vangnet |
|---|---|---|---|
| 1 | **Modder** | Met vingers modder wegvegen (de kinderen om de beurt een veeg) | Na 20 s gaat het vanzelf |
| 2 | **Nat** | Samen **droogblazen** in de microfoon (alleen volume) | Geen microfoon → wrijven over het scherm |
| 3 | **Zand of sneeuw** | De telefoon **voorzichtig schudden** (bewegingssensor) | Geen sensor of toestemming → tikken op de zandkorrels |
| 4 | **Gescheurd** | Twee helften naar elkaar **schuiven**, met een magnetische klik | — |
| 5 | **Vervaagd** | **Zaklamp** aan, en de telefoon even stil houden ("belichten", met een aftelring) | Geen zaklamp → 3 s de knop vasthouden |
| 6 | **Opgerold** | Met een veeg **ontrollen** | — |
| 7–8 | Bij 7 of 8 bladzijden komen modder en nat terug in een andere variant (bladeren of plas) | | |

De volgorde van de schade wordt per spel geschud.

Feedback: elk type heeft eigen geluiden (smurrie, blazen, ritselen, klik, zoem, papier) en haptiek. Bij het herstel zegt de hoofdpiet een kort verhaalzinnetje uit de bladzijde, bijvoorbeeld: "Hier staat: alle kinderen in deze straat zijn héél lief geweest!", of "Hier staat een stukje van de route over de daken!".

### 5.7 De bladzijde in het boek
- Het symbool verschijnt groot en wordt uitgesproken ("Een… ster!").
- De bladzijde vliegt naar het Grote Boek bovenin, en de routekaart kleurt een stukje goud.
- De hoofdpiet: "Stop de echte bladzijde in jullie Grote Boek!"
- Wie de bladzijde vond, is de held van dit station. De app zegt dat zonder naam ("Wie heeft hem gevonden? Wat knap!"). Met pietenpasjes geeft de ouder een sticker; de app noemt geen stickers.
- Daarna komt de volgende foto. Bij de volgende vraagt de hoofdpiet: "Kunnen de kinderen die nog niks gevonden hebben deze keer als eerste zoeken?"

### 5.8 Finale: de code
1. Als alle bladzijden binnen zijn, juicht de hoofdpiet: "Het Grote Boek is compleet!".
2. Een uitleg: "Leg de bladzijden op de grond, op volgorde van de stippen. Zie je de tekening?"
3. Het **codescherm:** N lege vakjes en een toetsenbord met de symbolen die in dit spel gebruikt zijn (plus 2 afleiders). De kinderen tikken om de beurt een symbool, van links naar rechts.
4. Bij een **foute code:** krakende verbinding. "Hmm, Piet ontvangt een verkeerde code. Liggen de bladzijden wel op volgorde van de stippen?" Na 2 fouten licht het volgende goede symbool zachtjes op.
5. Bij de **goede code:** een grote knop **"Verstuur naar Piet"**, met een verzend-animatie (balk, "tuut-tuut", "Verbinding met de pakjeskist…").
6. **Filmpje van de hoofdpiet** (`hoofdpiet-finale.mp4`): hij ontvangt de code, de kist gaat open, en het feest is gered. Hij bedankt de "speurpieten" voor het zoeken, lezen, herstellen en kraken, en zegt dat hij als dank een zak heeft achtergelaten bij…
7. **De laatste plek:** de foto van de beloningsplek en warm/koud. Gevonden bevestigt de ouder via "Gevonden!" of het menu.
8. **Slotscherm:** confetti, het complete Grote Boek, de volledige routekaart in goud, en "Dankzij jullie gaat pakjesavond door!". De knop "Nog eens beluisteren" speelt het filmpje opnieuw af.

## 6. Ouder-menu

Een klein, zichtbaar maar onopvallend knopje rechtsboven (een gouden mijter). Het opent een iOS-achtig bottom sheet:
- **Herhaal** wat de hoofdpiet net zei.
- **Bladzijde n gevonden** (handmatig, als vangnet).
- **Overslaan / vorige stap.**
- **Toon de route:** kaart met alle punten en de huidige positie.
- **Geluid, trillen en warm/koud** aan of uit.
- **Hint** ("Zeg waar het ligt"): de hoofdpiet geeft een extra aanwijzing.
- **Stoppen / opnieuw beginnen.**

## 7. Audio en video

Placeholders worden gegenereerd met edge-tts (stem nl-NL, met een hogere pitch voor de hoofdpiet) en kunnen 1-op-1 vervangen worden. Formaat: mp3, mono, 44,1 kHz. De effecten (beltoon, piepjes, klikken, ruis, blazen) worden live gesynthetiseerd met Web Audio.

| Bestand | Inhoud (concept) |
|---|---|
| `hp-gesprek.mp3` | Het telefoontje (~60 s): paniek, storm, Grote Boek, toverinkt, "ik installeer de Pieten-lezer" |
| `hp-lezer-klaar.mp3` | "De Pieten-lezer is klaar! Kijk, hier zie je waar de eerste bladzijde ligt." |
| `hp-waar-1..3.mp3` | Varianten van "Waar is dit? Weten jullie deze plek?" |
| `hp-heet-1..3.mp3` | "Hier ergens! Zoek maar goed!" |
| `hp-hint-1..2.mp3` | "Kijk nog eens goed naar de foto…" |
| `hp-gevonden-1..3.mp3` | "Wie heeft hem gevonden? Wat knap! Laat de Pieten-lezer er eens naar kijken." |
| `hp-later.mp3` | "Die hoort pas later! Bewaar hem goed." |
| `hp-ander-boek.mp3` | "Deze bladzijde hoort bij een ander boek!" |
| `hp-schade-modder.mp3` … `-nat`, `-zand`, `-scheur`, `-vaag`, `-rol` | Uitleg van de schade en wat iedereen moet doen |
| `hp-hersteld-1..3.mp3` | "Jaaa! De toverinkt komt terug!" |
| `hp-zin-lief.mp3`, `hp-zin-route.mp3`, `hp-zin-code.mp3`, … | Verhaalzinnetjes "Hier staat…" |
| `hp-symbool-<naam>.mp3` | "Een… ster!" (per symbool) |
| `hp-in-boek.mp3` | "Stop de echte bladzijde in jullie Grote Boek!" |
| `hp-eerlijk.mp3` | "Kunnen de kinderen die nog niks gevonden hebben nu als eerste zoeken?" |
| `hp-compleet.mp3` | "Het Grote Boek is compleet! Leg de bladzijden op volgorde van de stippen…" |
| `hp-code-fout.mp3` | "Hmm, verkeerde code. Liggen de bladzijden op volgorde?" |
| `hp-code-goed.mp3` | "Die code klopt! Druk snel op versturen!" |
| `hp-slot.mp3` | "Dankzij jullie gaat pakjesavond door!" |
| `hoofdpiet-finale.mp4` | Filmpje, 20–40 s, staand 9:16, H.264, < 20 MB. Placeholder: geanimeerd stilstaand beeld met `hp-finale.mp3` eronder. |

Het script van alle teksten komt in `speurtocht/script.md`, inclusief een videoprompt en script voor de hoofdpiet (roetveegpiet, eigen personage, niet herkenbaar als een bestaande tv-hoofdpiet).

## 8. Vormgeving

- **Kleuren:** Sinterklaasrood `#C8102E`, diep rood `#7A1018`, goud `#F2B632`, crème en wit. Donkere achtergrond voor het belscherm en de camera. Hoog contrast.
- **iOS-gevoel:** systeemfont (SF Pro Rounded via `ui-rounded`), bottom sheets, veer-animaties (spring easing), schermovergangen met "push" en "zoom", haptische feedback via `navigator.vibrate` waar beschikbaar (op iOS bestaat dat niet; daar komt de feedback uit geluid en beeld).
- **Details:** glinsters op de toverinkt, de gouden routekaart, bladzijden die naar het boek fladderen, een beltoon die op een echte iPhone lijkt maar het niet is, een golfvorm tijdens het gesprek, een vonkje bij elke tik.
- Er is altijd beweging: geen enkel scherm staat langer dan ongeveer 3 seconden helemaal stil.
- Tekeningen: dezelfde stijl als de bestaande app (`js/art.js`: Sint, piet, Ozosnel, Grote Boek), aangevuld met de panorama en de toverinkt.

## 9. Techniek

- Locatie: `speurtocht/` in deze repo, met een eigen `index.html`, manifest en service worker (scope `speurtocht/`). Hergebruik van `js/art.js` en de geluidsaanpak waar zinvol.
- Geen build-stap. ES-modules. QR scannen met `vendor/jsQR.js`; QR genereren in de browser met een klein meegeleverd script (voor het printvel).
- **GPS:** `navigator.geolocation.watchPosition` (hoge nauwkeurigheid) alleen tijdens het zoeken; haversine-afstand; mediaan over de laatste 3–5 metingen.
- **Sensoren:** `DeviceMotionEvent` (op iOS met `requestPermission` binnen een tik); microfoon alleen voor volume.
- **Audio:** Web Audio, alle buffers worden bij de start gedecodeerd (zoals in goodiebag); wake lock; zoom en pull-to-refresh zijn geblokkeerd.
- **Printen:** een printvriendelijke HTML-pagina via `window.print()`.

## 10. Acceptatiecriteria

1. Een ouder zonder voorkennis zet het spel binnen 15 minuten klaar (plus het verstoppen) en speelt het daarna zonder uitleg.
2. De volledige flow werkt in vliegtuigmodus na het eerste laden (behalve het eerste GPS-signaal, dat ook zonder data werkt).
3. Geen enkele stap vereist lezen door kinderen.
4. Elke stap is via het ouder-menu over te slaan. Zonder GPS, camera, microfoon of bewegingssensor is het spel volledig uit te spelen.
5. De geprinte bladzijden vormen op volgorde één doorlopende tekening, en de stippen kloppen.
6. Een foute code geeft hulp en nooit een doodlopende weg.
7. Er worden geen namen of foto's van kinderen gevraagd of opgeslagen. "Nieuw spel" wist alle klaarzet-gegevens.
8. Het scherm gaat tijdens het spel niet op slot.
9. Alle audio en video zijn vervangbaar door bestanden met dezelfde naam.
10. Totale speelduur met 6 bladzijden: 45–60 minuten (getest met een proefroute).

## 11. Open punten

1. **Toverinkt en herstelacties:** de richting staat, maar de gebruiker twijfelt nog. Toetsen bij de takenfase: houden, schrappen of vereenvoudigen.
2. **Pietenpasjes:** optioneel (B), en het spel moet net zo goed werken zonder (C).
3. **Panoramatekening:** één tekening voor 4–8 stroken, of een eigen tekening per aantal?
4. **Filmpje van de hoofdpiet:** wie maakt het, met welke tool? (Advies: video zonder spraak via Veo of Sora, met een losse audio-opname, of een avatar-tool zoals HeyGen.)
5. **Startbrief:** hoe laat je de kinderen hem "vinden" (in de brievenbus, bij de deur)?

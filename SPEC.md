# Sinterklescape – Specificatie

Versie 0.3 · 14 november 2026 · status: gebouwd

## 1. Samenvatting

Sinterklescape is een webapp in de vorm van een escaperoom of speurtocht ter ere van Sinterklaas, voor kinderen van 4 tot 6 jaar. Het kind speelt **zelfstandig** op een eigen iPad. De app praat, legt uit en helpt, dus er is geen leeswerk. Eén ronde duurt **2 tot 3 uur** (verspreid over meerdere sessies). Daarna kan het spel opnieuw gespeeld worden, met een **merkbaar andere ervaring**. Het spel is sterk **gepersonaliseerd** met de naam, foto's, familie en favorieten van het kind.

**Verhaal:** pakjesavond is in gevaar! Sint heeft voor de tocht over de daken 6 dingen nodig, die verspreid liggen over 6 plekken. Het kind kiest op een kaart zelf waar het heen gaat, lost opdrachten op en verzamelt de voorwerpen. Zijn ze alle 6 verzameld, dan volgt de finale.

## 2. Uitgangspunten

| Onderwerp | Besluit |
|---|---|
| Spelers | 1 kind per iPad, zelfstandig. De ouder richt het spel in en helpt alleen af en toe. |
| Leeftijd | 4–6 jaar, één niveau gericht op 5 jaar |
| Platform | Primair iPad (Safari, en als app op het beginscherm), **liggend vast** (staand toont "draai je iPad") |
| Stem | De ingebouwde spraak van de iPad (`speechSynthesis`, nl-NL) spreekt alle teksten uit. Er is geen leeswerk voor het kind. |
| Opbouw | Een kaart met 6 plekken in vrije volgorde, plus een finale |
| Duur | 2–3 uur per ronde: 6 plekken × 7 opdrachten × 3–4 minuten |
| Herspelen | Elke ronde een ander probleem, andere opdrachten uit een voorraad, en geschudde inhoud |
| Personalisatie | Kind (naam, foto), familie en huisdieren (naam, foto), favorieten (gekozen uit plaatjes) |
| Echte wereld | Opdrachten in huis die het kind zelf bevestigt, foto's maken, zingen, en optioneel verstopte QR-kaartjes |
| Camera | QR-codes scannen en foto's maken **zonder beoordeling**. Geen herkenning van kleur of inhoud. |
| Microfoon | Alleen volume ("Sint hoort je zingen"), niet wat er gezegd wordt |
| Speeltijd | Geen limiet, de ouder bewaakt dat zelf |
| Pieten | Roetveegpieten |
| Beeld | Eigen SVG-illustraties voor personages, gebouwen en hoofdvoorwerpen (platte prentenboekstijl); kleine voorwerpen zijn emoji (op de iPad hoogwaardig en direct herkenbaar). Foto's van de familie worden erin verwerkt. |
| Privacy | Alles (ook foto's) blijft lokaal op de iPad. Geen server, accounts, tracking, reclame of aankopen. |

## 3. Harde eisen voor elke opdracht

Elke opdracht moet aan alle drie de eisen voldoen. Wat er niet aan voldoet, gaat niet in het spel.

1. **Cognitief haalbaar:** een gemiddelde 4-jarige kan het met hooguit één hint. Tellen tot maximaal 6, hooguit 4 keuzes tegelijk, en geen letters of woorden lezen.
2. **Technisch eenvoudig:** maximaal één soort handeling per opdracht (tikken, óf slepen, óf scannen, …). Geen precisie nodig, en geen multitouch of vegen in een specifieke richting.
3. **Faalveilig:** de opdracht kan nooit vastlopen. Elke techniek die kan falen (camera, microfoon, spraak) heeft een vangnet waarmee de opdracht alsnog te voltooien is.

## 4. Ontwerpregels voor zelfstandig spelen

1. **Alles wordt uitgesproken.** Elke instructie spreekt de app automatisch uit zodra het scherm verschijnt. Een grote **oor-knop** (luidspreker) herhaalt de instructie.
2. **Geen fouten-straf.** Een fout antwoord geeft een vriendelijk wiebeltje en "Hmm, probeer nog eens!". Er zijn geen levens, geen tijdsdruk en geen game-over.
3. **Hulpladder bij vastlopen:**
   - na 15 seconden zonder actie, of bij de 1e fout: de instructie wordt herhaald;
   - na 30 seconden, of bij de 2e fout: het goede antwoord licht zachtjes op;
   - na 60 seconden, of bij de 4e fout: een piet "doet het voor" (animatie van de oplossing), waarna het kind het nadoet.
   - Daardoor kan elke opdracht altijd voltooid worden.
4. **Grote raakvlakken:** alles wat het kind moet aantikken is minimaal 72×72 pt, met ruimte ertussen.
5. **Eén ding tegelijk.** Op het scherm staan alleen de opdracht, de oor-knop, een "terug naar de kaart"-knop en een klein ouder-tandwiel.
6. **Slepen is vergevingsgezind:** ruime "magneet"-zones, en een voorwerp dat naast het doel wordt losgelaten veert terug.
7. **Beloning na elke opdracht:** sterretjes, een belletje en een gesproken compliment (wisselend, vaak met de naam van het kind).
8. **Voortgang zonder tekst:** op de kaart is per plek te zien hoeveel opdrachten klaar zijn (bolletjes), en welke voorwerpen al verzameld zijn (een balk onderaan).
9. **Altijd te onderbreken:** het spel onthoudt elke voltooide opdracht. Na sluiten ga je verder op de kaart.

## 5. Personalisatie

### 5.1 Wat de ouder invult (ouder-instellingen)
| Gegeven | Invoer | Gebruik |
|---|---|---|
| Naam van het kind | tekst | aanspreken, pakjes, oorkonde |
| Uitspraak van de naam | optionele schrijfwijze voor de stem (bijvoorbeeld "Sjoerd" → "Sjoert") | als de iPad de naam verkeerd uitspreekt; met een knop "test de uitspraak" |
| Foto van het kind | camera of fotobibliotheek, met een bijsnijcirkel | piet-gezicht, puzzels, memory, Grote Boek, oorkonde |
| Familie en huisdieren | 0–8 personen: naam, uitspraak, foto, en de rol (papa, mama, broer, zus, opa, oma, huisdier, anders) | pakjes sorteren, memory, "voor wie is dit?", bezorgen in de finale |
| Favorieten | gekozen uit plaatjes: kleur (8), dier (12), eten (12), speelgoed (12) | zinnen van Sint, kleur van pakjes, versieringen, rijmpjes en zoekplaten |
| Teken | gekozen uit 8 symbolen (ster, maan, hart, bloem, vis, raket, kroon, appel) | herkenning zonder te lezen: eigen pakje, eigen schoen, eigen huis |

Alles is optioneel, behalve de naam. Zonder foto's of familie gebruikt het spel getekende vervangers (een piet-gezicht, verzonnen familie), en het blijft volledig speelbaar.

### 5.2 Voorbeelden van personalisatie in het spel
- "Hallo **Noor**! Sint heeft in zijn Grote Boek gelezen dat jij van **dino's** houdt!"
- In het pakhuis: "Dit pakje is voor… **oma**!" (foto van oma op het label), en het kind sleept het naar oma.
- Een puzzel van de foto van het kind met een pietenmuts op.
- Memory met de gezichten van de familie.
- In de bakkerij: pepernoten in de vorm van het **lievelingsdier**.
- In de finale bezorgt het kind de pakjes bij de huizen van de familie, en op de oorkonde staan de foto en het teken van het kind.

## 6. Schermen en flow

```
Eerste keer:   Ouder-instellingen (profiel, familie, favorieten, toestemmingen) → Intro-filmpje
Daarna:        Start ("Tik op Sint") → Kaart
Kaart:         kies plek → Plek-intro → 7 opdrachten (met feestje ertussen) → voorwerp verzameld → Kaart
Alle 6 binnen: Finale (de daken) → Oorkonde → "Nog een avontuur?" → nieuwe ronde
```

### 6.1 Start
De iPad staat pas geluid toe na een eerste tik, dus het startscherm vraagt altijd eerst "Tik op Sint!". Sint zwaait en begroet het kind bij naam.

### 6.2 Intro (eerste keer per ronde)
Een korte animatie van ongeveer 45 seconden waarin Sint het probleem van deze ronde vertelt en de 6 lege vakjes voor de voorwerpen laat zien.

### 6.3 Kaart
- Een geïllustreerd dorp met 6 plekken als grote, tikbare plaatjes.
- Per plek: 7 bolletjes voor de voortgang, en het voorwerp dat er te halen is (grijs tot het verzameld is).
- Onderaan: een balk met de 6 voorwerpen.
- Zijn alle 6 voorwerpen verzameld, dan gaan de daken glinsteren en roept Sint "We kunnen gaan!".
- Een plek met alle opdrachten gedaan krijgt een vlaggetje; er opnieuw heen gaan mag, voor een "bonusopdracht".

### 6.4 Opdrachtscherm
Het scherm toont de opdracht, met daarbij een oor-knop (linksboven, groot), de knop "terug naar de kaart" (huisje, rechtsboven), het ouder-tandwiel (klein, in een hoek), en een helper-piet die rechtsonder af en toe reageert.

### 6.5 Ouder-instellingen
- Te openen door het tandwiel 3 seconden ingedrukt te houden.
- Onderdelen:
  - profiel, familie en favorieten (zie 5.1);
  - toestemmingen voor camera en microfoon (met een testknop);
  - een stemtest, met de tip om de verbeterde Nederlandse stem te downloaden;
  - extra magie (QR-kaartjes) aan of uit, met een link naar de printpagina;
  - geluidseffecten aan of uit, en het spreektempo (langzaam of normaal);
  - voortgang: overzicht, een opdracht overslaan, een nieuwe ronde starten, alles wissen.

## 7. Plekken en voorwerpen

| Plek | Waarom nodig voor pakjesavond | Voorwerp |
|---|---|---|
| De stoomboot | Alle spullen moeten aan wal | de kist met cadeaus |
| Het pakhuis | Cadeaus moeten bij de juiste persoon komen | de pakjeszak |
| De pepernotenbakkerij | Er moet gestrooid worden | de pepernoten |
| De stal | Het paard moet sterk zijn voor de daken | het zadel |
| De werkkamer van Sint | Sint moet weten wie lief was, en gedichten schrijven | het Grote Boek |
| De pietenschool | Pieten moeten leren klimmen en de weg vinden | de routekaart |
| **Finale: de daken** | Alles komt samen | — |

## 8. Speltypes

Opdrachten worden gebouwd uit herbruikbare speltypes, die elk met wisselende inhoud gevuld worden.

| # | Speltype | Handeling | Cognitief | Faalrisico en vangnet |
|---|---|---|---|---|
| T1 | **Zoekplaat** | tikken | 4–6 voorwerpen vinden in een plaat; gevonden voorwerpen vliegen naar een teller | geen |
| T2 | **Sorteren** | slepen | 2–4 bakken, elk met een foto, kleur of symbool | geen |
| T3 | **Tellen** | slepen | 1–6 voorwerpen in een bak; het getal staat erop als stippen; bij te veel springt er één terug | geen |
| T4 | **Memory** | tikken | 3–4 paren (6–8 kaartjes) | geen |
| T5 | **Puzzel** | slepen | 4 of 6 stukjes, met de omtrek als hulp op de achtergrond, stukjes alleen in de goede stand | geen |
| T6 | **Wat hoort er niet bij?** | tikken | 4 plaatjes, waarvan er één duidelijk anders is | geen |
| T7 | **Doolhof** | tikken op het vakje naast de figuur | raster van maximaal 4×4, één route, hooguit 2 doodlopende stukken | geen |
| T8 | **Patroon afmaken** | tikken (1 uit 3) | AB- of ABC-patroon van kleuren of vormen | geen |
| T9 | **Rijmpje** | tikken (1 uit 3) | de stem spreekt een rijmpje uit, het kind kiest het plaatje van het rijmwoord | geen |
| T10 | **Aankleden / inpakken** | slepen | 3–4 onderdelen op een vaste plek | geen |
| T11 | **Versieren** | tikken (kleur kiezen, dan vlak tikken) | vrij, en altijd goed; klaar met een "klaar!"-knop | geen |
| T12 | **Schaduw zoeken** | tikken (1 uit 3–4) | welk silhouet hoort bij dit voorwerp? | geen |
| R1 | **Zoek in huis** | zelf bevestigen (duim) | "Zoek iets wat net zo rood is als de mantel van Sint" | geen (eerlijkheidssysteem) |
| R2 | **Foto voor Sint** | camera | "Maak een foto van je schoen", altijd goed; de foto komt terug in het Grote Boek en in de finale | camera geweigerd of kapot → opdracht wordt vervangen door een tekening-variant (T11) |
| R3 | **Zingen of roepen** | microfoon (alleen volume) | "Zing een liedje voor het paard!" De balk loopt vol met geluid | geen microfoon, of na 15 seconden → een "klaar!"-knop verschijnt |
| R4 | **QR-kaartje zoeken** (extra magie) | camera | de ouder heeft een kaartje verstopt, het kind scant het | knop "lukt het niet?" → 4 symbolen, kies het symbool van het kaartje; als extra magie uit staat, verschijnt deze opdracht niet |
| R5 | **Bewegen** | zelf bevestigen | "Spring 5 keer als het paard!" De stem telt mee | geen |

**Verdeling per ronde:** van de 42 opdrachten zijn er ongeveer 30–32 op het scherm (T1–T12) en 10–12 in de echte wereld (R1–R5), met maximaal 2 echte-wereld-opdrachten per plek.

## 9. Opdrachten per plek (voorraad)

Elke plek heeft een voorraad van ongeveer 10 opdrachten; per ronde worden er 7 gekozen. **Vast** betekent: elke ronde aanwezig (de kern van het verhaal van die plek).

**De stoomboot** (kist met cadeaus)
1. *Vast* · T7 de boot door de haven naar de kade sturen
2. T3 kisten tellen die van boord moeten
3. T5 puzzel van de stoomboot
4. T2 bagage sorteren: van Sint, van de pieten, of van het paard
5. T6 wat hoort er niet bij in de kist?
6. T12 welke schaduw hoort bij de stoomboot?
7. T1 zoek de verdwenen touwen
8. R3 toeter van de boot: "Roep heel hard 'Sinterklaas'!"
9. R5 zwaai naar de boot (5 keer)
10. T8 patroon van vlaggetjes

**Het pakhuis** (pakjeszak)
1. *Vast* · T2 pakjes sorteren naar familieleden (foto's)
2. T1 weggewaaide verlanglijstjes zoeken
3. T10 een pakje inpakken (papier in de lievelingskleur, strik, label met teken)
4. T3 pakjes in de zak tellen
5. T6 wat hoort er niet bij (een sok tussen de cadeaus)
6. T12 schaduw van een cadeau
7. R1 zoek iets in huis dat in een pakje zou passen
8. T11 pakpapier versieren
9. R4 *extra magie:* het verloren verlanglijstje
10. T4 memory met cadeaus

**De pepernotenbakkerij** (pepernoten)
1. *Vast* · T6/T2 de juiste ingrediënten in de kom (en geen sokken!)
2. T3 pepernoten in zakjes tellen
3. T11 speculaaspop versieren
4. T8 patroon van koekjes op de bakplaat
5. T12 schaduw van een chocoladeletter
6. T1 verdwaalde pepernoten in de bakkerij zoeken
7. R3 zing een liedje terwijl de oven bakt
8. T5 puzzel van de bakkerspiet
9. R4 *extra magie:* het weggewaaide recept
10. T9 rijmpje over eten

**De stal** (zadel)
1. *Vast* · T3 wortels voor het paard tellen
2. T1 hoefijzers zoeken in het stro
3. T10 het paard opzadelen
4. R2 maak een foto van je schoen (voor de wortel)
5. T4 memory met familiefoto's
6. T12 schaduw van het paard
7. R5 galoppeer als het paard door de kamer
8. T11 de deken van het paard versieren
9. T6 wat eet een paard niet?
10. T7 doolhof naar het paard

**De werkkamer van Sint** (het Grote Boek)
1. *Vast* · Sint leest voor uit het Grote Boek (favorieten en familie), en het kind tikt de bijpassende plaatjes aan
2. T9 rijmpjes afmaken voor de gedichten
3. T4 memory met familiefoto's
4. T10 Sint aankleden (mijter, staf, mantel, ring)
5. T5 puzzel: foto van het kind als piet
6. T1 zoek de bril van Sint
7. R1 zoek iets wat net zo rood is als de mantel van Sint
8. R2 maak een foto van iets wat jij lief vindt, voor het Grote Boek
9. T6 wat hoort niet bij Sint?
10. R4 *extra magie:* de verloren bladzijde

**De pietenschool** (routekaart)
1. *Vast* · T7 doolhof over de daken
2. T2 "welk huis is van jou?" (huizen met het teken)
3. T8 patroon van dakpannen
4. T10 een piet aankleden (met de foto van het kind als gezicht)
5. R5 klimles: 5 keer hoog springen
6. R3 zing het pietenlied voor het diploma
7. T12 schaduw van een schoorsteen
8. T3 schoorstenen tellen
9. T1 zoek de verstopte pieten
10. R4 *extra magie:* de verstopte routekaart

**Finale: de daken** (circa 10 minuten, altijd hetzelfde verloop, met geschudde inhoud)
1. Het paard over de daken leiden (T7, iets groter)
2. Bij elk familielid het juiste pakje door de schoorsteen gooien (T2, met foto's)
3. De schoorsteen met de eigen schoen vinden (teken)
4. Confetti, Sint bedankt het kind bij naam, en een diashow van de gemaakte foto's van deze ronde
5. **Oorkonde** "Officiële Hulppiet", met foto, naam, teken en datum; een knop om op te slaan in Foto's (voor de ouder)

## 10. Herspeelbaarheid

| Laag | Hoe het verschilt per ronde |
|---|---|
| Probleem | Per ronde een ander verhaal: R1 "de grote storm", R2 "de pakjesboot is lek", R3 "het paard is weggelopen". Het probleem bepaalt de intro, de zinnen van Sint en welke plek het "spannendste" is. |
| Opdrachten | 7 van de ~10 per plek, waarbij opdrachten uit de vorige ronde voorrang krijgen om níet te verschijnen |
| Inhoud | Andere voorwerpen in zoekplaten, andere aantallen, andere familieleden, andere puzzelfoto's, andere rijmpjes, andere doolhoven |
| Volgorde | Opdrachten binnen een plek in willekeurige volgorde (behalve de vaste) |
| Teksten | Elke zin heeft 2–4 varianten |
| Herinnering | Sint verwijst naar de vorige ronde ("Vorige keer hielp je met de storm. Nu is de boot lek!") |
| Verzameling | Een "plakboek" met de oorkondes en foto's van alle gespeelde rondes |

## 11. Geluid en stem

- **Spraak:** `speechSynthesis` met een Nederlandse stem (bij voorkeur een verbeterde stem). Per personage kunnen toonhoogte en tempo iets verschillen (Sint lager en langzaam, Piet hoger en vrolijk).
- **Vangnet bij de spraak:** als er geen Nederlandse stem is of spraak faalt, toont het scherm een duidelijk plaatje-instructie (een animatie die laat zien wat er moet gebeuren), en blijft de tekst zichtbaar voor de ouder.
- **iPad-beperking:** spraak en geluid starten pas na de eerste tik (vandaar het startscherm "Tik op Sint").
- **Effecten:** tik, feestje, probeer-nog-eens, hoefgetrappel, scheepstoeter, oven-ping, confetti, camera-klik. Er is geen achtergrondmuziek, omdat die door de stem heen zou praten.

## 12. Techniek

| Onderdeel | Keuze |
|---|---|
| Opbouw | Statische site: HTML, CSS en JavaScript (ES-modules), zonder framework en zonder build-stap |
| Hosting | GitHub Pages (de repo moet openbaar zijn) |
| Installeren | PWA, schermvullend, "Zet op beginscherm" in Safari |
| Offline | Een service worker slaat alle bestanden op na het eerste bezoek |
| Opslag | Instellingen en voortgang in `localStorage`; foto's (verkleind tot ±400 px) in IndexedDB |
| QR | `jsQR` (lokaal meegeleverd, werkt offline) via `getUserMedia` |
| Microfoon | `getUserMedia` + `AudioContext` analyser, alleen volume |
| Invoer | Pointer events; geen hover |
| iPad-details | Geen zoom, geen scroll-stuiter, `safe-area-inset`, staand en liggend, geen tekstselectie of contextmenu bij lang indrukken |

**Opslag-model (vereenvoudigd):**
```json
{
  "kind": { "naam": "Noor", "uitspraak": null, "fotoId": "f1", "teken": "ster",
            "favorieten": { "kleur": "paars", "dier": "dino", "eten": "pannenkoek", "speelgoed": "trein" } },
  "familie": [ { "naam": "Oma", "rol": "oma", "fotoId": "f2" } ],
  "ronde": { "nummer": 1, "probleem": "storm", "seed": 4821,
             "plekken": { "pakhuis": { "opdrachten": ["pakhuis-1", "pakhuis-4", "…"], "klaar": 3 } },
             "voorwerpen": ["pakjeszak"], "fotos": ["f7"] },
  "geschiedenis": [ { "ronde": 1, "datum": "2026-11-28", "opdrachten": ["…"] } ],
  "instellingen": { "geluid": true, "extraMagie": false, "spreektempo": "normaal" }
}
```

## 13. Acceptatiecriteria

- Een kind dat niet kan lezen, kan elke opdracht starten, begrijpen en voltooien zonder hulp van een volwassene.
- Geen enkele opdracht kan vastlopen: met camera en microfoon geweigerd, zonder spraak en zonder foto's blijft het spel volledig uit te spelen.
- Na hooguit 60 seconden vastzitten doet een piet de oplossing voor.
- Een volledige ronde duurt voor een 5-jarige 2–3 uur.
- Een tweede ronde heeft een ander probleem, en minstens 2 van de 7 opdrachten per plek zijn anders dan in de eerste ronde.
- Na één keer online openen werkt het spel in vliegtuigmodus (behalve het eerste QR- of camera-toestemmingsverzoek, dat ook offline werkt).
- Na het sluiten van de app blijven profiel, foto's en voortgang bewaard.
- Een kind kan de ouder-instellingen niet per ongeluk openen.

## 14. Planning

| Mijlpaal | Inhoud | Klaar rond |
|---|---|---|
| M1 | Basis: ouder-instellingen (profiel, foto's, familie, favorieten), stem, kaart, opdrachtscherm, hulpladder, opslag, offline. Plekken **pakhuis** en **stal**. Speltypes T1, T2, T3, T4, T10, R1, R2, R5. | 22 november |
| M2 | Plekken **bakkerij** en **werkkamer**. Speltypes T5, T6, T9, T11, T12, R3. | 27 november |
| M3 | Plekken **stoomboot** en **pietenschool**. Speltypes T7, T8, R4 + printpagina QR-kaartjes. | 1 december |
| M4 | Finale, oorkonde, nieuwe ronde (problemen 2 en 3), plakboek | 3 december |

Na M1 kan het kind al spelen. Nieuwe plekken "verschijnen" daarna op de kaart. De finale wordt pas mogelijk in M4. Tot die tijd zegt Sint bij 6 voorwerpen (of minder, zolang er nog plekken in aanbouw zijn): "Bijna! Nog even wachten op de rest."

## 15. Besluiten na v0.2

- **Paard:** heet Ozosnel (één constante in `js/data.js`, makkelijk aan te passen).
- **Oriëntatie:** liggend vast.
- **Voorraad:** 66 opdrachten, waarvan 6 extra-magie-kaartjes (één per plek; symbolen: stoomboot 🐟, pakhuis ⭐, bakkerij ❤️, stal 🌙, werkkamer 👑, pietenschool 🚀).
- **Foto-opdrachten** gebruiken de systeemcamera (`<input capture>`), dat is op iPad betrouwbaarder dan een live-camerabeeld. QR-scannen gebruikt het live-camerabeeld met `jsQR`.
- **Geluidseffecten** worden gesynthetiseerd (Web Audio), er zijn geen geluidsbestanden.

## 16. Open punten

1. Testen op een echte iPad met de echte kinderen: tempo, moeilijkheid, stemkwaliteit.
2. Rijmpjes (T9) eventueel aanvullen of vervangen.

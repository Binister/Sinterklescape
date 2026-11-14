# Sinterklescape – Specificatie

Versie 0.1 · 14 november 2026 · status: concept

## 1. Samenvatting

Sinterklescape is een webapp in de vorm van een escaperoom of speurtocht ter ere van Sinterklaas, voor kinderen van 4 tot 6 jaar. Eén kind speelt op een eigen iPad, samen met een ouder die voorleest en als spelleider optreedt. Het spel bestaat uit 4 hoofdstukken die de ouder in de weken voor pakjesavond vrijgeeft, met de finale op 5 december.

**Verhaal:** de wind heeft in het pakhuis van Sint alles door elkaar geblazen. Pakjesavond is in gevaar! Het kind helpt Sint en de pieten om alles op tijd klaar te krijgen. Elke opdracht is iets wat écht moet gebeuren voor pakjesavond.

## 2. Uitgangspunten

| Onderwerp | Besluit |
|---|---|
| Spelers | 1 kind per apparaat + ouder als spelleider. Broertjes en zusjes spelen elk op hun eigen iPad. |
| Leeftijd | 4–6 jaar, één niveau gericht op 5 jaar |
| Platform | Primair iPad (Safari, ook als app op het beginscherm), staand en liggend. Werkt ook op Android-tablets en telefoons. |
| Lezen | Het kind hoeft niet te kunnen lezen. Teksten zijn voor de ouder om voor te lezen; optioneel een ingesproken audiobestand per tekst. |
| Echte wereld | Lichte opdrachten zonder voorbereiding; de ouder bevestigt met een gelukt-knop. Optionele "extra magie"-modus met geprinte kaartjes. |
| Geen | Camera, microfoon, accounts, server, reclame, aankopen in de app, tracking |
| Pieten | Roetveegpieten |
| Toon | Spannend maar nooit eng. Geen boeven, niets gaat echt kapot, het kind kan niet "verliezen". |
| Beeld | Eigen SVG-illustraties in een platte, vrolijke prentenboekstijl |
| Privacy | Naam en weetjes worden alleen lokaal op het apparaat opgeslagen |

## 3. Ontwerpregels voor 4–6 jaar

1. **Geen fouten-straf.** Een fout antwoord geeft een vriendelijk wiebel-animatietje en een "Hmm, probeer nog eens!"-geluid. Er zijn geen levens, geen tijdsdruk en geen game-over.
2. **Hulp vanzelf.** Na 2 foute pogingen, of na 20 seconden zonder actie, licht het goede antwoord zachtjes op (pulsen).
3. **Grote raakvlakken.** Alles wat het kind moet aantikken is minimaal 64×64 pt, met ruimte ertussen.
4. **Eén ding tegelijk.** Per scherm één opdracht, zonder afleidende knoppen. De enige vaste knoppen zijn "verder" (groot) en het ouder-tandwiel (klein, in een hoek).
5. **Slepen is vergevingsgezind.** Een sleepdoel heeft een ruime "magneet"-zone. Loslaten naast het doel laat het voorwerp terugveren.
6. **Symbolen in plaats van woorden.** Het kind kiest bij de start een eigen teken (bijvoorbeeld ster, maan of hart). Dat teken staat op zijn pakje, zijn schoen en zijn huis, zodat het kind "zichzelf" herkent zonder te lezen.
7. **Beloning na elke opdracht:** een kort feestje met sterretjes en een belletje. Na elk hoofdstuk krijgt het kind een stempel in het Grote Boek (voortgang zichtbaar).
8. **Korte sessies:** een hoofdstuk duurt 5 tot 10 minuten, met 3 à 4 opdrachten.

## 4. Schermen en flow

```
Eerste keer:  Welkom → Ouder-instellingen (profiel) → Startscherm
Daarna:       Startscherm (Grote Boek met 4 hoofdstukken)
                 → Hoofdstuk-intro (bericht van Sint)
                 → Opdracht 1 … n (met feestje ertussen)
                 → Hoofdstuk-afsluiting (stempel + "zet je schoen!")
                 → terug naar Startscherm
Hoofdstuk 4:  … → Finale (confetti) → Oorkonde
```

### 4.1 Startscherm
- Het Grote Boek, open, met 4 hoofdstukken als grote plaatjes.
- Een hoofdstuk heeft één van drie toestanden: **op slot** (hangslotje, niet aan te tikken, kind hoort "Nog even geduld…"), **open** (glinstert), of **klaar** (met stempel).
- Gespeelde hoofdstukken kunnen opnieuw gespeeld worden.

### 4.2 Ouder-hoek
- Bereikbaar via een klein tandwiel rechtsboven. **Ouder-vergrendeling:** het tandwiel 3 seconden ingedrukt houden (met een vullende cirkel als voortgang).
- Onderdelen:
  - **Profiel:** naam van het kind, 0 tot 3 weetjes (vrije tekst, max. 60 tekens per weetje), en het teken van het kind.
  - **Hoofdstukken:** per hoofdstuk een schakelaar voor op slot of open, plus "markeer als niet gespeeld".
  - **Extra magie:** schakelaar aan of uit, en een link naar de printpagina met kaartjes.
  - **Geluid:** effecten aan of uit.
  - **Alles wissen:** begin opnieuw (met bevestiging).
- Bij de eerste keer opent de ouder-hoek automatisch op het profiel.

### 4.3 Berichtscherm (verhaal)
- Een illustratie (Sint, piet of paard) met daaronder een "brief" met grote tekst (minimaal 22 pt), om voor te lezen.
- Als er een audiobestand voor deze tekst is, verschijnt er een luidsprekerknop, die het bestand ook automatisch één keer afspeelt.
- Een grote knop "Verder" (pijl, geen tekst nodig).

### 4.4 Echte-wereld-opdracht
- Een illustratie van de opdracht en tekst voor de ouder.
- Onderaan de knop **"Gelukt!"** voor de ouder: 1,5 seconden ingedrukt houden. Zo kan het kind hem niet per ongeluk aantikken, en het blijft voor de ouder makkelijk.

### 4.5 Extra-magie-opdracht
- Alleen als extra magie aan staat; anders wordt de gewone variant van die opdracht gespeeld.
- Verhaal: er is iets "naar jullie huis gewaaid". Het kind zoekt het verstopte kaartje.
- Op het kaartje staat een groot symbool. Het kind tikt in de app het overeenkomende symbool aan, uit 4 keuzes. Een fout symbool geeft de gewone "probeer nog eens"-reactie.
- **Printpagina:** een aparte pagina met 4 kaartjes op A4 (één per hoofdstuk), met een illustratie, het symbool en een kleine instructie voor de ouder ("Verstop dit kaartje vóór hoofdstuk 2"). De symbolen staan vast per hoofdstuk.

## 5. Hoofdstukken

Teksten hieronder zijn concepten. `{naam}` = naam van het kind, `{weetje}` = een weetje uit het profiel.

### Hoofdstuk 1 · Het Grote Boek is in de war

**Intro (Sint):** "Lieve {naam}, wat een drukte! Een grote windvlaag is door mijn pakhuis geraasd. Alle verlanglijstjes zijn weggewaaid, en mijn Grote Boek ligt helemaal in de war. Wil jij mij helpen? Dan wordt het toch nog een fijne pakjesavond!"

| # | Opdracht | Interactie | Klaar wanneer |
|---|---|---|---|
| 1.1 | **Verlanglijstjes zoeken** | Zoekplaat van het pakhuis. 6 verlanglijstjes zitten verstopt (achter een kist, op een lamp, in de pakjeszak, …). Aantikken: het lijstje vliegt naar een teller bovenin (6 lege vakjes worden gevuld). | Alle 6 gevonden |
| 1.2 | **Het Grote Boek** | Het boek valt open. Sint "leest voor" wat er over het kind in staat: "In mijn Grote Boek staat dat jij {weetje}. Wat knap!" Dit gebeurt per weetje, waarbij de ouder op verder tikt. Zonder weetjes volgt een algemene tekst ("dat jij altijd zo goed helpt"). | Doorgetikt |
| 1.3 | **Echte wereld: verlanglijstje** | "Maak een tekening voor Sint van wat jij graag zou willen." | Ouder houdt Gelukt! ingedrukt |
| 1.x | *Extra magie:* | Vervangt 1.1 niet, maar komt erbij als 7e lijstje: "Oei, één lijstje is helemaal naar jouw huis gewaaid!" Symbool: **ster**. | Juiste symbool getikt |

**Afsluiting:** stempel in het boek. "Dankjewel {naam}! Zet vanavond je schoen, en vergeet niet een wortel voor mijn paard!"

### Hoofdstuk 2 · Pakjes sorteren en inpakken

**Intro (piet):** "Hoi {naam}! Ik ben Piet van het pakhuis. Nu we de lijstjes weer hebben, kunnen we de pakjes klaarmaken. Maar alles ligt door elkaar! Help je mee?"

| # | Opdracht | Interactie | Klaar wanneer |
|---|---|---|---|
| 2.1 | **Pakjes sorteren** | 4 verzonnen kinderen (plus het kind zelf), elk met een kleur en een verlanglijstje-plaatje (een bal, een pop, een trein, een boek, …). Sleep elk cadeau naar het juiste kind. Het laatste cadeau hoort bij het teken van de speler: "Kijk, dit pakje is voor jou!" | Alle cadeaus bij het juiste kind |
| 2.2 | **Inpakken** | Kies papier uit 3 kleuren → het papier vouwt zich om het pakje (één veeg over het scherm) → sleep de strik erop → sleep het naamkaartje met het eigen teken erop. 3 pakjes achter elkaar. | 3 pakjes ingepakt |
| 2.3 | **Echte wereld: iets roods** | "De rode strikken zijn op! Zoek in huis iets wat net zo rood is als de mantel van Sint." | Gelukt! |
| 2.x | *Extra magie:* | "Piet is het plakband kwijt. Het ligt vast bij jou in huis!" Symbool: **maan**. Komt vóór 2.2. | Juiste symbool getikt |

**Afsluiting:** stempel. "Wat een mooie pakjes! Morgen gaan we bakken. Zet je schoen maar weer!"

### Hoofdstuk 3 · De pepernotenbakkerij

**Intro (bakkerspiet):** "Help, {naam}! De wind heeft ook de bakkerij door elkaar gegooid. Zonder pepernoten is het geen pakjesavond! Bak je mee?"

| # | Opdracht | Interactie | Klaar wanneer |
|---|---|---|---|
| 3.1 | **Ingrediënten kiezen** | Een plank met 8 voorwerpen, waarvan 5 echte ingrediënten (bloem, bruine suiker, boter, speculaaskruiden, melk) en 3 grappige afleiders (sok, badeend, potlood). Sleep de goede naar de mengkom. Een afleider geeft een grappig geluid en veert terug. | 5 ingrediënten in de kom |
| 3.2 | **Deeg roeren** | Draai met je vinger rondjes in de kom; het deeg wordt zichtbaar bruiner, en de oven gaat aan. | ±5 rondjes |
| 3.3 | **Pepernoten verdelen** | 3 zakjes met 1, 2 en 3 stippen erop (later 3, 4 en 5). Sleep het juiste aantal pepernoten in elk zakje. Bij te veel springt er één terug. | Alle zakjes kloppen |
| 3.4 | **Echte wereld: zingen** | "De pepernoten moeten nog even in de oven. Zing samen een sinterklaasliedje!" Een oven-timer telt 60 seconden af (met tikgeluid). | Timer afgelopen + Gelukt! |
| 3.x | *Extra magie:* | "Het recept is weggewaaid… naar jouw huis!" Symbool: **hart**. Komt vóór 3.1. | Juiste symbool getikt |

**Afsluiting:** stempel. "Mmm, wat ruikt dat lekker! Nu is alles klaar voor de grote tocht. Nog één keer je schoen zetten!"

### Hoofdstuk 4 · De tocht over de daken (pakjesavond, 5 december)

**Intro (Sint):** "Lieve {naam}, het is zover! Alle pakjes liggen klaar. Vanavond rijd ik met mijn paard over de daken. Maar het is donker en de wind waait nog. Wijs jij ons de weg?"

| # | Opdracht | Interactie | Klaar wanneer |
|---|---|---|---|
| 4.1 | **Over de daken** | Een eenvoudig doolhof van daken (een raster van ongeveer 4×3). Tik op het dak naast het paard om ernaartoe te springen; schoorstenen en antennes blokkeren de weg. Er is één route, met hooguit 2 doodlopende stukken. | Paard bij het eindpunt |
| 4.2 | **De goede schoorsteen** | 4 huizen, elk met een schoen bij de schoorsteen. Eén schoen heeft het teken van het kind. Tik die aan; een piet glijdt naar beneden door de schoorsteen (komt er met roetvegen weer uit). | Juiste huis getikt |
| 4.3 | **Rijmpje afmaken** | 3 rijmpjes. De ouder leest voor, het kind kiest uit 3 plaatjes het rijmwoord. Concept: "Sint rijdt op het dak, met een hele grote… *zak*" · "Kijk, daar zit een muis, bij Sint in het… *huis*" · "Pepernoten in een zak, Piet zet ze op het… *dak*". Afleiders zijn plaatjes die niet rijmen (bal, auto, boom, …). | 3 rijmpjes goed |
| 4.x | *Extra magie:* | "Sint heeft de kaart van de daken laten vallen. Waar zou die zijn?" Symbool: **schoen**. Komt vóór 4.1. | Juiste symbool getikt |

**Finale:** confetti, alle 4 stempels lichten op in het Grote Boek, Sint zwaait. "Het is gelukt! Dankzij jou komen alle pakjes op tijd. Jij bent een echte Hulppiet!" → **Oorkonde**.

**Oorkonde:** een schermvullende oorkonde "Officiële Hulppiet", met de naam van het kind, zijn teken, de datum, en een handtekening en stempel van Sint. Er is een knop "bewaren" (voor de ouder), die de oorkonde als afbeelding opslaat via het deelmenu van de iPad.

## 6. Geluid en stem

- **Effecten** (kort, zacht): tik, feestje (belletjes), probeer-nog-eens, hoefgetrappel, ritselend papier, oven-ping, confetti. Een schakelaar in de ouder-hoek zet ze uit.
- **Geen achtergrondmuziek** (die zou door het voorlezen heen praten).
- **Ingesproken teksten (optioneel):** elke voorleestekst heeft een vaste id (bijvoorbeeld `h1-intro`, `h1-boek-1`). Een bestand `audio/h1-intro.mp3` speelt automatisch af als het bestaat. Een tekst met `{naam}` of `{weetje}` heeft een algemene variant voor de opname ("Lieve helper…"). Er komt een lijst `AUDIO.md` met alle zinnen die ingesproken kunnen worden.
- iPad-beperking: geluid mag pas afspelen na de eerste tik. Het startscherm vraagt daarom altijd eerst één tik ("Tik op het boek").

## 7. Beeld

- Eigen SVG-illustraties: platte vormen, dikke ronde lijnen, warme kleuren (rood, goud, donkerblauw voor de nacht, warm bruin voor het pakhuis).
- Figuren: Sint, 2–3 roetveegpieten (pakhuispiet, bakkerspiet), het paard (wit), het Grote Boek, pakjes, pepernoten, daken en schoorstenen.
- Animaties met CSS en SVG: wiebelen, stuiteren, vallende sterretjes, confetti. Er knippert niets, en er zijn geen snelle flitsen.
- Elk plaatje is een los bestand, zodat het later vervangen kan worden door een mooiere tekening.

## 8. Techniek

| Onderdeel | Keuze |
|---|---|
| Opbouw | Statische website: HTML, CSS en JavaScript (ES-modules), zonder framework en zonder build-stap |
| Hosting | GitHub Pages vanuit de repo (deze moet openbaar zijn) |
| Installeren | PWA: manifest, icoon, schermvullend (`display: standalone`), "Zet op beginscherm" in Safari |
| Offline | Een service worker slaat na het eerste bezoek alle bestanden op; daarna werkt alles zonder internet |
| Opslag | `localStorage`, sleutel `sinterklescape:v1` (zie hieronder) |
| Invoer | Pointer events voor tikken en slepen; geen hover-afhankelijke interactie |
| iPad-details | Geen zoom of pinch, geen scroll-stuiter, ruimte voor veilige randen (`safe-area-inset`), werkt staand en liggend, geen tekstselectie bij lang indrukken |
| Talen | Alleen Nederlands |

**Opgeslagen gegevens:**
```json
{
  "kind":   { "naam": "Noor", "weetjes": ["heeft leren fietsen"], "teken": "ster" },
  "open":   [1, 2],
  "klaar":  [1],
  "instellingen": { "geluid": true, "extraMagie": false },
  "oorkonde": { "datum": "2026-12-05" }
}
```
Als de opslag niet beschikbaar is (bijvoorbeeld in privémodus), werkt het spel gewoon door, maar onthoudt het niets. De ouder-hoek meldt dat dan.

**Mappenstructuur (voorstel):**
```
index.html  manifest.webmanifest  sw.js
css/        js/ (app, opslag, schermen, opdrachten/*)
img/        audio/        print/kaartjes.html
```

## 9. Acceptatiecriteria

- Een volledig hoofdstuk is speelbaar op een iPad in Safari, zowel staand als liggend, zonder dat het kind iets hoeft te lezen.
- Een hoofdstuk is niet te "verliezen", en bij elke opdracht verschijnt na hooguit 20 seconden niets doen een hint.
- Een kind kan de ouder-hoek, de gelukt-knop en het vrijgeven van hoofdstukken niet per ongeluk activeren.
- Na één keer online openen werkt het spel in vliegtuigmodus.
- Na het sluiten en opnieuw openen van de app blijven profiel en voortgang bewaard.
- Zonder ingevulde weetjes en zonder audiobestanden loopt elk hoofdstuk zonder lege plekken of foutmeldingen.
- Met extra magie uit verschijnen geen kaartjes-opdrachten.

## 10. Planning

| Mijlpaal | Inhoud | Klaar rond |
|---|---|---|
| M1 | Basis (startscherm, ouder-hoek, profiel, opslag, offline, berichtscherm, gelukt-knop) + hoofdstuk 1 | 20 november |
| M2 | Hoofdstuk 2 + printpagina kaartjes | 25 november |
| M3 | Hoofdstuk 3 | 29 november |
| M4 | Hoofdstuk 4 + finale + oorkonde + `AUDIO.md` | 2 december |

Na elke mijlpaal: kort testen met het kind, en daarna bijsturen.

## 11. Open punten

1. **Repo openbaar maken** voor GitHub Pages (moet de eigenaar zelf in de GitHub-instellingen doen).
2. **Rijmpjes in hoofdstuk 4** goedkeuren of vervangen (concept staat bij 4.3).
3. **Naam van het paard:** algemeen ("het paard van Sint") of een eigen naam?
4. **Tekens om uit te kiezen** voor het kind: voorstel ster, maan, hart, bloem, vis, raket.
5. **Startdatum** van hoofdstuk 1 bevestigen (de planning gaat uit van ~21 november).

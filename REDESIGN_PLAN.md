# Redesign-plan — Den Boterlaer Botanische Tuin (UI/UX only)

## 1) Scope & harde randvoorwaarden

Dit is **uitsluitend** een redesign van de **frontend-presentatielaag**.

**Mag niet veranderen / mag niet breken**
- Backend-code, databank (Prisma), migraties, API-endpoints (`/app/api/**`), auth/login flow, admin routes.
- URL-structuur (App Router routes in `app/**`).
- Bestaande flows: plantendatabase (lijst + detail), wandeling (stops + foto’s), blog, gallery/lightbox, settings ophalen, video’s, uploadcenter, admin CRUD.

**Wel veranderen**
- Layout, compositie, typografie, kleurgebruik, componenten, micro-interacties, animaties (subtiel), navigatie-ervaring.

---

## 2) Huidige codebase — snelle scan (observaties)

**Stack**
- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + Prisma.
- Globale layout: `app/layout.tsx` rendert `components/Navbar` + `components/Footer`.
- Styles: `app/globals.css` + Tailwind custom component classes (`.btn-primary`, `.card`, `.heading-*`, etc.).

**Routes (publiek)**
- `/` (homepage met video/hero + highlights-kaarten) — **exact het patroon dat je wil vermijden**.
- `/plants` (botanisch register-achtige pagina; al dichter bij herbariumgevoel, maar losstaand qua stijl)
- `/plants/[id]`
- `/wandeling` + `/wandeling/[slug]/fotos`
- `/blog` + `/blog/[slug]`
- `/gallery`
- `/contact`
- `/about`, `/bijen`, `/terracotta`

**Routes (admin)**
- `/login`
- `/admin` + secties: plants, walk, blog, videos, upload, settings (CRUD + auth-check via `/api/auth/check`)

**Belangrijke mismatch vandaag**
- Globale “kaart/gradient/knop”-taal (btn + card) is behoorlijk generiek.
- `/plants` heeft al een “eggshell / academisch register” look, maar botst met de rest (fonts, kleuren, footer, navbar).
- Diverse pagina’s hebben een klassieke hero + grid-kaarten (blog detail, homepage, terracotta, …).

---

## 3) Doelbeeld (concept): “digitale ontdekkingstocht”

**Hoofdidee**
De site voelt als een wandeling door de tuin: **paden**, **zones**, **veldnotities**, **herbariumfiches**, **labels** en **materiaaltexturen** (papier, drukinkt, aquarel).

**Anti-patronen die we expliciet vermijden**
- De standaard hero + CTA + 3 kaarten.
- SaaS-achtige secties, iconenrijen, Bootstrap feel, voorspelbare “corporate blocks”.

**Progressive enhancement**
De ervaring mag rijker worden met motion/scroll, maar:
- zonder JS moet navigatie en content altijd bruikbaar blijven;
- `prefers-reduced-motion` moet motion minimaliseren/uitschakelen;
- mobile-first (touch targets, sticky nav zonder te veel hoogte).

---

## 4) Visuele identiteit → design tokens (aanpak)

### 4.1 Kleurpalet (zoals door jou opgegeven)
We vertalen dit naar **CSS variables** + Tailwind mapping, zodat:
- we per “zone/sectie” subtiel kunnen variëren;
- we consistent blijven in contrast & theming.

**Basis**
- Bosgroen: `#1E3A2F`
- Mosgroen: `#556B2F`
- Saliegroen: `#A8BBA2`
- Crème: `#F8F5EC`
- Terracotta: `#C86B4A`
- Goud accent: `#D4AF37`

### 4.2 Typografie (premium, rustig)
Aanbevolen pairing (Google Fonts via `next/font/google`):
- **Display/Headings:** *Fraunces* of *Cormorant Garamond* (serif, botanisch/editorial)
- **Body/UI:** *Inter* of *Source Sans 3* (clean, leesbaar)

Regels:
- Headings niet “mega-bold”; liever **gewicht/letterspacing** + witruimte.
- Tekstbreedte beperken: 60–75 tekens.
- Consistente ritmes: `--space-*` tokens (zie hieronder).

### 4.3 Spacing & radius (organisch, niet “kaartjes”)
Introduceer tokens:
- `--space-1..8` (4px → 64px)
- `--radius-soft` (12–16px), `--radius-organic` (asymmetrisch via clip-path of SVG mask waar nuttig)
- `--shadow-ink` (subtiele inktachtige schaduw i.p.v. generieke drop shadow)

### 4.4 Tailwind strategie (compatibel & incrementeel)
Doel: huidige utility usage behouden, maar **nieuwe UI-taal** toevoegen zonder alles tegelijk te breken.

Plan:
1. Voeg `:root` tokens toe in `app/globals.css`.
2. Map Tailwind kleuren naar CSS vars (bv. `colors.brand.forest = "rgb(var(--c-forest) / <alpha-value>)"`).
3. Maak nieuwe component classes (`.label`, `.specimen`, `.fieldnote`, `.path-section`) naast bestaande `.card/.btn-*`.
4. Migreer pagina per pagina.

---

## 5) Component- & layout-architectuur (voor het redesign)

### 5.1 Nieuwe “design primitives” (herbruikbaar)
In `components/ui/` (of `components/v2/` als we migratie strikt willen scheiden):
- `Label` (botanisch label: titel, metadata, kleine caps)
- `DividerOrganic` (SVG divider, “pad/grondlaag”)
- `Panel` (uitklapbaar paneel i.p.v. kaarten)
- `SpecimenSheet` (herbariumfiche layout)
- `NavMarker` (kleine “wayfinding” markers)
- `TexturedBackground` (optioneel: CSS + 1–2 lichte assets, nooit zwaar)

### 5.2 Navigatie (site-breed)
Vervang de huidige klassieke topbar door een **“Field Guide”**:
- smalle, rustige header (geen “mega bar”)
- primaire navigatie als **index** (zones) + secundair als utility (contact/login)
- desktop: nav kan “in het landschap” zweven (sticky, maar minimal)
- mobile: bottom-sheet of compact drawer (duimvriendelijk)

Belangrijk: routes blijven identiek (`href`s ongewijzigd).

### 5.3 Homepage (kern): botanische kaart als navigatie
**Geen hero.**

Structuur (voorbeeld):
1. “Intro” als korte veldnoot + disclaimer (privétuin) in label-vorm.
2. **Interactieve kaart** (SVG) met zones als klikbare regio’s.
   - Elke zone linkt naar bestaande pagina’s: `/plants`, `/wandeling`, `/about`, `/blog`, `/gallery`, `/contact`, …
   - Keyboard toegankelijk: `<a>` elementen, focus states, aria-labels.
   - Fallback: onder de kaart een tekstuele zone-index.
3. Scrollpad: secties verbonden door een “pad” (SVG/gradient) dat de scroll begeleidt.

### 5.4 Plants (lijst + detail)
We behouden de sterke richting van `/plants` (register), maar brengen het in dezelfde “wereld”:
- familie-filter wordt een “catalogusfilter” (label + dropdown) i.p.v. standaard select.
- entries als **herbariumregels** + hover preview (nu al aanwezig) maar met rustiger motion.
- detailpagina als **Specimen Sheet**: links foto, rechts taxonomy + velden.

### 5.5 Wandeling
Van “stap 1/2/3” naar “route door zones”:
- bovenaan mini-map/route-indicator + huidige stop als marker.
- stopcontent in “fieldnote + foto” compositie.
- knoppen “Vorige/Volgende” als “route controls” (consistent).

### 5.6 Blog = “veldnotities / tuinjournaal”
Blog index:
- posts als notities op papier (geen standaard cards).
Blog detail:
- geen hero-banner; liever editorial header met beeld als “plaat” in de layout.

### 5.7 Footer als tuinbed-illustratie
Geen klassieke footer-grid.
Concept:
- Een horizontale “tuinbed” illustratie (SVG) waarin contact/openingsuren/links subtiel “tussen planten” staan.
- Houd het lichtgewicht: 1 inline SVG, geen zware canvassen.

---

## 6) Motion/scroll guidelines (subtiel & WCAG-proof)

**Toegankelijkheid**
- Respecteer `prefers-reduced-motion`: motion uit of tot opacity/none.
- Focus rings zichtbaar (niet weghalen), skip-link toevoegen.
- Contrast check (groen op crème kan tricky zijn).

**Motion principes**
- Parallax alleen op kleine lagen (5–20px), nooit “schokkend”.
- Geen infinite grote animaties; liever microtransities (150–250ms).
- Framer Motion enkel waar het echt iets toevoegt (bv. kaart hover/focus, section reveal).

**Performance**
- Afbeeldingen: `next/image` blijft, maar `unoptimized: true` staat aan (Raspberry Pi focus). Dus: let extra op bestandsgrootte.
- Geen grote video-hero op elke pagina.
- Lazy load voor gallery grids, video’s `preload="metadata"` (al aanwezig).

---

## 7) Gefaseerd implementatieplan (stap-voor-stap, lage risico’s)

### Fase 0 — Baseline & safety net (0.5 dag)
- Maak een “UI snapshot” checklist (screenshots) van:
  - `/`, `/plants`, `/plants/[id]`, `/wandeling`, `/wandeling/[slug]/fotos`, `/blog`, `/blog/[slug]`, `/gallery`, `/contact`, `/login`, `/admin`
- Noteer kritieke API-calls per pagina (plants, videos, settings, auth check).

### Fase 1 — Design tokens + nieuwe primitives (1–2 dagen)
- Voeg CSS vars toe in `app/globals.css`.
- Tailwind config uitbreiden met `brand` kleuren gebaseerd op vars.
- Introduceer nieuwe primitives (`Label`, `DividerOrganic`, `Panel`, `SpecimenSheet`).
- Voeg “reduced motion” helpers toe.

**Test na fase 1**
- Build + lint (`npm run build`, `npm run lint`)
- Smoke test: alle pagina’s renderen, geen runtime errors.

### Fase 2 — Navbar + Footer redesign (1–2 dagen)
- Rebuild `components/Navbar.tsx` naar “Field Guide” patroon.
- Rebuild `components/Footer.tsx` naar “tuinbed” (SVG) patroon.
- Zorg dat admin layout niet afhankelijk is van site navbar/footer (admin heeft eigen layout).

**Test na fase 2**
- Navigatie links en mobile menu (keyboard + touch)
- `/admin` blijft werken (auth check, logout)

### Fase 3 — Homepage als kaart-ervaring (2–4 dagen)
- Vervang `app/page.tsx` door:
  - kaart (SVG) + zone-links
  - scrollpad secties (geen highlight-cards)
  - CTA’s als labels/panels, niet als grote buttons in hero

**Test na fase 3**
- Keyboard navigatie op kaart
- Mobile performance + scroll smoothness

### Fase 4 — Pagina’s migreren (doorlopend)
Volgorde met laag risico → hoog impact:
1. `/blog` en `/blog/[slug]` (typografie/layout)
2. `/gallery` (grid + lightbox behouden, nieuwe framing)
3. `/contact` (form blijft identiek; enkel layout)
4. `/wandeling` (route UI; data + endpoints intact)
5. `/plants` en `/plants/[id]` (consolideren naar één stijlwereld)
6. `/about`, `/bijen`, `/terracotta` (elk een eigen “sfeer”, maar met gedeelde tokens)

### Fase 5 — Polishing (1–2 dagen)
- Consistent focus states, skip link, headings hierarchy
- Lighthouse / perf pass (afbeeldingen, CLS, lazy loading)
- WCAG quick audit (contrast, keyboard, labels)

---

## 8) Test-checklist per wijziging (minimaal, maar effectief)

**Algemeen**
- `npm run lint` en `npm run build`
- Geen console errors op key pagina’s

**Publiek**
- `/plants`: laden, filter, klik naar detail
- `/plants/[id]`: detail laadt, gerelateerde planten links werken
- `/wandeling`: volgende/vorige, season toggle, video’s laden, “meer foto’s” link
- `/wandeling/[slug]/fotos`: gallery laadt
- `/blog` en `/blog/[slug]`: content render
- `/gallery`: lightbox open/close/next/prev
- `/contact`: validatie + submit flow (ook al is het “simulated”)

**Admin**
- `/login`: login success → token in localStorage → redirect `/admin`
- `/admin/plants`: listing, filter, delete confirmation flow
- `/admin/upload`: upload flow (indien gebruikt)
- `/admin/videos`: video assignments
- `/admin/settings`: settings opslaan en terug ophalen

---

## 9) Praktische migratiestrategie (om niets te breken)

Aanpak die ik aanbeveel:
- Introduceer een “V2” stylinglaag (tokens + primitives) **naast** bestaande `.card/.btn-*`.
- Pas pagina’s één voor één aan, met kleine, reviewbare commits.
- Laat bestaande API- en data-calls exact staan; refactor alleen componentstructuur/markup.

---

## 10) Wat ik als volgende stap voorstel

Als jij akkoord bent met dit plan, is de meest logische start:
1) Fase 1 (tokens + primitives)  
2) Fase 2 (Navbar/Footer)  
3) Daarna homepage kaart-ervaring

Zeg me gerust:
- wil je dat de homepage-kaart gebaseerd is op een **echte plattegrond** (bestand/SVG dat je aanlevert), of maken we eerst een **artistieke abstracte kaart** als startpunt?


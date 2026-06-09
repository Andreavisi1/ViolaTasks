# Viola Analytics — ACF Fiorentina Match-Analysis Design System

A design system for **Viola Analytics**, a match-analysis product for a Match Analyst / Data Engineering desk, branded to **ACF Fiorentina** (the *viola*). It powers data-dense, browser-only dashboards: drop a CSV of match events and get player rankings, scorecards, and an action map on a drawn pitch. The register is *professional but warm* — competent, clear, never a toy — and bilingual-leaning Italian for product copy.

> **Context note.** This system was authored from a single brief (a one-file match-analysis dashboard in Italian) plus the official Fiorentina crest (`assets/fiorentina-crest.png`). There was no external codebase or Figma file — the brand foundations are derived from the crest (viola + giglio red), the football/match-analysis domain, and a "data engineer" tone. If you have the real product's repo or design file, share it and this can be reconciled against the source of truth.

---

## CONTENT FUNDAMENTALS — how copy is written

- **Language:** product UI is **Italian**; engineering/code chrome (column names, file names) stays in `snake_case` English as in the data contract.
- **Voice:** knowledgeable analyst talking to a smart colleague. Confident, concise, explanatory. Examples: *“Carica un CSV per iniziare l'analisi.”*, *“Nessun giocatore supera i filtri attuali.”*
- **Explain every term.** Both engineering and *calcistic* terms get a `Tooltip`/`InfoDot`. Canonical xG line: *“Gol attesi: stima dei gol dalla qualità dei tiri. «Gol − xG» dice se finalizza sopra o sotto le attese.”* The per-90 toggle explains *why*: *“confronta titolari e subentrati a parità di tempo.”*
- **Casing:** Sentence case for body and titles; **UPPERCASE micro-labels** with wide tracking for eyebrows/KPI labels (`EST. 1926`, `SEZIONE 1`). Numbers use tabular figures.
- **Person:** mostly impersonal/imperative (*“Trascina qui il CSV”*, *“Clicca una barra”*). Never chatty, never “I”.
- **Emoji:** essentially none. The crest and a single ⚽ / ⚜ are the only glyphs, and only as **easter eggs** — never decoration in the data UI.
- **Numbers:** Italian formatting (`2.070′`, thousands dot). Deltas signed (`+2.6`, `-0.9`). Percentages keep one decimal.
- **Tone test:** if a sentence sounds like a marketing landing page, rewrite it as a desk analyst would say it.

---

## VISUAL FOUNDATIONS

- **Colors.** Brand is **viola** — `--viola-700` (#4A2078) primary, `--viola-600` (#5C2D91) the official club purple, `--viola-500` the crest fill. The **giglio red** (`#E8332C`) is reserved for goals/shots/danger — *never* recolored. The **data accent** is a luminous violet `--accent-500` (#A24BE0) for key numbers/highlights. **Pitch greens** (two mowing-stripe greens + white lines) build the field. Neutrals are a cool gray with a faint violet tint. Event types have a fixed categorical palette: pass=blue, shot=giglio, tackle=amber, dribble=teal, foul=slate.
- **Type.** Display = **Space Grotesk** (sporty geometric — headings, KPI/scoreboard numerals, tight tracking). Body/UI = **Hanken Grotesk** (calm, legible). Data = **IBM Plex Mono** (tabular figures for tables, coordinates, file/column chrome). *(All three are Google Fonts stand-ins — see Caveats.)*
- **Spacing & radii.** 4px grid. Controls and cards default to `--radius-md` (10px); cards use `--radius-lg` (14px); chips/filters are pills. Control heights 30/38/46px.
- **Surfaces & cards.** Light-first. Page = `#F6F4FA`; cards = white with a **1px subtle gray border + soft shadow** (`--shadow-sm`), `--radius-lg`. The player scorecard uses a **viola header bar** (`tone="brand"`). No heavy/black shadows — all shadows are violet-tinted and low.
- **Backgrounds.** Flat, calm surfaces. The only “image” is the **drawn SVG pitch** (green mowing stripes, white lines, faint ⚜ giglio watermark at 5% opacity). No photographic hero, no gradient walls. One subtle gradient only: the accent KPI card’s faint viola wash.
- **Borders.** Hairline `--border-subtle` (#E4E0EC) for separation; `--viola-300` for brand-tinted edges; 2px dashed viola for the active dropzone.
- **Animation.** Restrained. `--dur-fast/base` with `--ease-out`; spring (`--ease-spring`) only for the switch knob and the crest press. Chart bars ease in over 450ms. The live-file dot pulses. No bounce on content, no infinite decorative loops. The ⚽ roll is the one playful flourish, user-triggered.
- **Hover/press.** Hover = slightly darker fill (primary) or `--viola-50` wash (secondary/ghost). Press = `translateY(1px) scale(.99)`. Focus = 3px viola ring (`--ring-focus`).
- **Transparency/blur.** Sparingly: overlay scrim `rgba(23,8,40,.55)`; pitch watermark; pill backgrounds. No glassmorphism.
- **Imagery vibe.** Cool, flat, confident. The pitch is the hero visual; everything else is typographic and numeric.

---

## ICONOGRAPHY

- **No icon font.** The system is deliberately glyph-light; meaning is carried by **color-coded dots** (event types), **tabular numbers**, and **text labels**, not pictograms. This matches the analyst/engineer tone.
- **Unicode used as marks, sparingly:** `↑` (upload), `▾` (select caret), `✓` (checkbox/selected), `?` (InfoDot), `⚽` and `⚜` (easter eggs only), `▼/▲` (sort).
- **Brand mark:** the **crest** (`assets/fiorentina-crest.png`, transparent PNG) is the only logo asset — used in the header lockup and brand cards. Keep ≥25% clear space; never recolor the lily or distort the lozenge.
- **If you need a proper icon set**, add **Lucide** (CDN, 1.5–2px stroke) to stay consistent with the clean geometric type — and flag it. Do not hand-draw SVG icons or use emoji in the data UI.

---

## INDEX — what's in this project

**Root**
- `styles.css` — global entry (import-only). Link this one file.
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill manifest.
- `assets/` — `fiorentina-crest.png`, `esempio_fiorentina_2024-26.csv` (sample dataset, ~9.9k events).

**Tokens** (`tokens/`, all `@import`ed by `styles.css`)
- `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `elevation.css`

**Foundation cards** (`guidelines/`, Design System tab)
- Colors: `colors-viola`, `colors-giglio-accent`, `colors-pitch`, `colors-neutrals`, `colors-events-status`
- Type: `type-display`, `type-body`, `type-data-mono`, `type-scale`
- Spacing: `spacing-scale`, `radii`, `elevation`
- Brand: `brand-crest` (click + hover easter eggs), `brand-lockup`

**Components** (`components/`, namespace `window.ViolaAnalyticsFiorentinaDesignSystem_48fef3`)
- `core/` — **Button, Badge, Card, Tooltip / InfoDot**
- `forms/` — **Select** (single/multi), **Slider**, **Switch**, **MetricSelector**
- `data/` — **KpiCard, StatTable, Dropzone, PitchMap, Legend**

**UI kit** (`ui_kits/match-analysis/`)
- `index.html` — the full working **Match Analysis Dashboard** (CSV → filters → ranking chart → scorecard → pitch map). See its `README.md`.

**Starting points:** Button, Card, Select, Slider, Dropzone, KpiCard, PitchMap, and the Match Analysis dashboard screen.

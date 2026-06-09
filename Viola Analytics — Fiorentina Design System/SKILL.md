---
name: viola-analytics-design
description: Use this skill to generate well-branded interfaces and assets for Viola Analytics — the ACF Fiorentina (viola) match-analysis product — for production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, the crest, and a React UI-kit (Button, Select, Slider, Switch, KpiCard, StatTable, PitchMap, Dropzone, Tooltip…) plus a full working match-analysis dashboard.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Fast orientation
- **Tokens / global CSS:** link `styles.css` (it `@import`s `tokens/*.css`). Author against semantic aliases: `--brand`, `--accent`, `--surface-card`, `--text-primary`, event colors `--ev-pass|shot|tackle|dribble|foul`, pitch greens `--pitch-*`.
- **Brand:** viola primary (`--viola-700`), giglio red for goals/danger (`--giglio-500`, never recolored), luminous violet accent for key numbers (`--accent-500`). Crest at `assets/fiorentina-crest.png`.
- **Type:** Space Grotesk (display/numerals), Hanken Grotesk (body), IBM Plex Mono (data/tabular). All Google-Fonts stand-ins.
- **Tone:** Italian product copy, impersonal/imperative, every technical or football term explained via `Tooltip`/`InfoDot`. Glyph-light; emoji only as subtle easter eggs (⚽ / ⚜ / EST. 1926).
- **Components:** read `*.prompt.md` next to each `.jsx`. Mount via `window.ViolaAnalyticsFiorentinaDesignSystem_48fef3` after loading `_ds_bundle.js`. Do not `<script src>` a `.jsx` directly.
- **Working reference:** `ui_kits/match-analysis/index.html` is a complete CSV→charts→pitch dashboard; `assets/esempio_fiorentina_2024-26.csv` is a ready dataset to drop into it.

## CSV data contract (match events)
`match_id, competition, season, match_date, team_id, player_id, player_name, player_minutes, minute, second, x, y, type, outcome, xg` — `type ∈ {pass,shot,tackle,dribble,foul}`, `x,y ∈ 0–100` (x:0 own goal → x:100 opponent goal), `xg` only on shots. Total minutes of a player = sum of `player_minutes` taken once per distinct match. Per-90 normalizes counts only, not percentages.

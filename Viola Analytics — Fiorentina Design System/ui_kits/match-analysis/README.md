# UI Kit — Match Analysis Dashboard

A high-fidelity, fully working recreation of the Viola Analytics match-analysis dashboard: drop a CSV of match events and the whole view recomputes live (filters, ranking chart, player scorecard, action map). Everything stays in memory — no `localStorage`, no network beyond the three CDN libraries.

## Files
- `index.html` — app shell, styling, and script wiring (entry point).
- `data.js` — `window.VAData`: CSV parsing (PapaParse), distinct-value extraction, per-player aggregation, the "minutes counted once per match" rule, per-90 normalization, and the metric registry.
- `sample.js` — `window.VASample`: a deterministic (seed `1926`) Fiorentina dataset across Serie A / Coppa Italia / Conference League and two seasons, so the dashboard renders populated by default. Also `toCsv()`.
- `sections.jsx` — `Header`, `EmptyState`, `FilterBar`, `RankingSection` (Chart.js horizontal bars), `PlayerSection` (KPI row + `PitchMap`). Exported to `window`.
- `App.jsx` — orchestrator: state, ingest, derived selectors, layout.

## Composes these design-system components
`Dropzone`, `Select` (single + multi), `Slider`, `Switch`, `MetricSelector`, `Card`, `Button`, `Badge`, `KpiCard`, `StatTable`, `PitchMap`, `Legend`, `Tooltip`/`InfoDot` — all read from `window.ViolaAnalyticsFiorentinaDesignSystem_48fef3` via `../../_ds_bundle.js`.

## External libraries (CDN only)
- React 18.3.1 + ReactDOM + Babel standalone (pinned).
- PapaParse 5.4.1 and Chart.js 4.4.1 from `cdnjs.cloudflare.com`.

## CSV contract
One row per event with columns: `match_id, competition, season, match_date, team_id, player_id, player_name, player_minutes, minute, second, x, y, type, outcome, xg`. `type ∈ {pass, shot, tackle, dribble, foul}`; `x,y ∈ 0–100` (x:0 = own goal, x:100 = opponent goal); `xg` only on shots. Malformed files surface a clear Italian error in the dropzone.

## Easter eggs (subtle, opt-in by the user)
- Click the crest → a ⚽ rolls/spins off it.
- Hover the crest → `EST. 1926` reveal in giglio red.
- A faint giglio (⚜) watermark sits under the pitch map and in the footer.

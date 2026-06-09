Headline metric tile for the player scorecard row (minuti, gol, xG, Gol−xG, % passaggi, % contrasti).

```jsx
<KpiCard label="Gol − xG" value="+2.6" delta="sopra le attese" hint={<InfoDot label="Finalizza sopra la qualità media dei suoi tiri." />} accent />
<KpiCard label="Minuti" value="2.070" unit="′" />
```

`delta` auto-colors by sign with `deltaTone="auto"`. `accent` paints the value violet on a faint viola wash.

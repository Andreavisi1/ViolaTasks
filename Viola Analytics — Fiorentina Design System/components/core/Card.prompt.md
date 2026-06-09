Panel container for every dashboard module (ranking, player card, pitch map).

```jsx
<Card eyebrow="Sezione 1" title="Classifica giocatori" actions={<Button size="sm" variant="ghost">Esporta</Button>}>
  …chart + table…
</Card>
```

`tone="brand"` swaps the header to a viola bar with white title — use it for the hero/player-card header. `pad={false}` removes inner padding for full-bleed content like the pitch map.

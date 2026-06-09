Ordered numeric table for the player ranking. Columns are declarative; pass `mono` for tabular figures, `accent` for the highlighted metric, `render` for custom cells.

```jsx
<StatTable rank rows={rows} sortKey="xg" sortDir="desc" onSort={setSort}
  columns={[
    { key: 'player_name', label: 'Giocatore', bold: true },
    { key: 'goals', label: 'Gol', align: 'right', mono: true },
    { key: 'xg', label: 'xG', align: 'right', mono: true, accent: true },
    { key: 'pass_pct', label: '% Pass', align: 'right', mono: true,
      render: (v) => `${v.toFixed(1)}%` },
  ]} />
```

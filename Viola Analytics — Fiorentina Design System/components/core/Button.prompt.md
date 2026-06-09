Action button for Viola Analytics — viola fill by default; use for the primary action in a toolbar, dialog, or filter bar.

```jsx
<Button variant="primary" size="md" onClick={run}>Ricalcola</Button>
<Button variant="secondary" iconLeft="↑">Carica CSV</Button>
<Button variant="ghost" size="sm">Reset filtri</Button>
```

Variants: `primary` (viola), `secondary` (viola outline on white), `ghost` (text), `danger` (red). Sizes `sm | md | lg`. Pass `iconLeft` / `iconRight` as nodes, `fullWidth` to stretch, `disabled` to dim.

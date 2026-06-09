Dropdown for filters populated from CSV values. Single by default, `multi` for checkbox menus (Competizione, Stagione, Squadra).

```jsx
<Select label="Competizione" multi options={competitions}
  value={selComp} onChange={setSelComp} placeholder="Tutte" />
<Select label="Giocatore" options={players} value={player} onChange={setPlayer} />
```

Options accept plain strings or `{ value, label }`. Multi reports "n selezionate".

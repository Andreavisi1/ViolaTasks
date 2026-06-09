Drawn football pitch. Plots events by `x,y` (0–100); color encodes type, shot radius scales with xG, goals get a white ring. Orientation: x 0 = own goal (left) → 100 = opponent goal (right).

```jsx
<PitchMap events={[
  { x: 88, y: 42, type: 'shot', outcome: 'goal', xg: 0.62 },
  { x: 64, y: 30, type: 'pass', outcome: 'complete' },
  { x: 40, y: 70, type: 'tackle', outcome: 'won' },
]} />
```

Hovering a marker shows type · outcome · xG. Carries a faint giglio (⚜) watermark.

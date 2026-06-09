Range slider for "Top N" and "minuti minimi" filters. Viola fill, mono value readout.

```jsx
const [topN, setTopN] = React.useState(10);
<Slider label="Top N" value={topN} onChange={setTopN} min={3} max={25} />
<Slider label="Minuti minimi" value={mins} onChange={setMins} min={0} max={3000} step={90} suffix="′" />
```

Explains a technical (engineering or football) term on hover/focus — satisfies the "spiega ogni termine" rule.

```jsx
<Tooltip label="Gol attesi: stima della qualità dei tiri. Gol − xG dice se finalizza sopra le attese.">
  <span>xG</span>
</Tooltip>

<label>Normalizza per 90′ <InfoDot label="Divide i conteggi per i minuti totali × 90 — confronta titolari e subentrati a parità di tempo." /></label>
```

`InfoDot` is the ready-made "?" trigger. `side="bottom"` flips the popover below the trigger.

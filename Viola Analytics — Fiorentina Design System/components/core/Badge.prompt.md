Compact label for status and pitch-event categories.

```jsx
<Badge tone="positive">+2.6 sopra xG</Badge>
<Badge tone="event" eventType="shot">Tiro</Badge>
<Badge tone="viola" dot>Titolare</Badge>
```

Tones: `neutral · viola · accent · positive · warning · danger · event`. With `tone="event"` pass `eventType` (`pass|shot|tackle|dribble|foul`) to color the leading dot with the categorical pitch palette.

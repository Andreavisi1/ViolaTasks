import React from 'react';

const EVENTS = [
  { type: 'pass', label: 'Passaggio', color: 'var(--ev-pass)' },
  { type: 'shot', label: 'Tiro (dim. ∝ xG)', color: 'var(--ev-shot)' },
  { type: 'tackle', label: 'Contrasto', color: 'var(--ev-tackle)' },
  { type: 'dribble', label: 'Dribbling', color: 'var(--ev-dribble)' },
  { type: 'foul', label: 'Fallo', color: 'var(--ev-foul)' },
];

/**
 * Legend — event-type key for the pitch map.
 * `only` optionally limits which event types are shown.
 */
export function Legend({ only = null, style = {} }) {
  const items = only ? EVENTS.filter((e) => only.includes(e.type)) : EVENTS;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignItems: 'center', ...style }}>
      {items.map((e) => (
        <span key={e.type} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: e.color, flex: 'none' }} />
          <span style={{ font: 'var(--fw-medium) var(--text-xs) var(--font-body)', color: 'var(--text-secondary)' }}>{e.label}</span>
        </span>
      ))}
    </div>
  );
}

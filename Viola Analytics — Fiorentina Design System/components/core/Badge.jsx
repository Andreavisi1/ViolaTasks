import React from 'react';

/**
 * Badge — compact status / category label.
 * tone: neutral | viola | accent | positive | warning | danger | event
 * When tone="event", pass `eventType` (pass|shot|tackle|dribble|foul) to color it.
 */
export function Badge({ children, tone = 'neutral', eventType, dot = false, style = {} }) {
  const tones = {
    neutral:  { bg: 'var(--gray-100)',     fg: 'var(--gray-700)',     bd: 'var(--gray-200)' },
    viola:    { bg: 'var(--viola-100)',    fg: 'var(--viola-700)',    bd: 'var(--viola-200)' },
    accent:   { bg: 'var(--accent-soft)',  fg: 'var(--accent-600)',   bd: '#E6CCF7' },
    positive: { bg: 'var(--positive-100)', fg: '#0E7A47',             bd: '#BCE6CF' },
    warning:  { bg: 'var(--warning-100)',  fg: '#9A6500',             bd: '#F2DBA6' },
    danger:   { bg: 'var(--danger-100)',   fg: 'var(--danger-500)',   bd: '#F3C4C1' },
  };
  const eventColors = {
    pass: 'var(--ev-pass)', shot: 'var(--ev-shot)', tackle: 'var(--ev-tackle)',
    dribble: 'var(--ev-dribble)', foul: 'var(--ev-foul)',
  };

  let t = tones[tone] || tones.neutral;
  let dotColor = t.fg;
  if (tone === 'event' && eventType) {
    const c = eventColors[eventType] || 'var(--gray-500)';
    t = { bg: 'var(--gray-100)', fg: 'var(--gray-700)', bd: 'var(--gray-200)' };
    dotColor = c;
  }

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: dot ? '3px 10px 3px 8px' : '3px 10px',
        background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600,
        letterSpacing: '0.01em', lineHeight: 1.4, whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {(dot || tone === 'event') && (
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flex: 'none' }} />
      )}
      {children}
    </span>
  );
}

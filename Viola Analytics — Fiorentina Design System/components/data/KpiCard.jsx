import React from 'react';

/**
 * KpiCard — single headline metric. Mono/display value, optional delta badge
 * and an InfoDot-style hint. Used in the player scorecard row.
 */
export function KpiCard({ label, value, unit = '', delta = null, deltaTone = 'auto', hint = null, accent = false, style = {} }) {
  let tone = deltaTone;
  if (delta != null && deltaTone === 'auto') {
    const n = parseFloat(String(delta).replace(/[^\-0-9.]/g, ''));
    tone = n > 0 ? 'positive' : n < 0 ? 'danger' : 'neutral';
  }
  const deltaColors = {
    positive: { c: '#0E7A47', b: 'var(--positive-100)' },
    danger: { c: 'var(--danger-500)', b: 'var(--danger-100)' },
    neutral: { c: 'var(--gray-600)', b: 'var(--gray-100)' },
  };
  const dc = deltaColors[tone] || deltaColors.neutral;

  return (
    <div style={{
      background: 'var(--surface-card)', border: `1px solid ${accent ? 'var(--viola-200)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)', padding: '14px 16px', boxShadow: 'var(--shadow-xs)',
      display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', minWidth: 0,
      ...(accent ? { background: 'linear-gradient(160deg, var(--viola-50), var(--surface-card))' } : {}),
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          font: 'var(--fw-semibold) var(--text-2xs) var(--font-body)', letterSpacing: '0.04em',
          textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{label}</span>
        {hint}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          font: 'var(--type-kpi)', color: accent ? 'var(--accent-600)' : 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--ls-tight)',
        }}>{value}</span>
        {unit && <span style={{ font: 'var(--fw-medium) var(--text-sm) var(--font-body)', color: 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {delta != null && (
        <span style={{
          alignSelf: 'flex-start', padding: '2px 8px', borderRadius: 'var(--radius-pill)',
          background: dc.b, color: dc.c, font: 'var(--fw-semibold) var(--text-xs) var(--font-mono)',
          fontVariantNumeric: 'tabular-nums',
        }}>{delta}</span>
      )}
    </div>
  );
}

import React from 'react';

/**
 * Card — surface container for dashboard panels.
 * Optional title + eyebrow + actions header. `pad` toggles inner padding.
 * `tone="brand"` renders the viola header treatment.
 */
export function Card({ title, eyebrow, actions = null, tone = 'default', pad = true, children, style = {} }) {
  const brand = tone === 'brand';
  return (
    <section
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        ...style,
      }}
    >
      {(title || eyebrow || actions) && (
        <header
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', padding: '14px 18px',
            background: brand ? 'var(--viola-700)' : 'transparent',
            borderBottom: brand ? 'none' : '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            {eyebrow && (
              <div style={{
                font: 'var(--fw-bold) var(--text-2xs)/1.3 var(--font-body)',
                letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase',
                color: brand ? 'var(--accent-300)' : 'var(--text-brand)', marginBottom: 3,
              }}>{eyebrow}</div>
            )}
            {title && (
              <h3 style={{
                margin: 0, font: 'var(--type-card-title)',
                color: brand ? 'var(--white)' : 'var(--text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{title}</h3>
            )}
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 'none' }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding: pad ? '18px' : 0, flex: 1, minHeight: 0 }}>{children}</div>
    </section>
  );
}

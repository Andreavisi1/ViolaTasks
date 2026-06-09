import React from 'react';

/**
 * MetricSelector — segmented pill control to choose the active metric
 * for the ranking chart (Gol, xG, Gol−xG, Tiri, % passaggi, …).
 * Wraps to multiple rows. Controlled via value/onChange.
 */
export function MetricSelector({ options = [], value, onChange, style = {} }) {
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, ...style }} role="tablist">
      {norm.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value} type="button" role="tab" aria-selected={on}
            onClick={() => onChange && onChange(o.value)}
            style={{
              padding: '7px 13px', borderRadius: 'var(--radius-pill)',
              border: `1px solid ${on ? 'var(--viola-600)' : 'var(--border-default)'}`,
              background: on ? 'var(--viola-600)' : 'var(--surface-card)',
              color: on ? 'var(--white)' : 'var(--text-secondary)',
              font: `${on ? 'var(--fw-semibold)' : 'var(--fw-medium)'} var(--text-sm) var(--font-body)`,
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: on ? 'var(--shadow-brand)' : 'none',
              transition: 'all var(--dur-fast) var(--ease-out)',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.borderColor = 'var(--viola-300)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

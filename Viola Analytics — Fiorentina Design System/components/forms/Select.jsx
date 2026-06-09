import React from 'react';

/**
 * Select — single or multi select, populated from CSV-derived values.
 * options: array of strings OR { value, label }. Multi shows a checkbox menu
 * with a "n selezionati" summary chip. Closes on outside click.
 */
export function Select({
  options = [], value, onChange, multi = false,
  placeholder = 'Seleziona…', label, disabled = false, style = {},
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const norm = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const selected = multi ? (Array.isArray(value) ? value : []) : value;
  const toggle = (v) => {
    if (multi) {
      const set = new Set(selected);
      set.has(v) ? set.delete(v) : set.add(v);
      onChange && onChange([...set]);
    } else {
      onChange && onChange(v);
      setOpen(false);
    }
  };

  let summary = placeholder;
  if (multi && selected.length) summary = selected.length === norm.length ? 'Tutte' : `${selected.length} selezionate`;
  else if (!multi && value) summary = norm.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {label && <div style={{ font: 'var(--fw-medium) var(--text-sm) var(--font-body)', color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</div>}
      <button
        type="button" disabled={disabled} onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          width: '100%', height: 'var(--control-h-md)', padding: '0 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          background: 'var(--surface-card)', border: `1px solid ${open ? 'var(--viola-400)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
          font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
          color: (multi ? selected.length : value) ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: open ? 'var(--focus-ring)' : 'var(--shadow-xs)',
          transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</span>
        <span style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--dur-fast)' }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 'var(--z-overlay)',
          background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', padding: 5, maxHeight: 248, overflowY: 'auto',
        }}>
          {norm.map((o) => {
            const on = multi ? selected.includes(o.value) : value === o.value;
            return (
              <button
                key={o.value} type="button" onClick={() => toggle(o.value)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px',
                  background: on && !multi ? 'var(--viola-50)' : 'transparent', border: 'none',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left',
                  font: 'var(--fw-medium) var(--text-sm) var(--font-body)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => { if (!(on && !multi)) e.currentTarget.style.background = 'var(--gray-100)'; }}
                onMouseLeave={(e) => { if (!(on && !multi)) e.currentTarget.style.background = 'transparent'; }}
              >
                {multi && (
                  <span style={{
                    width: 16, height: 16, flex: 'none', borderRadius: 4,
                    border: `1.5px solid ${on ? 'var(--viola-600)' : 'var(--border-strong)'}`,
                    background: on ? 'var(--viola-600)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>{on ? '✓' : ''}</span>
                )}
                <span style={{ flex: 1 }}>{o.label}</span>
                {!multi && on && <span style={{ color: 'var(--viola-600)' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

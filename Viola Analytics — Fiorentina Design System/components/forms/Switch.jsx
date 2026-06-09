import React from 'react';

/**
 * Switch — boolean toggle (e.g. "Normalizza per 90′").
 * Optional label + hint text. Controlled via checked/onChange.
 */
export function Switch({ checked, onChange, label, hint, disabled = false, style = {} }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: hint ? 'flex-start' : 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style,
    }}>
      <button
        type="button" role="switch" aria-checked={checked} disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          flex: 'none', width: 40, height: 23, borderRadius: 'var(--radius-pill)',
          border: 'none', padding: 2, cursor: disabled ? 'not-allowed' : 'pointer',
          background: checked ? 'var(--viola-600)' : 'var(--gray-300)',
          transition: 'background var(--dur-base) var(--ease-out)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <span style={{
          width: 19, height: 19, borderRadius: '50%', background: 'var(--white)',
          boxShadow: 'var(--shadow-sm)',
          transform: checked ? 'translateX(17px)' : 'translateX(0)',
          transition: 'transform var(--dur-base) var(--ease-spring)',
        }} />
      </button>
      {(label || hint) && (
        <span>
          {label && <span style={{ display: 'block', font: 'var(--fw-medium) var(--text-sm) var(--font-body)', color: 'var(--text-primary)' }}>{label}</span>}
          {hint && <span style={{ display: 'block', font: 'var(--text-xs) var(--font-body)', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{hint}</span>}
        </span>
      )}
    </label>
  );
}

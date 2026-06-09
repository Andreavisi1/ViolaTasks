import React from 'react';

/**
 * Slider — single-value range control (e.g. "Top N", "minuti minimi").
 * Viola track fill, mono value readout. Controlled via value/onChange.
 */
export function Slider({
  value, onChange, min = 0, max = 100, step = 1,
  label, suffix = '', showValue = true, disabled = false, style = {},
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ width: '100%', opacity: disabled ? 0.5 : 1, ...style }}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          {label && <span style={{ font: 'var(--fw-medium) var(--text-sm) var(--font-body)', color: 'var(--text-secondary)' }}>{label}</span>}
          {showValue && (
            <span style={{ font: 'var(--fw-semibold) var(--text-sm) var(--font-mono)', color: 'var(--accent-600)', fontVariantNumeric: 'tabular-nums' }}>
              {value}{suffix}
            </span>
          )}
        </div>
      )}
      <input
        type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        style={{
          width: '100%', height: 6, appearance: 'none', WebkitAppearance: 'none',
          borderRadius: 'var(--radius-pill)', outline: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
          background: `linear-gradient(to right, var(--viola-600) 0%, var(--viola-600) ${pct}%, var(--gray-200) ${pct}%, var(--gray-200) 100%)`,
        }}
        className="va-slider"
      />
      <style>{`
        .va-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:18px; height:18px; border-radius:50%; background:var(--white); border:3px solid var(--viola-600); box-shadow:var(--shadow-sm); cursor:pointer; transition: transform var(--dur-fast) var(--ease-out); }
        .va-slider::-webkit-slider-thumb:hover { transform: scale(1.12); }
        .va-slider::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:var(--white); border:3px solid var(--viola-600); box-shadow:var(--shadow-sm); cursor:pointer; }
      `}</style>
    </div>
  );
}

import React from 'react';

/**
 * Tooltip — explains technical/calcistic terms on hover or focus.
 * Wraps any trigger; `label` is the explanatory text. `side` = top|bottom.
 * Designed for the "spiega ogni termine" requirement.
 */
export function Tooltip({ label, side = 'top', children, maxWidth = 240, style = {} }) {
  const [open, setOpen] = React.useState(false);
  const pos = side === 'bottom'
    ? { top: 'calc(100% + 8px)', bottom: 'auto' }
    : { bottom: 'calc(100% + 8px)', top: 'auto' };
  const arrow = side === 'bottom'
    ? { top: -4, borderWidth: '0 5px 5px 5px', borderColor: 'transparent transparent var(--viola-900) transparent' }
    : { bottom: -4, borderWidth: '5px 5px 0 5px', borderColor: 'var(--viola-900) transparent transparent transparent' };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute', left: '50%', ...pos,
          transform: `translateX(-50%) translateY(${open ? '0' : side === 'bottom' ? '-4px' : '4px'})`,
          background: 'var(--viola-900)', color: 'var(--white)',
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 500,
          lineHeight: 1.4, padding: '8px 11px', borderRadius: 'var(--radius-sm)',
          width: 'max-content', maxWidth, boxShadow: 'var(--shadow-lg)',
          opacity: open ? 1 : 0, pointerEvents: 'none', zIndex: 'var(--z-tooltip)',
          transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        }}
      >
        {label}
        <span style={{ position: 'absolute', left: '50%', marginLeft: -5, width: 0, height: 0, borderStyle: 'solid', ...arrow }} />
      </span>
    </span>
  );
}

/**
 * InfoDot — a small "?" affordance to attach a Tooltip to.
 */
export function InfoDot({ label, side = 'top' }) {
  return (
    <Tooltip label={label} side={side}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 15, height: 15, borderRadius: '50%', cursor: 'help',
        background: 'var(--gray-200)', color: 'var(--gray-600)',
        fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
      }}>?</span>
    </Tooltip>
  );
}

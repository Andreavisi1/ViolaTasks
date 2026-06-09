import React from 'react';

/**
 * Button — primary action control for Viola Analytics.
 * Variants: primary (viola), secondary (outline), ghost, danger.
 * Sizes: sm | md | lg. Optional leading/trailing icon nodes.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const sizes = {
    sm: { height: 'var(--control-h-sm)', padding: '0 12px', font: '13px', radius: 'var(--radius-sm)', gap: '6px' },
    md: { height: 'var(--control-h-md)', padding: '0 16px', font: '14px', radius: 'var(--radius-md)', gap: '8px' },
    lg: { height: 'var(--control-h-lg)', padding: '0 22px', font: '15px', radius: 'var(--radius-md)', gap: '8px' },
  };
  const s = sizes[size] || sizes.md;

  const palettes = {
    primary: {
      bg: 'var(--viola-700)', bgHover: 'var(--viola-800)', color: 'var(--white)',
      border: 'transparent', shadow: 'var(--shadow-brand)',
    },
    secondary: {
      bg: 'var(--surface-card)', bgHover: 'var(--viola-50)', color: 'var(--viola-700)',
      border: 'var(--viola-300)', shadow: 'var(--shadow-xs)',
    },
    ghost: {
      bg: 'transparent', bgHover: 'var(--viola-50)', color: 'var(--viola-700)',
      border: 'transparent', shadow: 'none',
    },
    danger: {
      bg: 'var(--danger-500)', bgHover: '#c4271f', color: 'var(--white)',
      border: 'transparent', shadow: 'var(--shadow-sm)',
    },
  };
  const p = palettes[variant] || palettes.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: s.padding, width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: s.font,
        letterSpacing: '0.01em', lineHeight: 1, whiteSpace: 'nowrap',
        color: p.color, background: hover && !disabled ? p.bgHover : p.bg,
        border: `1px solid ${p.border}`, borderRadius: s.radius,
        boxShadow: variant === 'ghost' ? 'none' : p.shadow,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
        transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: 'inline-flex', fontSize: '1.1em' }}>{iconRight}</span>}
    </button>
  );
}

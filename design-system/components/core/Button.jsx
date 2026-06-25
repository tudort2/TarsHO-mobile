import React from 'react';

/**
 * Button — TARS primary action control.
 * Mirrors the desktop `.btn` family: dark default, brand-blue primary,
 * cyan "sell", ghost outline. Radius ~10px, 600 weight, subtle lift on hover.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconRight = null,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12, borderRadius: 8, gap: 6 },
    md: { padding: '9px 14px', fontSize: 13, borderRadius: 10, gap: 8 },
    lg: { padding: '12px 18px', fontSize: 14, borderRadius: 12, gap: 8 },
  };
  const variants = {
    dark:    { background: 'var(--ink)',     color: 'var(--text-inverse)', border: '1px solid var(--ink)' },
    primary: { background: 'var(--primary)', color: '#fff',                border: '1px solid var(--primary)' },
    sell:    { background: 'var(--sell)',    color: '#fff',                border: '1px solid var(--sell)' },
    buy:     { background: 'var(--buy)',     color: '#fff',                border: '1px solid var(--buy)' },
    danger:  { background: 'var(--danger)',  color: '#fff',                border: '1px solid var(--danger)' },
    ghost:   { background: 'transparent',    color: 'var(--ink)',          border: '1px solid var(--border-2)' },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const [hover, setHover] = React.useState(false);

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        lineHeight: 1,
        borderRadius: s.borderRadius,
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transform: hover && !disabled ? 'translateY(-1px)' : 'none',
        boxShadow: hover && !disabled ? 'var(--shadow-sm)' : 'none',
        filter: hover && !disabled && variant === 'ghost' ? 'none' : undefined,
        background: hover && !disabled && variant === 'ghost' ? 'var(--bg-2)' : v.background,
        color: v.color,
        border: v.border,
        transition: 'transform .08s ease, box-shadow .12s ease, background .12s ease',
        ...style,
      }}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

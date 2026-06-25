import React from 'react';

const TONES = {
  primary: ['var(--primary-2)', 'var(--primary)'],
  buy:     ['var(--buy-2)',     'var(--buy)'],
  sell:    ['var(--sell-2)',    'var(--sell)'],
  success: ['var(--success-2)', 'var(--success)'],
  warning: ['var(--warning-2)', '#A8771F'],
  danger:  ['var(--danger-2)',  'var(--danger)'],
  ghost:   ['var(--bg-2)',      'var(--ink-2)'],
};

/**
 * Pill — rounded status / type tag (desktop `.pill`). Soft tinted background +
 * accent text, 999px radius. Use for property status, contact type, journey
 * role. Pass `dot` for a leading status dot.
 */
export function Pill({ tone = 'primary', dot = false, minWidth, style = {}, children, ...rest }) {
  const [bg, fg] = TONES[tone] || TONES.primary;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: minWidth ? 'center' : undefined,
        gap: 6,
        padding: '4px 9px',
        minWidth,
        borderRadius: 'var(--radius-full)',
        fontSize: 11.5,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        lineHeight: 1.4,
        background: bg,
        color: fg,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg, flex: '0 0 6px' }} />
      )}
      {children}
    </span>
  );
}

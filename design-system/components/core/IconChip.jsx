import React from 'react';

const TONES = {
  blue:   ['var(--primary-2)', 'var(--primary)'],
  cyan:   ['var(--sell-2)',    'var(--sell)'],
  violet: ['var(--buy-2)',     'var(--buy)'],
  green:  ['var(--success-2)', 'var(--success)'],
  amber:  ['var(--warning-2)', 'var(--warning)'],
  rose:   ['var(--danger-2)',  'var(--danger)'],
};

/**
 * IconChip — square rounded icon container (desktop `.chip`). A tinted
 * background + matching accent icon, used to anchor list rows, KPIs, and tools.
 */
export function IconChip({ tone = 'blue', size = 36, radius = 10, style = {}, children, ...rest }) {
  const [bg, fg] = TONES[tone] || TONES.blue;
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: radius,
        background: bg,
        color: fg,
        display: 'grid',
        placeItems: 'center',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

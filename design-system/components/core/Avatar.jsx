import React from 'react';

const GRADS = {
  blue:   'linear-gradient(135deg, var(--primary), #3B82F6)',
  cyan:   'linear-gradient(135deg, var(--sell), #22D3EE)',
  violet: 'linear-gradient(135deg, var(--buy), #A78BFA)',
  slate:  'linear-gradient(135deg, var(--tars-slate-500), var(--tars-slate-300))',
};

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(t => /[a-z]/i.test(t))
    .slice(0, 2)
    .map(t => t[0].toUpperCase())
    .join('');
}

/**
 * Avatar — circular user mark. Shows a photo when `src` is given, otherwise a
 * gradient-filled circle with the person's initials (desktop `.avatar`).
 */
export function Avatar({ name = '', src, size = 36, tone = 'blue', style = {}, ...rest }) {
  const fontSize = Math.round(size * 0.4);
  return (
    <div
      style={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        borderRadius: '50%',
        background: src ? `center/cover no-repeat url(${src})` : (GRADS[tone] || GRADS.blue),
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
        fontSize,
        fontFamily: 'var(--font-sans)',
        letterSpacing: '.2px',
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {!src && initials(name)}
    </div>
  );
}

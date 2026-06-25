import React from 'react';

/**
 * Card — surface container. Default has hairline border + soft shadow on a
 * white (--surface) background, radius 14. `flat` drops the shadow, `tinted`
 * uses the nested surface tone. `hover` adds the raised shadow on pointer.
 */
export function Card({
  variant = 'default',
  hover = false,
  padding = 18,
  as: Tag = 'div',
  style = {},
  children,
  ...rest
}) {
  const [isHover, setHover] = React.useState(false);
  const base = {
    background: variant === 'tinted' ? 'var(--surface-2)' : 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding,
    boxShadow: variant === 'flat' ? 'none' : (hover && isHover ? 'var(--shadow)' : 'var(--shadow-sm)'),
    transition: 'box-shadow .15s ease, background var(--dur) var(--ease), border-color var(--dur) var(--ease)',
  };
  return (
    <Tag
      onMouseEnter={hover ? () => setHover(true) : undefined}
      onMouseLeave={hover ? () => setHover(false) : undefined}
      style={{ ...base, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

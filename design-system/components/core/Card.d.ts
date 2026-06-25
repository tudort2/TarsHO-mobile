import React from 'react';

export interface CardProps {
  /** `default` = bordered + soft shadow, `flat` = no shadow, `tinted` = nested surface tone. */
  variant?: 'default' | 'flat' | 'tinted';
  /** Raise to the larger shadow on hover. */
  hover?: boolean;
  /** Inner padding in px (default 18). */
  padding?: number;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Card — the standard TARS surface container (radius 14, hairline border, soft shadow). */
export function Card(props: CardProps): JSX.Element;

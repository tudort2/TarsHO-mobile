import React from 'react';

export type Tone = 'primary' | 'buy' | 'sell' | 'success' | 'warning' | 'danger' | 'ghost';

export interface PillProps {
  /** Color role. `buy` = violet, `sell` = cyan, `primary` = blue. */
  tone?: Tone;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Fix a minimum width so a row of pills line up (e.g. 80). */
  minWidth?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Pill — rounded soft-tinted status/type tag. */
export function Pill(props: PillProps): JSX.Element;

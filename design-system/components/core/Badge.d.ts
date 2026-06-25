import React from 'react';

export type BadgeTone = 'primary' | 'buy' | 'sell' | 'success' | 'warning' | 'danger' | 'ghost';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Badge — compact inline status tag (smaller sibling of Pill). */
export function Badge(props: BadgeProps): JSX.Element;

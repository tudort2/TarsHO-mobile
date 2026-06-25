import React from 'react';

export type ButtonVariant = 'primary' | 'dark' | 'sell' | 'buy' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  /** Visual style. `primary` = brand blue, `dark` = ink fill, `ghost` = outline. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon node (e.g. an inline SVG / Lucide element). */
  icon?: React.ReactNode;
  /** Trailing icon node. */
  iconRight?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Button — TARS primary action control.
 *
 * @startingPoint section="Core" subtitle="Action buttons in every variant & size" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;

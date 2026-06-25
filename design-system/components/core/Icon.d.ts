import React from 'react';

export type IconName =
  | 'home' | 'building' | 'users' | 'user' | 'trendingUp' | 'trendingDown'
  | 'dollar' | 'check' | 'checkCircle' | 'chevronRight' | 'chevronDown'
  | 'chevronLeft' | 'search' | 'bell' | 'plus' | 'fileText' | 'mapPin'
  | 'calendar' | 'phone' | 'mail' | 'settings' | 'menu' | 'heart' | 'key'
  | 'arrowRight' | 'clock' | 'briefcase' | 'layers' | 'moreH';

export interface IconProps {
  /** Icon name from the curated Lucide subset. */
  name?: IconName;
  /** Pixel size (default 18). */
  size?: number;
  /** Stroke color (default currentColor — inherits text color). */
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

/** Icon — TARS stroke icon (Lucide subset, 1.75 stroke, round caps/joins). */
export function Icon(props: IconProps): JSX.Element;
export const ICON_NAMES: string[];

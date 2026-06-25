import React from 'react';

export interface AvatarProps {
  /** Full name — initials are derived from it when no `src`. */
  name?: string;
  /** Photo URL. When set, replaces the initials. */
  src?: string;
  /** Diameter in px (default 36). */
  size?: number;
  /** Gradient tone for the initials fallback. */
  tone?: 'blue' | 'cyan' | 'violet' | 'slate';
  style?: React.CSSProperties;
}

/** Avatar — circular photo or gradient initials mark. */
export function Avatar(props: AvatarProps): JSX.Element;

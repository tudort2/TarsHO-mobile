// Re-export color system from ThemeContext
export { LightColors, DarkColors, useColors } from '../context/ThemeContext';
export type { ThemeMode } from '../context/ThemeContext';

// Static Colors alias — points to LightColors so screens that
// haven't migrated to useColors() still compile and render.
// Themed screens should use useColors() instead.
import { LightColors } from '../context/ThemeContext';
export const Colors = LightColors;
export type Colors = typeof LightColors;

// ── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ── Radius ───────────────────────────────────────────────────────────────────
export const Radius = {
  sm:   6,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

// ── Static typography (doesn't depend on theme) ──────────────────────────────
export const Typography = {
  h1:   { fontSize: 26, fontWeight: '700' as const, color: undefined as any },
  h2:   { fontSize: 20, fontWeight: '700' as const, color: undefined as any },
  h3:   { fontSize: 16, fontWeight: '600' as const, color: undefined as any },
  body: { fontSize: 14, fontWeight: '400' as const, color: undefined as any },
  sm:   { fontSize: 13, fontWeight: '400' as const, color: undefined as any },
  xs:   { fontSize: 11, fontWeight: '400' as const, color: undefined as any },
  label:{ fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.6, color: undefined as any },
};

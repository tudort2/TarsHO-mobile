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

// ── Font families (TARS design system) ───────────────────────────────────────
// Using system fonts as defaults. To enable Geist + Inter + IBM Plex Mono,
// install @expo-google-fonts/inter, @expo-google-fonts/ibm-plex-mono and load
// them in App.tsx via useFonts(). Then update the values below.
import { Platform } from 'react-native';

export const FontFamily = {
  /** Display / headings — Geist 700 (fallback: system bold) */
  display: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  /** Body — Inter 400/500/600 (fallback: system) */
  body:    Platform.OS === 'ios' ? 'System' : 'sans-serif',
  /** Monospace / numbers — IBM Plex Mono (fallback: system mono) */
  mono:    Platform.OS === 'ios' ? 'Courier New' : 'monospace',
};

// ── Elevation / shadow presets ────────────────────────────────────────────────
export const Shadow = {
  none: {},
  sm: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
    android: { elevation: 2 },
    default: {},
  })!,
  md: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.10, shadowRadius: 8 },
    android: { elevation: 4 },
    default: {},
  })!,
  lg: Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16 },
    android: { elevation: 8 },
    default: {},
  })!,
};

// ── Typography ────────────────────────────────────────────────────────────────
// fontFamily is intentionally omitted from most variants so system fonts load
// instantly. Add fontFamily: FontFamily.display / .body as needed per screen.
export const Typography = {
  /** Display headline — Geist-style, large and bold */
  display: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34, letterSpacing: -0.5 },
  /** Page / section headings */
  h1:      { fontSize: 26, fontWeight: '700' as const, lineHeight: 32, letterSpacing: -0.3 },
  h2:      { fontSize: 20, fontWeight: '700' as const, lineHeight: 26, letterSpacing: -0.2 },
  h3:      { fontSize: 16, fontWeight: '600' as const, lineHeight: 22, letterSpacing: -0.1 },
  /** Body copy */
  body:    { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodyMd:  { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  bodySb:  { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  sm:      { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  smMd:    { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
  xs:      { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
  /** ALL-CAPS label — matches desktop .label */
  label:   { fontSize: 11, fontWeight: '600' as const, lineHeight: 14, textTransform: 'uppercase' as const, letterSpacing: 0.7 },
  /** Monospace / tabular numbers — IBM Plex Mono style */
  mono:    { fontSize: 13, fontWeight: '500' as const, lineHeight: 18, fontFamily: FontFamily.mono, letterSpacing: -0.2 },
  monoLg:  { fontSize: 20, fontWeight: '600' as const, lineHeight: 26, fontFamily: FontFamily.mono, letterSpacing: -0.4 },
};

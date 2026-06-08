// TARS Design System — maps directly from web CSS variables

export const Colors = {
  // Primary
  primary: '#0EA5E9',       // --teal (sky-500)
  primaryDark: '#0284C7',
  primaryLight: '#38BDF8',

  // Accents
  buy: '#6366F1',           // indigo — buy journey
  sell: '#14B8A6',          // teal — sell journey
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Backgrounds
  bgBase: '#0B1120',        // deepest background
  bgSurface: '#111827',     // card surfaces
  bgElevated: '#1F2937',    // elevated cards / modals
  bgBorder: '#374151',

  // Text
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Gradient stops
  gradientStart: '#0B1120',
  gradientMid: '#0F172A',
  gradientEnd: '#1E293B',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 32, fontWeight: '700' as const, color: Colors.textPrimary },
  h1:   { fontSize: 24, fontWeight: '700' as const, color: Colors.textPrimary },
  h2:   { fontSize: 20, fontWeight: '600' as const, color: Colors.textPrimary },
  h3:   { fontSize: 17, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textPrimary },
  sm:   { fontSize: 13, fontWeight: '400' as const, color: Colors.textSecondary },
  xs:   { fontSize: 11, fontWeight: '400' as const, color: Colors.textMuted },
  label:{ fontSize: 12, fontWeight: '500' as const, color: Colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' as const },
};

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

// ── Color tokens — TARS design system ────────────────────────────────────────
// Matches the --tars-* CSS variable set in public/index.html.
// Keep in sync with DEPLOYMENT.md § Design System Reference.
export const LightColors = {
  // ── Backgrounds
  bgBase:     '#F8FAFC',   // --tars-bg
  bgSurface:  '#FFFFFF',   // --tars-surface
  bgElevated: '#F1F5F9',
  bgBorder:   '#E2E8F0',
  bgBorder2:  '#CBD5E1',
  // ── Text
  textPrimary:   '#0F172A',  // --tars-navy-900
  textSecondary: '#64748B',
  textMuted:     '#94A3B8',
  textInverse:   '#FFFFFF',  // text on filled colored backgrounds
  // ── Brand / accent
  primary:  '#2563EB',              // --tars-blue
  primary2: 'rgba(37,99,235,0.12)',
  indigo:   '#8B5CF6',              // --tars-violet  (= buy)
  indigo2:  'rgba(139,92,246,0.12)',
  cyan:     '#06B6D4',              // --tars-cyan    (= sell)
  cyan2:    'rgba(6,182,212,0.12)',
  amber:    '#F59E0B',              // --tars-amber   (= warning)
  // ── Status
  success:  '#10B981',              // --tars-green
  success2: 'rgba(16,185,129,0.12)',
  warning:  '#F59E0B',              // --tars-amber
  warning2: 'rgba(245,158,11,0.14)',
  danger:   '#F43F5E',              // --tars-rose
  danger2:  'rgba(244,63,94,0.12)',
  // ── Journey
  buy:  '#8B5CF6',   // violet / indigo
  sell: '#06B6D4',   // cyan
};

export const DarkColors = {
  // ── Backgrounds
  bgBase:     '#0F172A',   // --tars-navy-900
  bgSurface:  '#162033',   // --tars-navy-800
  bgElevated: '#0B1220',
  bgBorder:   '#1E293B',
  bgBorder2:  '#2A3A55',
  // ── Text
  textPrimary:   '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted:     '#64748B',
  textInverse:   '#FFFFFF',
  // ── Brand / accent (same hue, lightened for dark backgrounds)
  primary:  '#2563EB',
  primary2: 'rgba(37,99,235,0.18)',
  indigo:   '#8B5CF6',
  indigo2:  'rgba(139,92,246,0.20)',
  cyan:     '#06B6D4',
  cyan2:    'rgba(6,182,212,0.18)',
  amber:    '#FCD34D',
  // ── Status (lighter for dark mode legibility)
  success:  '#34D399',
  success2: 'rgba(52,211,153,0.15)',
  warning:  '#FCD34D',
  warning2: 'rgba(252,211,77,0.12)',
  danger:   '#FB7185',
  danger2:  'rgba(251,113,133,0.15)',
  // ── Journey
  buy:  '#8B5CF6',
  sell: '#06B6D4',
};

export type Colors = typeof LightColors;

interface ThemeContextValue {
  mode: ThemeMode;
  colors: Colors;
  toggle: () => void;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  colors: DarkColors,
  toggle: () => {},
  setMode: () => {},
});

const STORAGE_KEY = 'tars_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(saved => {
      if (saved === 'light' || saved === 'dark') setModeState(saved);
    });
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m);
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const colors = mode === 'dark' ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggle, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useColors(): Colors {
  return useContext(ThemeContext).colors;
}

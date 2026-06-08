import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

// ── Color tokens (matches desktop CSS variables) ─────────────────────────────
export const LightColors = {
  // Backgrounds
  bgBase:     '#F8FAFC',
  bgSurface:  '#FFFFFF',
  bgElevated: '#F1F5F9',
  bgBorder:   '#E2E8F0',
  bgBorder2:  '#CBD5E1',
  // Text
  textPrimary:   '#0F172A',
  textSecondary: '#64748B',
  textMuted:     '#94A3B8',
  // Brand
  primary:  '#2563EB',
  primary2: 'rgba(37,99,235,0.12)',
  indigo:   '#8B5CF6',
  indigo2:  'rgba(139,92,246,0.12)',
  cyan:     '#06B6D4',
  cyan2:    'rgba(6,182,212,0.12)',
  // Status
  success:  '#10B981',
  success2: 'rgba(16,185,129,0.12)',
  warning:  '#F59E0B',
  warning2: 'rgba(245,158,11,0.14)',
  danger:   '#F43F5E',
  danger2:  'rgba(244,63,94,0.12)',
  // Journey
  buy:  '#8B5CF6',
  sell: '#06B6D4',
};

export const DarkColors = {
  bgBase:     '#0F172A',
  bgSurface:  '#162033',
  bgElevated: '#0B1220',
  bgBorder:   '#1E293B',
  bgBorder2:  '#2A3A55',
  textPrimary:   '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted:     '#64748B',
  primary:  '#2563EB',
  primary2: 'rgba(37,99,235,0.18)',
  indigo:   '#8B5CF6',
  indigo2:  'rgba(139,92,246,0.20)',
  cyan:     '#06B6D4',
  cyan2:    'rgba(6,182,212,0.18)',
  success:  '#34D399',
  success2: 'rgba(52,211,153,0.15)',
  warning:  '#FCD34D',
  warning2: 'rgba(252,211,77,0.12)',
  danger:   '#FB7185',
  danger2:  'rgba(251,113,133,0.15)',
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

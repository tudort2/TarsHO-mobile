import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/tokens';

export type ThemeMode = 'light' | 'dark';

// ── Color tokens — consumed from the TARS design system ──────────────────────
// Source of truth: claude.ai/design → synced to design-system/tokens/colors.css
// → generated into src/theme/tokens.ts (run: node scripts/gen-tokens.mjs).
// Do NOT hardcode colors here — edit the design system and re-sync.
export const LightColors = lightColors;
export const DarkColors  = darkColors;

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

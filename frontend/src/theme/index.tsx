import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import {
  AccentName,
  darkAccents,
  darkColors,
  gradients,
  lightAccents,
  lightColors,
  palette,
} from './colors';

export type ThemeMode = 'light' | 'dark' | 'system';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};

export const fontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export type Theme = {
  dark: boolean;
  colors: typeof lightColors;
  accents: Record<AccentName, { bg: string; fg: string }>;
  gradients: typeof gradients;
  palette: typeof palette;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
};

const buildTheme = (dark: boolean): Theme => ({
  dark,
  colors: dark ? darkColors : lightColors,
  accents: dark ? darkAccents : lightAccents,
  gradients,
  palette,
  spacing,
  radius,
  fontSize,
});

const ThemeContext = createContext<Theme>(buildTheme(false));

/**
 * Decide o esquema efetivo.
 * RF 12.2 (tema claro/escuro) e RF 12.3 (modo noturno automático).
 * Quando `autoNight` está ativo, o horário local manda (19h–6h = escuro);
 * caso contrário seguimos a escolha do usuário ou o tema do sistema.
 */
export function resolveScheme(
  mode: ThemeMode,
  systemScheme: 'light' | 'dark' | null | undefined,
  autoNight: boolean,
  now: Date = new Date(),
): 'light' | 'dark' {
  if (autoNight) {
    const hour = now.getHours();
    return hour >= 19 || hour < 6 ? 'dark' : 'light';
  }
  if (mode === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
  return mode;
}

export function ThemeProvider({
  mode,
  autoNight,
  children,
}: {
  mode: ThemeMode;
  autoNight: boolean;
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();
  const scheme = resolveScheme(mode, systemScheme, autoNight);
  const theme = useMemo(() => buildTheme(scheme === 'dark'), [scheme]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

export { palette, gradients };
export type { AccentName };

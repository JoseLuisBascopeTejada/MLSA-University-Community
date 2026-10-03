import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

/** Null outside a ThemeProvider. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }
  return value;
}

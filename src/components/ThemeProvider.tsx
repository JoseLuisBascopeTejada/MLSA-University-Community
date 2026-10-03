import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { THEME_KEY } from '@/lib/config';
import { ThemeContext } from '@/hooks/useTheme';
import type { Theme } from '@/hooks/useTheme';

function readStored(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null; // storage unavailable (private mode, blocked cookies, SSR)
  }
}

function systemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function apply(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function persist(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage unavailable — theme still applies for this session
  }
}

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStored() ?? systemTheme());

  // Keep <html> in sync (the inline script in index.html already set it pre-paint).
  useEffect(() => {
    apply(theme);
  }, [theme]);

  // While the user has NOT chosen explicitly, follow OS changes.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent): void => {
      if (readStored() !== null) return; // explicit choice wins
      setThemeState(event.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    persist(next);
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      persist(next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

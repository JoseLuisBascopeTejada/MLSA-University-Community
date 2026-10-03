import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { LANG_KEY } from '@/lib/config';
import { dictionaries, getMessage } from '@/i18n';
import type { Locale, MessageKey } from '@/i18n';
import { I18nContext } from '@/hooks/useI18n';

function readStored(): Locale | null {
  try {
    const value = window.localStorage.getItem(LANG_KEY);
    return value === 'es' || value === 'en' ? value : null;
  } catch {
    return null; // storage unavailable (private mode, blocked cookies, SSR)
  }
}

/** First navigator language whose primary subtag is es/en; else null. */
function browserLocale(): Locale | null {
  try {
    const list = window.navigator.languages;
    if (!Array.isArray(list)) return null;
    for (const tag of list) {
      if (typeof tag !== 'string') continue;
      const primary = tag.split('-')[0]?.toLowerCase();
      if (primary === 'es' || primary === 'en') return primary;
    }
    return null;
  } catch {
    return null;
  }
}

function persist(locale: Locale): void {
  try {
    window.localStorage.setItem(LANG_KEY, locale);
  } catch {
    // storage unavailable — locale still applies for this session
  }
}

function applySideEffects(locale: Locale): void {
  const dict = dictionaries[locale];
  document.documentElement.lang = locale;
  document.title = getMessage(dict, 'meta.title');
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', getMessage(dict, 'meta.description'));
}

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => readStored() ?? browserLocale() ?? 'es');

  useEffect(() => {
    applySideEffects(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    persist(next);
    setLocaleState(next);
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'es' ? 'en' : 'es';
      persist(next);
      return next;
    });
  }, []);

  const t = useCallback((path: MessageKey) => getMessage(dictionaries[locale], path), [locale]);

  const value = useMemo(() => ({ locale, setLocale, toggle, t }), [locale, setLocale, toggle, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

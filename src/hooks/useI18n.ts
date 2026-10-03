import { createContext, useContext } from 'react';
import type { Locale, MessageKey } from '@/i18n';

export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  t: (path: MessageKey) => string;
};

/** Null outside an I18nProvider. */
export const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (value === null) {
    throw new Error('useI18n must be used inside an I18nProvider');
  }
  return value;
}

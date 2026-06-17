import { createContext, useContext, type ReactNode } from 'react';
import { dictionaries, normalizeLocale, type Locale } from './i18n';

export type Dict = (typeof dictionaries)['en'];

interface LocaleValue {
  locale: Locale;
  dict: Dict;
  /** '' for English, '/my' or '/th' otherwise. */
  prefix: string;
  /** Prefix an app-relative path with the active locale. */
  localize: (path: string) => string;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ lang, children }: { lang: string | undefined; children: ReactNode }) {
  const locale = normalizeLocale(lang);
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const localize = (path: string) => (locale === 'en' ? path : `${prefix}${path === '/' ? '' : path}`);
  const value: LocaleValue = { locale, dict: dictionaries[locale] as Dict, prefix, localize };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

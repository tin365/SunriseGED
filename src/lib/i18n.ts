import en from '../i18n/en.json';
import my from '../i18n/my.json';
import th from '../i18n/th.json';

export const locales = ['en', 'my', 'th'] as const;
export type Locale = (typeof locales)[number];
export const dictionaries = { en, my, th };

export function normalizeLocale(value: unknown): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : 'en';
}

export function getLangFromUrl(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return normalizeLocale(first);
}

export function pathFor(lang: Locale, path = '/') {
  const clean = path === '/' ? '' : path.replace(/^\/(en|my|th)/, '').replace(/\/$/, '');
  return lang === 'en' ? `/${clean.replace(/^\//, '')}` || '/' : `/${lang}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export function t(locale: Locale) {
  return dictionaries[locale];
}

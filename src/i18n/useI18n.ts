import { useStore } from '../store/useStore';
import { en, type DictKey } from './en';
import { es } from './es';

const dicts = { en, es } as const;

/** Resolve a key for the active locale, falling back to EN, then the raw key. */
export function useI18n() {
  const locale = useStore((s) => s.locale);
  const t = (key: string): string => {
    const dict = dicts[locale] as Record<string, string>;
    return dict[key] ?? (en as Record<string, string>)[key] ?? key;
  };
  return { t, locale };
}

/** Non-hook resolver for use outside React (e.g. assistant engine fallbacks). */
export function translate(locale: 'en' | 'es', key: DictKey): string {
  return (dicts[locale] as Record<string, string>)[key] ?? en[key] ?? key;
}

import enHomeMessages from '../../../locales/en/home.json';
import hyHomeMessages from '../../../locales/hy/home.json';
import ruHomeMessages from '../../../locales/ru/home.json';

export type HomeLocale = 'en' | 'hy' | 'ru';
export type HomeMessages = typeof enHomeMessages;

export type HomeLanguageOption = {
  locale: HomeLocale;
  codeLabel: string;
  nativeLabel: string;
};

export const DEFAULT_HOME_LOCALE: HomeLocale = 'en';

export const HOME_LANGUAGE_OPTIONS: readonly HomeLanguageOption[] = [
  { locale: 'en', codeLabel: 'ENG', nativeLabel: 'English' },
  { locale: 'ru', codeLabel: 'РУС', nativeLabel: 'Русский' },
  { locale: 'hy', codeLabel: 'ՀԱՅ', nativeLabel: 'Հայերեն' },
] as const;

export const homeMessagesByLocale: Record<HomeLocale, HomeMessages> = {
  en: enHomeMessages,
  hy: hyHomeMessages,
  ru: ruHomeMessages,
};

export const homeMessages = homeMessagesByLocale[DEFAULT_HOME_LOCALE];

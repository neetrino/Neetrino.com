import enAdminMessages from '../../../../locales/en/admin.json';
import hyAdminMessages from '../../../../locales/hy/admin.json';
import ruAdminMessages from '../../../../locales/ru/admin.json';
import type { HomeLocale } from '@/app/_components/home-messages';

export type AdminMessages = typeof enAdminMessages;
export type AdminLocale = HomeLocale;

export type AdminLanguageOption = {
  locale: AdminLocale;
  codeLabel: string;
  nativeLabel: string;
};

export const DEFAULT_ADMIN_LOCALE: AdminLocale = 'en';

export const ADMIN_LANGUAGE_OPTIONS: readonly AdminLanguageOption[] = [
  { locale: 'en', codeLabel: 'ENG', nativeLabel: 'English' },
  { locale: 'ru', codeLabel: 'РУС', nativeLabel: 'Русский' },
  { locale: 'hy', codeLabel: 'ՀԱՅ', nativeLabel: 'Հայերեն' },
] as const;

export const adminMessagesByLocale: Record<AdminLocale, AdminMessages> = {
  en: enAdminMessages,
  hy: hyAdminMessages,
  ru: ruAdminMessages,
};

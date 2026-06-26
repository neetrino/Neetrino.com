import type { HomeLocale } from '@/app/_components/home-messages';

export const BLOG_LOCALES = ['en', 'hy', 'ru'] as const satisfies readonly HomeLocale[];

export type BlogLocale = (typeof BLOG_LOCALES)[number];

export const BLOG_LOCALE_LABELS: Record<BlogLocale, string> = {
  en: 'English',
  hy: 'Հայերեն',
  ru: 'Русский',
};

export function isBlogLocale(value: string): value is BlogLocale {
  return BLOG_LOCALES.includes(value as BlogLocale);
}

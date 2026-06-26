import type { HomeLocale } from '@/app/_components/home-messages';
import { DEFAULT_HOME_LOCALE } from '@/app/_components/home-messages';
import type { BlogLocale } from '@/lib/blog-locales';

export type BlogTranslationFields = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type BlogPostTranslations = Partial<Record<BlogLocale, BlogTranslationFields>>;

export function resolveBlogTranslation(
  translations: BlogPostTranslations,
  locale: HomeLocale,
): BlogTranslationFields | null {
  return translations[locale] ?? translations[DEFAULT_HOME_LOCALE] ?? Object.values(translations)[0] ?? null;
}

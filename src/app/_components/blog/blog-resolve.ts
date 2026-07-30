import { DEFAULT_HOME_LOCALE, type HomeLocale } from '../home-messages';
import type { BlogArticleListItem, BlogArticleTranslation } from './blog-types';

export type ResolvedBlogArticle = {
  id: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  categoryId: BlogArticleListItem['categoryId'];
  contentTypeId: BlogArticleListItem['contentTypeId'];
  title: string;
  slug: string;
  excerpt: string;
  imageAlt: string;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

function pickTranslation(
  translations: BlogArticleListItem['translations'],
  locale: HomeLocale,
): BlogArticleTranslation | null {
  return translations[locale] ?? translations[DEFAULT_HOME_LOCALE] ?? Object.values(translations)[0] ?? null;
}

function toResolved(
  item: BlogArticleListItem,
  translation: BlogArticleTranslation,
): ResolvedBlogArticle {
  return {
    id: item.id,
    coverImageUrl: item.coverImageUrl,
    publishedAt: item.publishedAt,
    createdAt: item.createdAt,
    categoryId: item.categoryId,
    contentTypeId: item.contentTypeId,
    title: translation.title,
    slug: translation.slug,
    excerpt: translation.excerpt,
    imageAlt: translation.imageAlt ?? translation.title,
    content: translation.content ?? null,
    seoTitle: translation.seoTitle ?? null,
    seoDescription: translation.seoDescription ?? null,
  };
}

/** Resolves a list item into the active locale (with fallback). */
export function resolveBlogArticle(
  item: BlogArticleListItem,
  locale: HomeLocale,
): ResolvedBlogArticle | null {
  const translation = pickTranslation(item.translations, locale);
  return translation ? toResolved(item, translation) : null;
}

/** Resolves all list items that have a usable translation for the locale. */
export function resolveBlogArticles(
  items: BlogArticleListItem[],
  locale: HomeLocale,
): ResolvedBlogArticle[] {
  return items.flatMap((item) => {
    const resolved = resolveBlogArticle(item, locale);
    return resolved ? [resolved] : [];
  });
}

/** Formats an ISO date for blog UI surfaces. */
export function formatBlogDate(iso: string | null, locale: HomeLocale): string {
  if (!iso) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
}

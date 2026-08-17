import { BLOG_LOCALE_LABELS, isBlogLocale, type BlogLocale } from '@/lib/blog-locales';

const SLUG_SEPARATOR = '-';
const BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
const DEFAULT_BLOG_STATUS = 'DRAFT';
const TITLE_MAX_LENGTH = 200;
const SLUG_MAX_LENGTH = 120;
const EXCERPT_MAX_LENGTH = 500;
const CONTENT_MAX_LENGTH = 100_000;
const IMAGE_ALT_MAX_LENGTH = 200;
const SEO_TITLE_MAX_LENGTH = 200;
const SEO_DESCRIPTION_MAX_LENGTH = 320;
const COVER_IMAGE_URL_MAX_LENGTH = 2_000;

export type BlogPostStatus = (typeof BLOG_STATUSES)[number];

export type BlogTranslationInput = {
  locale: BlogLocale;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPostInput = {
  status: BlogPostStatus;
  publishedAt?: Date;
  coverImageUrl?: string;
  translations: BlogTranslationInput[];
};

export type BlogPostInputError = {
  error: string;
};

function readOptionalString(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return undefined;
  }

  return trimmed;
}

function readRequiredString(value: unknown, maxLength: number): string | null {
  const trimmed = readOptionalString(value, maxLength);
  return trimmed ?? null;
}

export function createBlogSlug(title: string, locale: BlogLocale): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, SLUG_SEPARATOR)
    .replace(/^-|-$/g, '')
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/-$/g, '');

  if (slug.length > 0) {
    return slug;
  }

  return `post${SLUG_SEPARATOR}${locale}${SLUG_SEPARATOR}${Date.now()}`;
}

function isHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function readStatus(value: unknown): BlogPostStatus | null {
  if (value === undefined || value === null) {
    return DEFAULT_BLOG_STATUS;
  }

  return typeof value === 'string' && BLOG_STATUSES.includes(value as BlogPostStatus)
    ? (value as BlogPostStatus)
    : null;
}

function readPublishedAt(value: unknown): Date | undefined | null {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readTranslation(value: unknown): BlogTranslationInput | BlogPostInputError {
  if (!value || typeof value !== 'object') {
    return { error: 'Each translation must be an object.' };
  }

  const record = value as Record<string, unknown>;
  const locale = typeof record.locale === 'string' ? record.locale : '';

  if (!isBlogLocale(locale)) {
    return { error: 'Translation locale must be en, hy, or ru.' };
  }

  const title = readRequiredString(record.title, TITLE_MAX_LENGTH);
  const excerpt = readRequiredString(record.excerpt, EXCERPT_MAX_LENGTH);
  const content = readRequiredString(record.content, CONTENT_MAX_LENGTH);

  if (!title || !excerpt || !content) {
    return {
      error: `${BLOG_LOCALE_LABELS[locale]} translation requires title, excerpt, and content.`,
    };
  }

  const slug = readOptionalString(record.slug, SLUG_MAX_LENGTH) ?? createBlogSlug(title, locale);

  return {
    locale,
    title,
    excerpt,
    content,
    slug,
    imageAlt: readOptionalString(record.imageAlt, IMAGE_ALT_MAX_LENGTH),
    seoTitle: readOptionalString(record.seoTitle, SEO_TITLE_MAX_LENGTH),
    seoDescription: readOptionalString(record.seoDescription, SEO_DESCRIPTION_MAX_LENGTH),
  };
}

function readTranslations(value: unknown): BlogTranslationInput[] | BlogPostInputError {
  if (!Array.isArray(value) || value.length === 0) {
    return { error: 'At least one translation is required.' };
  }

  const translations: BlogTranslationInput[] = [];
  const seenLocales = new Set<BlogLocale>();

  for (const item of value) {
    const translation = readTranslation(item);

    if ('error' in translation) {
      return translation;
    }

    if (seenLocales.has(translation.locale)) {
      return { error: `Duplicate translation for ${translation.locale}.` };
    }

    seenLocales.add(translation.locale);
    translations.push(translation);
  }

  if (!seenLocales.has('en')) {
    return { error: 'English title, excerpt, and content are required.' };
  }

  return translations;
}

export function parseBlogPostInput(body: unknown): BlogPostInput | BlogPostInputError {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid input' };
  }

  const record = body as Record<string, unknown>;
  const status = readStatus(record.status);

  if (!status) {
    return { error: 'status must be DRAFT or PUBLISHED.' };
  }

  const publishedAt = readPublishedAt(record.publishedAt);

  if (publishedAt === null) {
    return { error: 'publishedAt must be a valid ISO date.' };
  }

  const coverImageUrl = readOptionalString(record.coverImageUrl, COVER_IMAGE_URL_MAX_LENGTH);

  if (record.coverImageUrl !== undefined && record.coverImageUrl !== null && !coverImageUrl) {
    return { error: 'coverImageUrl must be a non-empty URL.' };
  }

  if (coverImageUrl && !isHttpUrl(coverImageUrl)) {
    return { error: 'coverImageUrl must be an http(s) URL.' };
  }

  const translations = readTranslations(record.translations);

  if ('error' in translations) {
    return translations;
  }

  return {
    status,
    publishedAt,
    coverImageUrl,
    translations,
  };
}

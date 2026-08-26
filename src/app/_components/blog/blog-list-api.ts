import { logger } from '@/lib/logger';
import {
  BLOG_CONTENT_TYPE_IDS,
  BLOG_PAGE_SIZE,
  type BlogArticleContentTypeId,
  type BlogArticleListItem,
  type BlogArticleCategoryId,
} from './blog-types';

export type BlogListPage = {
  data: BlogArticleListItem[];
  meta: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
};

const ARTICLE_CATEGORY_IDS = ['insights', 'product', 'engineering', 'design', 'company'] as const;

/** Fetches the next published blog page for listing infinite scroll. */
export async function fetchBlogListPage(offset: number): Promise<BlogListPage | null> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(BLOG_PAGE_SIZE),
  });

  try {
    const response = await fetch(`/api/blog?${params.toString()}`);

    if (!response.ok) {
      logger.error('Failed to load more blog posts.', { status: response.status });
      return null;
    }

    return parseBlogListPage(await response.json());
  } catch (error) {
    logger.error('Failed to load more blog posts.', { error });
    return null;
  }
}

export function parseBlogListPage(value: unknown): BlogListPage | null {
  if (!isRecord(value) || !Array.isArray(value.data) || !isRecord(value.meta)) {
    return null;
  }

  const { offset, limit, total, hasMore } = value.meta;

  if (!isCount(offset) || !isCount(limit) || !isCount(total) || typeof hasMore !== 'boolean') {
    return null;
  }

  const data: BlogArticleListItem[] = [];

  for (const item of value.data) {
    if (!isBlogArticleListItem(item)) {
      return null;
    }

    data.push(item);
  }

  return { data, meta: { offset, limit, total, hasMore } };
}

export function mergeBlogListItems(
  current: BlogArticleListItem[],
  incoming: BlogArticleListItem[],
): BlogArticleListItem[] {
  const seen = new Set(current.map((item) => item.id));
  const extra = incoming.filter((item) => !seen.has(item.id));
  return extra.length === 0 ? current : [...current, ...extra];
}

function isBlogArticleListItem(value: unknown): value is BlogArticleListItem {
  if (!isRecord(value) || !isRecord(value.translations)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    (value.coverImageUrl === null || typeof value.coverImageUrl === 'string') &&
    (value.publishedAt === null || typeof value.publishedAt === 'string') &&
    typeof value.createdAt === 'string' &&
    isArticleCategoryId(value.categoryId) &&
    isArticleContentTypeId(value.contentTypeId)
  );
}

function isArticleCategoryId(value: unknown): value is BlogArticleCategoryId {
  return ARTICLE_CATEGORY_IDS.some((id) => id === value);
}

function isArticleContentTypeId(value: unknown): value is BlogArticleContentTypeId {
  return BLOG_CONTENT_TYPE_IDS.some((id) => id !== 'all' && id === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

'use client';

import { useMemo, useState } from 'react';
import type { HomeLocale } from '../home-messages';
import { resolveBlogArticles, type ResolvedBlogArticle } from './blog-resolve';
import {
  BLOG_PAGE_SIZE,
  type BlogArticleListItem,
  type BlogCategoryId,
} from './blog-types';

export type BlogListingFilters = {
  categoryId: BlogCategoryId;
};

type BlogListingState = {
  filters: BlogListingFilters;
  setCategoryId: (value: BlogCategoryId) => void;
  resetFilters: () => void;
  filtered: ResolvedBlogArticle[];
  visible: ResolvedBlogArticle[];
  hasMore: boolean;
  loadMore: () => void;
};

const INITIAL_FILTERS: BlogListingFilters = {
  categoryId: 'all',
};

function articleTimestamp(article: ResolvedBlogArticle): number {
  return new Date(article.publishedAt ?? article.createdAt).getTime();
}

function matchesCategory(article: ResolvedBlogArticle, categoryId: BlogCategoryId): boolean {
  return categoryId === 'all' || article.categoryId === categoryId;
}

/** Client listing state: resolve, category-filter, and paginate blog articles. */
export function useBlogListing(
  items: BlogArticleListItem[],
  locale: HomeLocale,
): BlogListingState {
  const [filters, setFilters] = useState<BlogListingFilters>(INITIAL_FILTERS);
  const [visibleCount, setVisibleCount] = useState(BLOG_PAGE_SIZE);

  const resolved = useMemo(() => resolveBlogArticles(items, locale), [items, locale]);

  const filtered = useMemo(() => {
    const matched = resolved.filter((article) => matchesCategory(article, filters.categoryId));
    return [...matched].sort((left, right) => articleTimestamp(right) - articleTimestamp(left));
  }, [filters.categoryId, resolved]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return {
    filters,
    setCategoryId: (categoryId) => {
      setFilters({ categoryId });
      setVisibleCount(BLOG_PAGE_SIZE);
    },
    resetFilters: () => {
      setFilters(INITIAL_FILTERS);
      setVisibleCount(BLOG_PAGE_SIZE);
    },
    filtered,
    visible,
    hasMore,
    loadMore: () => setVisibleCount((current) => current + BLOG_PAGE_SIZE),
  };
}

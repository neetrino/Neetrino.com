'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeLocale } from '../home-messages';
import { fetchBlogListPage, mergeBlogListItems } from './blog-list-api';
import { resolveBlogArticles, type ResolvedBlogArticle } from './blog-resolve';
import { type BlogArticleListItem, type BlogCategoryId } from './blog-types';

export type BlogListingFilters = {
  categoryId: BlogCategoryId;
};

const BLOG_LOAD_ROOT_MARGIN = '280px 0px';

type BlogListingState = {
  filters: BlogListingFilters;
  setCategoryId: (value: BlogCategoryId) => void;
  resetFilters: () => void;
  visible: ResolvedBlogArticle[];
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
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

function observeLoadMore(sentinel: HTMLDivElement, onLoadMore: () => void): () => void {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        onLoadMore();
      }
    },
    { rootMargin: BLOG_LOAD_ROOT_MARGIN, threshold: 0 },
  );

  observer.observe(sentinel);
  return () => observer.disconnect();
}

async function loadNextPage(
  offset: number,
  isLoading: { current: boolean },
  setItems: (update: (current: BlogArticleListItem[]) => BlogArticleListItem[]) => void,
  setTotal: (total: number) => void,
): Promise<void> {
  if (isLoading.current) {
    return;
  }

  isLoading.current = true;

  try {
    const page = await fetchBlogListPage(offset);

    if (!page) {
      return;
    }

    setItems((current) => mergeBlogListItems(current, page.data));
    setTotal(page.meta.total);
  } finally {
    isLoading.current = false;
  }
}

/** Client listing state: category-filter and request the next page on scroll. */
export function useBlogListing(
  initialArticles: BlogArticleListItem[],
  initialTotal: number,
  locale: HomeLocale,
): BlogListingState {
  const [filters, setFilters] = useState<BlogListingFilters>(INITIAL_FILTERS);
  const [items, setItems] = useState(initialArticles);
  const [total, setTotal] = useState(initialTotal);
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const resolved = useMemo(() => resolveBlogArticles(items, locale), [items, locale]);

  const visible = useMemo(() => {
    const matched = resolved.filter((article) => matchesCategory(article, filters.categoryId));
    return [...matched].sort((left, right) => articleTimestamp(right) - articleTimestamp(left));
  }, [filters.categoryId, resolved]);

  const hasMore = items.length < total;

  useEffect(() => {
    if (!sentinelNode || !hasMore) {
      return;
    }

    return observeLoadMore(sentinelNode, () => {
      void loadNextPage(items.length, isLoadingRef, setItems, setTotal);
    });
  }, [hasMore, items.length, sentinelNode]);

  return {
    filters,
    setCategoryId: (categoryId) => setFilters({ categoryId }),
    resetFilters: () => setFilters(INITIAL_FILTERS),
    visible,
    hasMore,
    sentinelRef: setSentinelNode,
  };
}

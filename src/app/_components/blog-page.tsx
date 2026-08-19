'use client';

import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { ArticlesGrid } from './blog/articles-grid';
import { BlogCategories } from './blog/blog-categories';
import { BlogFooterCTA } from './blog/blog-footer-cta';
import { BlogHero } from './blog/blog-hero';
import type { BlogArticleListItem } from './blog/blog-types';
import { useBlogListing } from './blog/use-blog-listing';
import './blog.css';

type BlogPageBodyProps = {
  articles: BlogArticleListItem[];
  total: number;
};

function BlogPageBody({ articles, total }: BlogPageBodyProps): React.JSX.Element {
  const { locale } = useHomeI18n();
  const { filters, setCategoryId, resetFilters, visible, hasMore, sentinelRef } = useBlogListing(
    articles,
    total,
    locale,
  );

  return (
    <div className="blog-page">
      <div className="blog-page-inner">
        <BlogHero />
        <BlogCategories activeId={filters.categoryId} onChange={setCategoryId} />
        <ArticlesGrid articles={visible} onResetFilters={resetFilters} />
        {hasMore ? <div ref={sentinelRef} className="blog-load-sentinel" aria-hidden /> : null}
        <BlogFooterCTA />
      </div>
    </div>
  );
}

type BlogPageProps = {
  articles: BlogArticleListItem[];
  total: number;
};

export function BlogPage({ articles, total }: BlogPageProps): React.JSX.Element {
  const { blogCopy } = useHomeI18n();

  return (
    <NeetrinoPageShell mainId="blog-top" srOnlyTitle={blogCopy.srOnlyTitle}>
      <BlogPageBody articles={articles} total={total} />
    </NeetrinoPageShell>
  );
}

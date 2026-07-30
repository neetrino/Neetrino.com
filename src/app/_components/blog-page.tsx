'use client';

import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { ArticlesGrid } from './blog/articles-grid';
import { BlogCategories } from './blog/blog-categories';
import { BlogFooterCTA } from './blog/blog-footer-cta';
import { BlogHero } from './blog/blog-hero';
import { BlogLoadMore } from './blog/blog-load-more';
import type { BlogArticleListItem } from './blog/blog-types';
import { useBlogListing } from './blog/use-blog-listing';
import './blog.css';

type BlogPageBodyProps = {
  articles: BlogArticleListItem[];
};

function BlogPageBody({ articles }: BlogPageBodyProps): React.JSX.Element {
  const { locale } = useHomeI18n();
  const listing = useBlogListing(articles, locale);

  return (
    <div className="blog-page">
      <div className="blog-page-inner">
        <BlogHero />
        <BlogCategories activeId={listing.filters.categoryId} onChange={listing.setCategoryId} />
        <ArticlesGrid articles={listing.visible} onResetFilters={listing.resetFilters} />
        <BlogLoadMore
          visible={listing.visible.length}
          total={listing.filtered.length}
          hasMore={listing.hasMore}
          onLoadMore={listing.loadMore}
        />
        <BlogFooterCTA />
      </div>
    </div>
  );
}

type BlogPageProps = {
  articles: BlogArticleListItem[];
};

export function BlogPage({ articles }: BlogPageProps): React.JSX.Element {
  const { blogCopy } = useHomeI18n();

  return (
    <NeetrinoPageShell mainId="blog-top" srOnlyTitle={blogCopy.srOnlyTitle}>
      <BlogPageBody articles={articles} />
    </NeetrinoPageShell>
  );
}

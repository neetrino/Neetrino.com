'use client';

import { useHomeI18n } from '../home-i18n-provider';
import { ArticleCard } from './article-card';
import type { ResolvedBlogArticle } from './blog-resolve';

type ArticlesGridProps = {
  articles: ResolvedBlogArticle[];
  onResetFilters: () => void;
};

export function ArticlesGrid({ articles, onResetFilters }: ArticlesGridProps): React.JSX.Element {
  const { blogCopy } = useHomeI18n();

  return (
    <section className="blog-grid" aria-labelledby="blog-grid-heading">
      <h2 id="blog-grid-heading" className="blog-section-title">
        {blogCopy.grid.title}
      </h2>
      {articles.length === 0 ? (
        <div className="blog-grid-empty">
          <p>{blogCopy.grid.empty}</p>
          <button type="button" className="blog-text-button" onClick={onResetFilters}>
            {blogCopy.grid.emptyReset}
          </button>
        </div>
      ) : (
        <div className="blog-grid-list">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

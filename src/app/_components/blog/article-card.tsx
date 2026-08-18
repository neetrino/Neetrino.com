'use client';

import Link from 'next/link';
import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { useHomeI18n } from '../home-i18n-provider';
import { formatBlogDate, type ResolvedBlogArticle } from './blog-resolve';

type ArticleCardProps = {
  article: ResolvedBlogArticle;
};

export function ArticleCard({ article }: ArticleCardProps): React.JSX.Element {
  const { blogCopy, locale } = useHomeI18n();
  const dateLabel = formatBlogDate(article.publishedAt ?? article.createdAt, locale);
  const href = `/blog/${article.slug}`;

  return (
    <article className="blog-article-card">
      {article.coverImageUrl ? (
        <Link href={href} className="blog-article-card-media">
          <Image
            src={article.coverImageUrl}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 360px"
            className="blog-article-card-image"
            unoptimized={isRemoteImageUrl(article.coverImageUrl)}
          />
        </Link>
      ) : null}
      <div className="blog-article-card-body">
        <div className="blog-article-card-meta">
          <span>{blogCopy.categories[article.categoryId]}</span>
          {dateLabel ? <time dateTime={article.publishedAt ?? article.createdAt}>{dateLabel}</time> : null}
        </div>
        <h3 className="blog-article-card-title">
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="blog-article-card-excerpt">{article.excerpt}</p>
        <Link href={href} className="blog-article-card-cta">
          {blogCopy.card.readMore}
        </Link>
      </div>
    </article>
  );
}

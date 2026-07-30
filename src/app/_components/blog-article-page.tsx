'use client';

import Link from 'next/link';
import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { ExploreButton } from './home-ui';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { formatBlogDate, resolveBlogArticle, type ResolvedBlogArticle } from './blog/blog-resolve';
import type { BlogArticleListItem } from './blog/blog-types';
import './blog.css';
import './blog-article.css';

const WORDS_PER_MINUTE = 200;

type BlogArticlePageProps = {
  article: BlogArticleListItem;
};

function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function splitContentParagraphs(content: string): string[] {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function BlogArticleBackLink({ label }: { label: string }): React.JSX.Element {
  return (
    <Link href="/blog" className="blog-article-back">
      <svg className="blog-article-back-icon" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M15 18l-6-6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

function BlogArticleHero({
  article,
  categoryLabel,
  typeLabel,
  dateLabel,
  readingLabel,
}: {
  article: ResolvedBlogArticle;
  categoryLabel: string;
  typeLabel: string;
  dateLabel: string;
  readingLabel: string;
}): React.JSX.Element {
  return (
    <header className="blog-article-hero">
      <div className="blog-article-meta">
        <span className="blog-article-chip">{categoryLabel}</span>
        <span className="blog-article-chip blog-article-chip--soft">{typeLabel}</span>
        {dateLabel ? (
          <time dateTime={article.publishedAt ?? article.createdAt}>{dateLabel}</time>
        ) : null}
        <span className="blog-article-reading">{readingLabel}</span>
      </div>
      <h1 className="blog-article-title">{article.title}</h1>
      <p className="blog-article-excerpt">{article.excerpt}</p>
      {article.coverImageUrl ? (
        <div className="blog-article-cover">
          <Image
            src={article.coverImageUrl}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, 1100px"
            className="blog-article-cover-image"
            unoptimized={isRemoteImageUrl(article.coverImageUrl)}
            priority
          />
          <span className="blog-article-cover-glow" aria-hidden />
        </div>
      ) : null}
    </header>
  );
}

function BlogArticleBody({ content }: { content: string }): React.JSX.Element {
  const paragraphs = splitContentParagraphs(content);

  return (
    <div className="blog-article-body">
      <span className="blog-article-rule" aria-hidden />
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`} className="blog-article-paragraph">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function BlogArticleEnd({
  title,
  subtitle,
  cta,
  backLabel,
}: {
  title: string;
  subtitle: string;
  cta: string;
  backLabel: string;
}): React.JSX.Element {
  return (
    <footer className="blog-article-end">
      <div className="blog-article-end-copy">
        <h2 className="blog-article-end-title">{title}</h2>
        <p className="blog-article-end-subtitle">{subtitle}</p>
      </div>
      <div className="blog-article-end-actions">
        <ExploreButton href="/contact" label={cta} />
        <BlogArticleBackLink label={backLabel} />
      </div>
    </footer>
  );
}

export function BlogArticlePage({ article }: BlogArticlePageProps): React.JSX.Element {
  const { blogCopy, locale } = useHomeI18n();
  const resolved = resolveBlogArticle(article, locale);

  if (!resolved || !resolved.content) {
    return (
      <NeetrinoPageShell mainId="blog-top" srOnlyTitle={blogCopy.srOnlyTitle}>
        <div className="blog-page blog-page--article">
          <div className="blog-page-inner blog-article-page">
            <p className="blog-article-missing">{blogCopy.article.unpublished}</p>
            <BlogArticleBackLink label={blogCopy.article.backToBlog} />
          </div>
        </div>
      </NeetrinoPageShell>
    );
  }

  const dateLabel = formatBlogDate(resolved.publishedAt ?? resolved.createdAt, locale);
  const minutes = estimateReadingMinutes(resolved.content);
  const readingLabel = blogCopy.article.readingTime.replace('{minutes}', String(minutes));

  return (
    <NeetrinoPageShell mainId="blog-top" srOnlyTitle={resolved.title}>
      <article className="blog-page blog-page--article">
        <div className="blog-page-inner blog-article-page">
          <BlogArticleBackLink label={blogCopy.article.backToBlog} />
          <BlogArticleHero
            article={resolved}
            categoryLabel={blogCopy.categories[resolved.categoryId]}
            typeLabel={blogCopy.contentTypes[resolved.contentTypeId]}
            dateLabel={dateLabel}
            readingLabel={readingLabel}
          />
          <BlogArticleBody content={resolved.content} />
          <BlogArticleEnd
            title={blogCopy.article.endTitle}
            subtitle={blogCopy.article.endSubtitle}
            cta={blogCopy.article.endCta}
            backLabel={blogCopy.article.backToBlog}
          />
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

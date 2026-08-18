'use client';

import Link from 'next/link';
import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { ExploreButton } from './home-ui';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import {
  groupBlogContentSections,
  parseBlogContent,
  stripBlogMarkup,
  type BlogContentBlock,
} from '@/lib/parse-blog-content';
import { ArticleCard } from './blog/article-card';
import {
  formatBlogDate,
  resolveBlogArticle,
  resolveBlogArticles,
  type ResolvedBlogArticle,
} from './blog/blog-resolve';
import type { BlogArticleListItem } from './blog/blog-types';
import './blog.css';
import './blog-article.css';
import './blog-article-prose.css';

const WORDS_PER_MINUTE = 200;

type BlogArticlePageProps = {
  article: BlogArticleListItem;
  relatedArticles?: BlogArticleListItem[];
};

function estimateReadingMinutes(content: string): number {
  const words = stripBlogMarkup(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
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

function BlogArticleCover({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}): React.JSX.Element | null {
  if (!src) {
    return null;
  }

  return (
    <div className="blog-article-cover">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 767px) 100vw, 1296px"
        className="blog-article-cover-image"
        unoptimized={isRemoteImageUrl(src)}
        priority
      />
      <span className="blog-article-cover-glow" aria-hidden />
      <span className="blog-article-cover-sheen" aria-hidden />
    </div>
  );
}

function BlogArticleHero({
  article,
  kicker,
  categoryLabel,
  typeLabel,
  dateLabel,
  readingLabel,
}: {
  article: ResolvedBlogArticle;
  kicker: string;
  categoryLabel: string;
  typeLabel: string;
  dateLabel: string;
  readingLabel: string;
}): React.JSX.Element {
  const featuredClass = article.coverImageUrl ? ' blog-article-hero--featured' : '';

  return (
    <header className={`blog-article-hero${featuredClass}`}>
      <BlogArticleCover src={article.coverImageUrl} alt={article.imageAlt} />
      <div className="blog-article-hero-panel">
        <p className="blog-article-kicker">{kicker}</p>
        <div className="blog-article-meta">
          <span className="blog-article-chip">{categoryLabel}</span>
          <span className="blog-article-chip blog-article-chip--soft">{typeLabel}</span>
        </div>
        <div className="blog-article-lede">
          <h1 className="blog-article-title">{article.title}</h1>
          <p className="blog-article-excerpt">{article.excerpt}</p>
        </div>
        <p className="blog-article-byline">
          {dateLabel ? (
            <time dateTime={article.publishedAt ?? article.createdAt}>{dateLabel}</time>
          ) : null}
          {dateLabel ? <span className="blog-article-byline-dot" aria-hidden /> : null}
          <span>{readingLabel}</span>
        </p>
      </div>
    </header>
  );
}

function BlogArticleBlock({
  block,
  isLead,
}: {
  block: BlogContentBlock;
  isLead: boolean;
}): React.JSX.Element {
  if (block.type === 'heading') {
    const HeadingTag = block.level === 2 ? 'h2' : 'h3';

    return (
      <HeadingTag className={`blog-article-heading blog-article-heading--h${block.level}`}>
        {block.text}
      </HeadingTag>
    );
  }

  return (
    <p className={isLead ? 'blog-article-paragraph blog-article-paragraph--lead' : 'blog-article-paragraph'}>
      {block.text}
    </p>
  );
}

function BlogArticleBody({ content }: { content: string }): React.JSX.Element {
  const sections = groupBlogContentSections(parseBlogContent(content));

  return (
    <div className="blog-article-body">
      <span className="blog-article-rule" aria-hidden />
      <div className="blog-article-columns">
        {sections.map((section, sectionIndex) => (
          <section
            key={`${section.heading?.text ?? 'lead'}-${sectionIndex}`}
            className="blog-article-section"
          >
            {section.heading ? <BlogArticleBlock block={section.heading} isLead={false} /> : null}
            {section.paragraphs.map((block, paragraphIndex) => (
              <BlogArticleBlock
                key={`${block.text.slice(0, 24)}-${paragraphIndex}`}
                block={block}
                isLead={sectionIndex === 0 && paragraphIndex === 0}
              />
            ))}
          </section>
        ))}
      </div>
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

function BlogArticleRelated({ articles }: { articles: ResolvedBlogArticle[] }): React.JSX.Element | null {
  const { blogCopy } = useHomeI18n();

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="blog-article-related" aria-labelledby="blog-article-related-heading">
      <h2 id="blog-article-related-heading" className="blog-section-title">
        {blogCopy.article.relatedTitle}
      </h2>
      <p className="blog-section-subtitle">{blogCopy.article.relatedSubtitle}</p>
      <div className="blog-grid-list">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

export function BlogArticlePage({
  article,
  relatedArticles = [],
}: BlogArticlePageProps): React.JSX.Element {
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
            kicker={blogCopy.hero.eyebrow}
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
          <BlogArticleRelated articles={resolveBlogArticles(relatedArticles, locale)} />
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

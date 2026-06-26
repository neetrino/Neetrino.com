'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resolveBlogTranslation } from '@/lib/blog-translation';
import type { PublicBlogPostBundle } from '@/lib/public-blog-posts';
import { BLOG_TITLE_HEIGHT, BLOG_TITLE_SRC, BLOG_TITLE_WIDTH } from './blog-constants';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './blog.css';
import './services.css';

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

type LocalizedBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  imageAlt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

function formatBlogDate(post: LocalizedBlogPost): string {
  return BLOG_DATE_FORMATTER.format(post.publishedAt ?? post.createdAt);
}

function BlogCard({ post }: { post: LocalizedBlogPost }): React.JSX.Element {
  const { blogCopy } = useHomeI18n();
  const coverAlt = post.imageAlt ?? blogCopy.list.coverFallbackAlt;
  const initial = post.title.trim().charAt(0).toUpperCase() || 'N';

  return (
    <article className="blog-card">
      <Link href={`/blog/${post.slug}`} className="blog-card-link">
        <div className="blog-card-media">
          {post.coverImageUrl ? (
            <Image
              src={post.coverImageUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 900px) 90vw, 620px"
              className="blog-card-image"
            />
          ) : (
            <span className="blog-card-placeholder" aria-hidden>
              {initial}
            </span>
          )}
        </div>
        <div className="blog-card-body">
          <time className="blog-card-date" dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
            {formatBlogDate(post)}
          </time>
          <h2 className="blog-card-title">{post.title}</h2>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <span className="blog-card-action">{blogCopy.list.readMore}</span>
        </div>
      </Link>
    </article>
  );
}

export function BlogPage({ posts }: { posts: PublicBlogPostBundle[] }): React.JSX.Element {
  const { blogCopy, locale } = useHomeI18n();
  const { hero, list } = blogCopy;
  const localizedPosts = useMemo(
    () =>
      posts.flatMap((post) => {
        const translation = resolveBlogTranslation(post.translations, locale);

        if (!translation) {
          return [];
        }

        return [
          {
            id: post.id,
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            coverImageUrl: post.coverImageUrl,
            imageAlt: translation.imageAlt,
            publishedAt: post.publishedAt,
            createdAt: post.createdAt,
          },
        ];
      }),
    [locale, posts],
  );

  return (
    <NeetrinoPageShell mainId="blog-top" srOnlyTitle={hero.srOnlyTitle}>
      <section className="blog-page" aria-labelledby="blog-heading">
        <div className="blog-page-inner">
          <header className="blog-hero">
            <p className="blog-hero-kicker">{hero.kicker}</p>
            <div className="svc-title-wrap blog-title-wrap">
              <Image
                id="blog-heading"
                src={BLOG_TITLE_SRC}
                alt={hero.title}
                width={BLOG_TITLE_WIDTH}
                height={BLOG_TITLE_HEIGHT}
                sizes="(max-width: 900px) 90vw, 268px"
                priority
                fetchPriority="high"
                className="svc-title"
              />
            </div>
          </header>

          <div className="blog-list" aria-label={list.ariaLabel}>
            {localizedPosts.length > 0 ? (
              localizedPosts.map((post) => <BlogCard key={post.id} post={post} />)
            ) : (
              <p className="blog-empty">{list.empty}</p>
            )}
          </div>
        </div>
      </section>
    </NeetrinoPageShell>
  );
}

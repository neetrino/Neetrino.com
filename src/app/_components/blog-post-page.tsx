'use client';

import { useEffect, useMemo } from 'react';
import { CdnImage as Image } from '@/lib/cdn-image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { resolveBlogTranslation } from '@/lib/blog-translation';
import type { PublicBlogPostBundle } from '@/lib/public-blog-posts';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './blog.css';

const BLOG_DATE_FORMATTER = new Intl.DateTimeFormat('en', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

function BlogArticleContent({ content }: { content: string }): React.JSX.Element {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  return (
    <div className="blog-article-content">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function BlogPostPage({ post }: { post: PublicBlogPostBundle }): React.JSX.Element {
  const { blogCopy, locale } = useHomeI18n();
  const router = useRouter();
  const pathname = usePathname();
  const translation = useMemo(
    () => resolveBlogTranslation(post.translations, locale),
    [locale, post.translations],
  );

  useEffect(() => {
    if (!translation) {
      return;
    }

    const localizedPath = `/blog/${translation.slug}`;

    if (pathname !== localizedPath) {
      router.replace(localizedPath);
    }
  }, [pathname, router, translation]);

  if (!translation) {
    return (
      <NeetrinoPageShell mainId="blog-post-top" srOnlyTitle={blogCopy.hero.srOnlyTitle}>
        <article className="blog-article">
          <div className="blog-article-inner">
            <p className="blog-empty">{blogCopy.list.empty}</p>
          </div>
        </article>
      </NeetrinoPageShell>
    );
  }

  const coverAlt = translation.imageAlt ?? blogCopy.list.coverFallbackAlt;

  return (
    <NeetrinoPageShell mainId="blog-post-top" srOnlyTitle={translation.title}>
      <article className="blog-article">
        <div className="blog-article-inner">
          <Link href="/blog" className="blog-back-link">
            ← {blogCopy.post.backLabel}
          </Link>

          <header className="blog-article-header">
            <time className="blog-article-date" dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
              {BLOG_DATE_FORMATTER.format(post.publishedAt ?? post.createdAt)}
            </time>
            <h1 className="blog-article-title">{translation.title}</h1>
            <p className="blog-article-excerpt">{translation.excerpt}</p>
          </header>

          {post.coverImageUrl ? (
            <div className="blog-article-cover">
              <Image
                src={post.coverImageUrl}
                alt={coverAlt}
                fill
                sizes="(max-width: 900px) 90vw, 820px"
                priority
                className="blog-article-cover-image"
              />
            </div>
          ) : null}

          <BlogArticleContent content={translation.content} />
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

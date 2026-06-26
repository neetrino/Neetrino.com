import { BLOG_LOCALES, type BlogLocale } from '@/lib/blog-locales';

export type AdminBlogPostTranslation = {
  locale: BlogLocale;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
};

export type AdminBlogPost = {
  id: string;
  status: string;
  publishedAt: string | null;
  coverImageUrl: string | null;
  translations: AdminBlogPostTranslation[];
};

type BlogPostRecord = {
  id: string;
  status: string;
  publishedAt: Date | null;
  coverImageUrl: string | null;
  translations: Array<{
    locale: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageAlt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  }>;
};

function formatPublishedAt(value: Date | null): string | null {
  if (!value) {
    return null;
  }

  return value.toISOString().slice(0, 10);
}

function isBlogLocaleValue(value: string): value is BlogLocale {
  return BLOG_LOCALES.includes(value as BlogLocale);
}

/** Serializes a Prisma blog post for client admin components. */
export function serializeAdminBlogPost(post: BlogPostRecord): AdminBlogPost {
  return {
    id: post.id,
    status: post.status,
    publishedAt: formatPublishedAt(post.publishedAt),
    coverImageUrl: post.coverImageUrl,
    translations: post.translations.flatMap((translation) => {
      if (!isBlogLocaleValue(translation.locale)) {
        return [];
      }

      return [
        {
          locale: translation.locale,
          title: translation.title,
          slug: translation.slug,
          excerpt: translation.excerpt,
          content: translation.content,
          imageAlt: translation.imageAlt ?? '',
          seoTitle: translation.seoTitle ?? '',
          seoDescription: translation.seoDescription ?? '',
        },
      ];
    }),
  };
}

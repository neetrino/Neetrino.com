import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import type { BlogPostTranslations } from '@/lib/blog-translation';
import type { BlogLocale } from '@/lib/blog-locales';

export const BLOG_PUBLISHED_STATUS = 'PUBLISHED';

export type PublicBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  imageAlt: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type PublicBlogPost = PublicBlogPostSummary & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PublicBlogPostBundle = {
  id: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  translations: BlogPostTranslations;
};

const PUBLISHED_BLOG_INCLUDE = {
  translations: {
    select: {
      locale: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      imageAlt: true,
      seoTitle: true,
      seoDescription: true,
    },
  },
} as const;

function getPublishedBlogOrder() {
  return [{ publishedAt: 'desc' as const }, { createdAt: 'desc' as const }];
}

function mapTranslations(
  translations: Array<{
    locale: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    imageAlt: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  }>,
): BlogPostTranslations {
  return translations.reduce<BlogPostTranslations>((acc, translation) => {
    acc[translation.locale as BlogLocale] = {
      title: translation.title,
      slug: translation.slug,
      excerpt: translation.excerpt,
      content: translation.content,
      imageAlt: translation.imageAlt,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    };
    return acc;
  }, {});
}

function mapBundle(post: {
  id: string;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
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
}): PublicBlogPostBundle {
  return {
    id: post.id,
    coverImageUrl: post.coverImageUrl,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    translations: mapTranslations(post.translations),
  };
}

export async function getPublishedBlogPostBundles(): Promise<PublicBlogPostBundle[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: BLOG_PUBLISHED_STATUS },
      orderBy: getPublishedBlogOrder(),
      include: PUBLISHED_BLOG_INCLUDE,
    });

    return posts.map(mapBundle);
  } catch (error) {
    logger.error('Failed to load published blog posts.', { error });
    return [];
  }
}

export async function getPublishedBlogPostBundleBySlug(slug: string): Promise<PublicBlogPostBundle | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        status: BLOG_PUBLISHED_STATUS,
        translations: {
          some: { slug },
        },
      },
      include: PUBLISHED_BLOG_INCLUDE,
    });

    return post ? mapBundle(post) : null;
  } catch (error) {
    logger.error('Failed to load published blog post.', { error, slug });
    return null;
  }
}

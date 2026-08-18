import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import type { BlogPostInput } from '@/lib/blog-post-input';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export class BlogPostConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BlogPostConflictError';
  }
}

export type CreatedBlogPost = {
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

function resolvePublishedAt(input: BlogPostInput): Date | undefined {
  if (input.publishedAt) {
    return input.publishedAt;
  }

  return input.status === 'PUBLISHED' ? new Date() : undefined;
}

export async function createBlogPostFromInput(input: BlogPostInput): Promise<CreatedBlogPost> {
  try {
    const post = await prisma.blogPost.create({
      data: {
        coverImageUrl: input.coverImageUrl,
        publishedAt: resolvePublishedAt(input),
        status: input.status,
        translations: {
          create: input.translations.map((translation) => ({
            locale: translation.locale,
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            content: translation.content,
            imageAlt: translation.imageAlt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          })),
        },
      },
      include: {
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
      },
    });

    revalidatePath('/admin/blog');
    revalidatePath('/blog');

    return post;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BlogPostConflictError('A blog post with this slug already exists.');
    }

    logger.error('Failed to create blog post from API input.', { error });
    throw error;
  }
}

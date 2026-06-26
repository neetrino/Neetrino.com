'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { BLOG_LOCALES, BLOG_LOCALE_LABELS, type BlogLocale } from '@/lib/blog-locales';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { deleteR2Object, R2ConfigurationError, uploadR2Object } from '@/lib/r2/storage';
import { requireAdminSession } from '@/lib/admin-session';

const DEFAULT_BLOG_STATUS = 'DRAFT';
const SLUG_SEPARATOR = '-';
const BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;
const BLOG_UPLOAD_PREFIX = 'blog';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/avif', 'image/jpeg', 'image/png', 'image/webp'] as const;

export type BlogActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

type BlogTranslationInput = {
  locale: BlogLocale;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function readRequiredText(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function readOptionalText(formData: FormData, fieldName: string): string | undefined {
  const value = formData.get(fieldName);

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function createSlug(title: string, locale: BlogLocale): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, SLUG_SEPARATOR)
    .replace(/^-|-$/g, '');

  if (slug.length > 0) {
    return slug;
  }

  return `post${SLUG_SEPARATOR}${locale}${SLUG_SEPARATOR}${Date.now()}`;
}

function readBlogStatus(formData: FormData): (typeof BLOG_STATUSES)[number] {
  const value = formData.get('status');

  return BLOG_STATUSES.includes(value as (typeof BLOG_STATUSES)[number])
    ? (value as (typeof BLOG_STATUSES)[number])
    : DEFAULT_BLOG_STATUS;
}

function readPublishedAt(formData: FormData): Date | undefined {
  const value = readOptionalText(formData, 'publishedAt');
  const date = value ? new Date(value) : undefined;

  return date && Number.isNaN(date.getTime()) ? undefined : date;
}

function readOptionalCoverImage(formData: FormData): File | undefined {
  const file = formData.get('coverImage');

  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Cover image must be smaller than 8MB.');
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    throw new Error('Cover image must be AVIF, JPEG, PNG, or WebP.');
  }

  return file;
}

function createCoverObjectKey(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${BLOG_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.${extension}`;
}

function readLocaleTranslation(formData: FormData, locale: BlogLocale): BlogTranslationInput | null {
  const title = readOptionalText(formData, `${locale}_title`);
  const excerpt = readOptionalText(formData, `${locale}_excerpt`);
  const content = readOptionalText(formData, `${locale}_content`);
  const hasAnyField = Boolean(title || excerpt || content);

  if (locale === 'en') {
    if (!title || !excerpt || !content) {
      throw new Error('English title, excerpt, and content are required.');
    }

    return {
      locale,
      title,
      excerpt,
      content,
      slug: readOptionalText(formData, `${locale}_slug`) ?? createSlug(title, locale),
      imageAlt: readOptionalText(formData, `${locale}_imageAlt`),
      seoTitle: readOptionalText(formData, `${locale}_seoTitle`),
      seoDescription: readOptionalText(formData, `${locale}_seoDescription`),
    };
  }

  if (!hasAnyField) {
    return null;
  }

  if (!title || !excerpt || !content) {
    throw new Error(`${BLOG_LOCALE_LABELS[locale]} translation requires title, excerpt, and content.`);
  }

  return {
    locale,
    title,
    excerpt,
    content,
    slug: readOptionalText(formData, `${locale}_slug`) ?? createSlug(title, locale),
    imageAlt: readOptionalText(formData, `${locale}_imageAlt`),
    seoTitle: readOptionalText(formData, `${locale}_seoTitle`),
    seoDescription: readOptionalText(formData, `${locale}_seoDescription`),
  };
}

function readTranslations(formData: FormData): BlogTranslationInput[] {
  return BLOG_LOCALES.flatMap((locale) => {
    const translation = readLocaleTranslation(formData, locale);
    return translation ? [translation] : [];
  });
}

async function uploadCoverImage(file: File): Promise<{ coverImageKey: string; coverImageUrl: string }> {
  const body = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadR2Object({
    key: createCoverObjectKey(file),
    body,
    contentType: file.type,
  });

  return {
    coverImageKey: uploaded.key,
    coverImageUrl: uploaded.url,
  };
}

export async function createBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();

  const translations = readTranslations(formData);
  const coverImage = readOptionalCoverImage(formData);

  let coverImageUrl: string | undefined;
  let coverImageKey: string | undefined;

  try {
    if (coverImage) {
      const uploaded = await uploadCoverImage(coverImage);
      coverImageUrl = uploaded.coverImageUrl;
      coverImageKey = uploaded.coverImageKey;
    }

    await prisma.blogPost.create({
      data: {
        coverImageUrl,
        coverImageKey,
        publishedAt: readPublishedAt(formData),
        status: readBlogStatus(formData),
        translations: {
          create: translations.map((translation) => ({
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
    });
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw new Error('Cloudflare R2 is not configured. Add the R2_* values to .env.local.');
    }

    logger.error('Failed to create blog post.', { error });
    throw error instanceof Error ? error : new Error('Blog post creation failed.');
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

function readBlogPostId(formData: FormData): string {
  return readRequiredText(formData, 'postId');
}

function revalidateBlogPaths(): void {
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

async function replaceCoverImage(
  file: File,
  existingKey: string | null,
): Promise<{ coverImageKey: string; coverImageUrl: string }> {
  const uploaded = await uploadCoverImage(file);

  if (existingKey) {
    try {
      await deleteR2Object({ key: existingKey });
    } catch (error) {
      logger.error('Failed to delete previous blog cover image.', { error, key: existingKey });
    }
  }

  return uploaded;
}

export async function toggleBlogPostStatus(formData: FormData): Promise<void> {
  await requireAdminSession();

  try {
    const postId = readBlogPostId(formData);
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });

    if (!post) {
      throw new Error('Blog post was not found.');
    }

    const nextStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    await prisma.blogPost.update({
      where: { id: postId },
      data: {
        status: nextStatus,
        publishedAt: nextStatus === 'PUBLISHED' ? (post.publishedAt ?? new Date()) : post.publishedAt,
      },
    });
  } catch (error) {
    logger.error('Failed to toggle blog post status.', { error });
    throw error instanceof Error ? error : new Error('Blog post status update failed.');
  }

  revalidateBlogPaths();
}

export async function deleteBlogPost(
  previousState: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  void previousState;

  await requireAdminSession();

  try {
    const postId = readBlogPostId(formData);
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });

    if (!post) {
      return { status: 'error', message: 'Blog post was not found.' };
    }

    if (post.coverImageKey) {
      try {
        await deleteR2Object({ key: post.coverImageKey });
      } catch (error) {
        logger.error('Failed to delete blog cover image.', { error, key: post.coverImageKey });
      }
    }

    await prisma.blogPost.delete({ where: { id: post.id } });
    revalidateBlogPaths();

    return { status: 'success', message: 'Blog post deleted.' };
  } catch (error) {
    logger.error('Failed to delete blog post.', { error });

    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Blog post deletion failed.',
    };
  }
}

export async function updateBlogPost(formData: FormData): Promise<void> {
  await requireAdminSession();

  const postId = readBlogPostId(formData);
  const translations = readTranslations(formData);
  const coverImage = readOptionalCoverImage(formData);

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id: postId } });

    if (!existing) {
      throw new Error('Blog post was not found.');
    }

    let coverImageUrl = existing.coverImageUrl;
    let coverImageKey = existing.coverImageKey;

    if (coverImage) {
      const uploaded = await replaceCoverImage(coverImage, existing.coverImageKey);
      coverImageUrl = uploaded.coverImageUrl;
      coverImageKey = uploaded.coverImageKey;
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.blogPost.update({
        where: { id: postId },
        data: {
          coverImageUrl,
          coverImageKey,
          publishedAt: readPublishedAt(formData),
          status: readBlogStatus(formData),
        },
      });

      for (const translation of translations) {
        await transaction.blogPostTranslation.upsert({
          where: {
            blogPostId_locale: {
              blogPostId: postId,
              locale: translation.locale,
            },
          },
          create: {
            blogPostId: postId,
            locale: translation.locale,
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            content: translation.content,
            imageAlt: translation.imageAlt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          },
          update: {
            title: translation.title,
            slug: translation.slug,
            excerpt: translation.excerpt,
            content: translation.content,
            imageAlt: translation.imageAlt,
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
          },
        });
      }
    });
  } catch (error) {
    if (error instanceof R2ConfigurationError) {
      throw new Error('Cloudflare R2 is not configured. Add the R2_* values to .env.local.');
    }

    logger.error('Failed to update blog post.', { error });
    throw error instanceof Error ? error : new Error('Blog post update failed.');
  }

  revalidateBlogPaths();
}

'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

const DEFAULT_BLOG_STATUS = 'DRAFT';
const SLUG_SEPARATOR = '-';
const BLOG_STATUSES = ['DRAFT', 'PUBLISHED'] as const;

function readRequiredText(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return value.trim();
}

function createSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, SLUG_SEPARATOR)
    .replace(/^-|-$/g, '');

  return `${slug || 'post'}${SLUG_SEPARATOR}${Date.now()}`;
}

function readOptionalText(formData: FormData, fieldName: string): string | undefined {
  const value = formData.get(fieldName);

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
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

export async function createBlogPost(formData: FormData): Promise<void> {
  const title = readRequiredText(formData, 'title');
  const excerpt = readRequiredText(formData, 'excerpt');
  const content = readRequiredText(formData, 'content');
  const slug = readOptionalText(formData, 'slug') ?? createSlug(title);

  await prisma.blogPost.create({
    data: {
      title,
      excerpt,
      content,
      slug,
      coverImageUrl: readOptionalText(formData, 'coverImageUrl'),
      imageAlt: readOptionalText(formData, 'imageAlt'),
      seoTitle: readOptionalText(formData, 'seoTitle'),
      seoDescription: readOptionalText(formData, 'seoDescription'),
      publishedAt: readPublishedAt(formData),
      status: readBlogStatus(formData),
    },
  });

  revalidatePath('/admin/blog');
}

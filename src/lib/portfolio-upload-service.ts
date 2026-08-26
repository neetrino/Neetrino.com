import 'server-only';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import type { PortfolioAsset } from '@prisma/client';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import {
  getPortfolioMediaExtension,
  isPortfolioGifFile,
  isPortfolioVideoFile,
  validatePortfolioMediaFile,
} from '@/lib/portfolio-media';
import { R2ConfigurationError, deleteR2Object, uploadR2ImageAsWebp, uploadR2Object } from '@/lib/r2/storage';

const PORTFOLIO_UPLOAD_PREFIX = 'portfolio';
const PORTFOLIO_ASSET_TYPES = ['IMAGE', 'ANIMATION_IMAGE'] as const;
const PORTFOLIO_REVALIDATE_PATHS = ['/admin/portfolio', '/portfolio', '/'] as const;

function readOptionalText(formData: FormData, fieldName: string): string | undefined {
  const value = formData.get(fieldName);

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function readRequiredText(formData: FormData, fieldName: string, label: string): string {
  const value = readOptionalText(formData, fieldName);

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function readPortfolioStatus(formData: FormData): 'ACTIVE' | 'DRAFT' {
  const value = formData.get('status');

  if (value === 'ACTIVE' || value === 'DRAFT') {
    return value;
  }

  throw new Error('Portfolio status must be ACTIVE or DRAFT.');
}

function readOptionalProjectUrl(formData: FormData): string | null {
  const value = readOptionalText(formData, 'projectUrl');

  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Project link must use http or https.');
    }

    return parsed.toString();
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Project link')) {
      throw error;
    }

    throw new Error('Project link must be a valid URL.');
  }
}

function readAssetType(formData: FormData): (typeof PORTFOLIO_ASSET_TYPES)[number] {
  const value = formData.get('assetType');

  return PORTFOLIO_ASSET_TYPES.includes(value as (typeof PORTFOLIO_ASSET_TYPES)[number])
    ? (value as (typeof PORTFOLIO_ASSET_TYPES)[number])
    : 'IMAGE';
}

function readPortfolioAssetId(formData: FormData): string {
  const value = formData.get('assetId');

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Portfolio asset id is required.');
  }

  return value;
}

function validateMediaFile(file: File): File {
  validatePortfolioMediaFile(file);
  return file;
}

function readMediaFile(formData: FormData): File {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Portfolio media is required.');
  }

  return validateMediaFile(file);
}

function readOptionalMediaFile(formData: FormData): File | null {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return validateMediaFile(file);
}

function createObjectKey(contentType: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const extension = getPortfolioMediaExtension(contentType);

  return `${PORTFOLIO_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.${extension}`;
}

function resolvePortfolioUploadContentType(file: File): string {
  if (file.type) {
    return file.type;
  }

  if (/\.mp4$/i.test(file.name)) {
    return 'video/mp4';
  }

  if (/\.webm$/i.test(file.name)) {
    return 'video/webm';
  }

  if (/\.gif$/i.test(file.name)) {
    return 'image/gif';
  }

  return file.type;
}

async function uploadPortfolioMediaFile(
  file: File,
  body: Buffer,
): Promise<{ key: string; url: string; contentType: string; sizeBytes: number }> {
  const contentType = resolvePortfolioUploadContentType(file);

  if (isPortfolioVideoFile(file) || isPortfolioGifFile(file)) {
    return uploadR2Object({
      key: createObjectKey(contentType),
      body,
      contentType,
    });
  }

  return uploadR2ImageAsWebp({
    key: createObjectKey('image/webp'),
    body,
  });
}

function createTitleFromFile(file: File): string {
  const filename = file.name.replace(/\.[^/.]+$/, '');

  return filename
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function revalidatePortfolioPaths(): void {
  for (const path of PORTFOLIO_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

async function getNextPortfolioSortOrder(): Promise<number> {
  const result = await prisma.portfolioAsset.aggregate({
    _max: { sortOrder: true },
  });

  return (result._max.sortOrder ?? -1) + 1;
}

export function getPortfolioUploadErrorMessage(error: unknown): string {
  if (error instanceof R2ConfigurationError) {
    return 'Cloudflare R2 is not configured. Add the R2_* values to .env.local.';
  }

  return error instanceof Error ? error.message : 'Portfolio media upload failed.';
}

export async function createPortfolioAssetFromFormData(formData: FormData): Promise<void> {
  const media = readMediaFile(formData);
  const title = readOptionalText(formData, 'title') ?? createTitleFromFile(media);
  const alt = readOptionalText(formData, 'alt') ?? `${title} portfolio image`;
  const body = Buffer.from(await media.arrayBuffer());
  const uploaded = await uploadPortfolioMediaFile(media, body);

  await prisma.portfolioAsset.create({
    data: {
      title,
      alt,
      assetType: readAssetType(formData),
      status: readPortfolioStatus(formData),
      projectUrl: readOptionalProjectUrl(formData),
      sortOrder: await getNextPortfolioSortOrder(),
      key: uploaded.key,
      url: uploaded.url,
      contentType: uploaded.contentType,
      sizeBytes: uploaded.sizeBytes,
    },
  });

  revalidatePortfolioPaths();
}

export async function updatePortfolioAssetFromFormData(formData: FormData): Promise<PortfolioAsset> {
  const assetId = readPortfolioAssetId(formData);
  const title = readRequiredText(formData, 'title', 'Title');
  const alt = readRequiredText(formData, 'alt', 'Alt text');
  const assetType = readAssetType(formData);
  const status = readPortfolioStatus(formData);
  const projectUrl = readOptionalProjectUrl(formData);
  const media = readOptionalMediaFile(formData);

  const existing = await prisma.portfolioAsset.findUnique({ where: { id: assetId } });

  if (!existing) {
    throw new Error('Portfolio asset was not found.');
  }

  let mediaData: {
    key?: string;
    url?: string;
    contentType?: string;
    sizeBytes?: number;
  } = {};

  if (media) {
    const body = Buffer.from(await media.arrayBuffer());
    const uploaded = await uploadPortfolioMediaFile(media, body);

    try {
      await deleteR2Object({ key: existing.key });
    } catch (error) {
      logger.error('Failed to delete previous portfolio media from R2.', {
        error,
        assetId,
        key: existing.key,
      });
    }

    mediaData = {
      key: uploaded.key,
      url: uploaded.url,
      contentType: uploaded.contentType,
      sizeBytes: uploaded.sizeBytes,
    };
  }

  const updated = await prisma.portfolioAsset.update({
    where: { id: assetId },
    data: {
      title,
      alt,
      assetType,
      status,
      projectUrl,
      ...mediaData,
    },
  });

  revalidatePortfolioPaths();

  return updated;
}

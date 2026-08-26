import 'server-only';

import { revalidatePath } from 'next/cache';
import type { PortfolioAsset } from '@prisma/client';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import {
  getPortfolioMediaSizeLimitMessage,
  isPortfolioGifFile,
  isPortfolioUploadTransportLimitError,
  isPortfolioVideoFile,
  resolvePortfolioUploadContentType,
  validatePortfolioMediaFile,
} from '@/lib/portfolio-media';
import { createPortfolioObjectKey } from '@/lib/portfolio-object-key';
import { finalizePortfolioDirectUpload } from '@/lib/portfolio-direct-upload';
import { R2ConfigurationError, deleteR2Object, uploadR2ImageAsWebp, uploadR2Object } from '@/lib/r2/storage';

const PORTFOLIO_ASSET_TYPES = ['IMAGE', 'ANIMATION_IMAGE'] as const;
const PORTFOLIO_REVALIDATE_PATHS = ['/admin/portfolio', '/portfolio', '/'] as const;

type UploadedPortfolioMedia = {
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
  fileName: string;
};

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

function readMediaFile(formData: FormData, required: boolean): File | null {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    if (required) {
      throw new Error('Portfolio media is required.');
    }

    return null;
  }

  validatePortfolioMediaFile(file);
  return file;
}

function readDirectUploadRef(formData: FormData): { key: string; token: string } | null {
  const key = formData.get('objectKey');
  const token = formData.get('uploadToken');

  if (typeof key !== 'string' || key.length === 0 || typeof token !== 'string' || token.length === 0) {
    return null;
  }

  return { key, token };
}

async function uploadPortfolioMediaFile(
  file: File,
  body: Buffer,
): Promise<Omit<UploadedPortfolioMedia, 'fileName'>> {
  const contentType = resolvePortfolioUploadContentType(file.name, file.type);

  if (isPortfolioVideoFile(file) || isPortfolioGifFile(file)) {
    return uploadR2Object({
      key: createPortfolioObjectKey(contentType),
      body,
      contentType,
    });
  }

  return uploadR2ImageAsWebp({
    key: createPortfolioObjectKey('image/webp'),
    body,
  });
}

async function resolveUploadedMedia(
  formData: FormData,
  required: boolean,
): Promise<UploadedPortfolioMedia | null> {
  const direct = readDirectUploadRef(formData);

  if (direct) {
    const uploaded = await finalizePortfolioDirectUpload(direct);

    return {
      ...uploaded,
      fileName: readOptionalText(formData, 'fileName') ?? uploaded.key,
    };
  }

  const file = readMediaFile(formData, required);

  if (!file) {
    return null;
  }

  const uploaded = await uploadPortfolioMediaFile(file, Buffer.from(await file.arrayBuffer()));

  return { ...uploaded, fileName: file.name };
}

function createTitleFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^/.]+$/, '')
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

  if (isPortfolioUploadTransportLimitError(error)) {
    return getPortfolioMediaSizeLimitMessage();
  }

  return error instanceof Error ? error.message : 'Portfolio media upload failed.';
}

export async function createPortfolioAssetFromFormData(formData: FormData): Promise<void> {
  const uploaded = await resolveUploadedMedia(formData, true);

  if (!uploaded) {
    throw new Error('Portfolio media is required.');
  }

  const title = readOptionalText(formData, 'title') ?? createTitleFromFileName(uploaded.fileName);
  const alt = readOptionalText(formData, 'alt') ?? `${title} portfolio image`;

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
  const uploaded = await resolveUploadedMedia(formData, false);
  const existing = await prisma.portfolioAsset.findUnique({ where: { id: assetId } });

  if (!existing) {
    throw new Error('Portfolio asset was not found.');
  }

  let mediaData: Partial<Pick<PortfolioAsset, 'key' | 'url' | 'contentType' | 'sizeBytes'>> = {};

  if (uploaded) {
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
      title: readRequiredText(formData, 'title', 'Title'),
      alt: readRequiredText(formData, 'alt', 'Alt text'),
      assetType: readAssetType(formData),
      status: readPortfolioStatus(formData),
      projectUrl: readOptionalProjectUrl(formData),
      ...mediaData,
    },
  });

  revalidatePortfolioPaths();

  return updated;
}

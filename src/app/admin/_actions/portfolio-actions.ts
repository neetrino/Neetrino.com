'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import type { PortfolioAsset } from '@prisma/client';
import { getNextPortfolioAssetStatus } from '@/lib/portfolio-asset-status';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { R2ConfigurationError, deleteR2Object, uploadR2ImageAsWebp } from '@/lib/r2/storage';
import { requireAdminSession } from '@/lib/admin-session';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PORTFOLIO_UPLOAD_PREFIX = 'portfolio';
const PORTFOLIO_ASSET_TYPES = ['IMAGE', 'ANIMATION_IMAGE'] as const;
const SUPPORTED_IMAGE_TYPES = ['image/avif', 'image/jpeg', 'image/png', 'image/webp'] as const;
const PORTFOLIO_REVALIDATE_PATHS = ['/admin/portfolio', '/portfolio', '/'] as const;

export type PortfolioUploadState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export type PortfolioDeleteState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export type PortfolioActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
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

function validateImageFile(file: File): File {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Portfolio image must be smaller than 10MB.');
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    throw new Error('Portfolio image must be AVIF, JPEG, PNG, or WebP.');
  }

  return file;
}

function readImageFile(formData: FormData): File {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Portfolio image is required.');
  }

  return validateImageFile(file);
}

function readOptionalImageFile(formData: FormData): File | null {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return validateImageFile(file);
}

function createObjectKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${PORTFOLIO_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.webp`;
}

function createTitleFromFile(file: File): string {
  const filename = file.name.replace(/\.[^/.]+$/, '');

  return filename
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function readAssetType(formData: FormData): (typeof PORTFOLIO_ASSET_TYPES)[number] {
  const value = formData.get('assetType');

  return PORTFOLIO_ASSET_TYPES.includes(value as (typeof PORTFOLIO_ASSET_TYPES)[number])
    ? (value as (typeof PORTFOLIO_ASSET_TYPES)[number])
    : 'IMAGE';
}

function getUploadErrorMessage(error: unknown): string {
  if (error instanceof R2ConfigurationError) {
    return 'Cloudflare R2 is not configured. Add the R2_* values to .env.local.';
  }

  return error instanceof Error ? error.message : 'Portfolio image upload failed.';
}

function readPortfolioAssetId(formData: FormData): string {
  const value = formData.get('assetId');

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Portfolio image id is required.');
  }

  return value;
}

function readOrderedAssetIds(formData: FormData): string[] {
  const value = formData.get('orderedIds');

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Portfolio order is required.');
  }

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string' || item.trim().length === 0)) {
    throw new Error('Portfolio order must be a list of asset ids.');
  }

  return parsed;
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

export async function uploadPortfolioImage(
  previousState: PortfolioUploadState,
  formData: FormData,
): Promise<PortfolioUploadState> {
  void previousState;

  await requireAdminSession();

  try {
    const image = readImageFile(formData);
    const title = readOptionalText(formData, 'title') ?? createTitleFromFile(image);
    const alt = readOptionalText(formData, 'alt') ?? `${title} portfolio image`;
    const body = Buffer.from(await image.arrayBuffer());
    const uploaded = await uploadR2ImageAsWebp({
      key: createObjectKey(),
      body,
    });

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

    return { status: 'success', message: 'Portfolio image uploaded.' };
  } catch (error) {
    logger.error('Failed to upload portfolio image.', { error });

    return { status: 'error', message: getUploadErrorMessage(error) };
  }
}

export async function deletePortfolioImage(
  previousState: PortfolioDeleteState,
  formData: FormData,
): Promise<PortfolioDeleteState> {
  void previousState;

  await requireAdminSession();

  try {
    const assetId = readPortfolioAssetId(formData);
    const asset = await prisma.portfolioAsset.findUnique({ where: { id: assetId } });

    if (!asset) {
      return { status: 'error', message: 'Portfolio image was not found.' };
    }

    await deleteR2Object({ key: asset.key });
    await prisma.portfolioAsset.delete({ where: { id: asset.id } });
    revalidatePortfolioPaths();

    return { status: 'success', message: 'Portfolio image deleted.' };
  } catch (error) {
    logger.error('Failed to delete portfolio image.', { error });

    return { status: 'error', message: getUploadErrorMessage(error) };
  }
}

export async function reorderPortfolioAssets(formData: FormData): Promise<PortfolioActionState> {
  await requireAdminSession();

  try {
    const orderedIds = readOrderedAssetIds(formData);
    const assets = await prisma.portfolioAsset.findMany({
      select: { id: true },
    });

    if (orderedIds.length !== assets.length) {
      return { status: 'error', message: 'Portfolio order is incomplete.' };
    }

    const knownIds = new Set(assets.map((asset) => asset.id));

    if (orderedIds.some((id) => !knownIds.has(id))) {
      return { status: 'error', message: 'Portfolio order contains unknown assets.' };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.portfolioAsset.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    revalidatePortfolioPaths();

    return { status: 'success', message: 'Portfolio order updated.' };
  } catch (error) {
    logger.error('Failed to reorder portfolio assets.', { error });

    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Portfolio reorder failed.',
    };
  }
}

export async function togglePortfolioAssetStatus(formData: FormData): Promise<PortfolioActionState> {
  await requireAdminSession();

  try {
    const assetId = readPortfolioAssetId(formData);
    const asset = await prisma.portfolioAsset.findUnique({ where: { id: assetId } });

    if (!asset) {
      return { status: 'error', message: 'Portfolio asset was not found.' };
    }

    await prisma.portfolioAsset.update({
      where: { id: asset.id },
      data: { status: getNextPortfolioAssetStatus(asset.status) },
    });

    revalidatePortfolioPaths();

    return { status: 'success', message: 'Portfolio visibility updated.' };
  } catch (error) {
    logger.error('Failed to toggle portfolio asset status.', { error });

    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Portfolio visibility update failed.',
    };
  }
}

export async function updatePortfolioAsset(formData: FormData): Promise<PortfolioAsset> {
  await requireAdminSession();

  const assetId = readPortfolioAssetId(formData);
  const title = readRequiredText(formData, 'title', 'Title');
  const alt = readRequiredText(formData, 'alt', 'Alt text');
  const assetType = readAssetType(formData);
  const status = readPortfolioStatus(formData);
  const projectUrl = readOptionalProjectUrl(formData);
  const image = readOptionalImageFile(formData);

  try {
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

    if (image) {
      const body = Buffer.from(await image.arrayBuffer());
      const uploaded = await uploadR2ImageAsWebp({
        key: createObjectKey(),
        body,
      });

      try {
        await deleteR2Object({ key: existing.key });
      } catch (error) {
        logger.error('Failed to delete previous portfolio image from R2.', {
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
  } catch (error) {
    logger.error('Failed to update portfolio asset.', { error, assetId });
    throw error instanceof Error ? error : new Error('Portfolio asset update failed.');
  }
}

'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { getNextPortfolioAssetStatus } from '@/lib/portfolio-asset-status';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { R2ConfigurationError, deleteR2Object, uploadR2Object } from '@/lib/r2/storage';
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

function readImageFile(formData: FormData): File {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Portfolio image is required.');
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Portfolio image must be smaller than 10MB.');
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    throw new Error('Portfolio image must be AVIF, JPEG, PNG, or WebP.');
  }

  return file;
}

function createObjectKey(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'webp';
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${PORTFOLIO_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.${extension}`;
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
    const uploaded = await uploadR2Object({
      key: createObjectKey(image),
      body,
      contentType: image.type,
    });

    await prisma.portfolioAsset.create({
      data: {
        title,
        alt,
        assetType: readAssetType(formData),
        sortOrder: await getNextPortfolioSortOrder(),
        key: uploaded.key,
        url: uploaded.url,
        contentType: image.type,
        sizeBytes: image.size,
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

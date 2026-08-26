'use server';

import { revalidatePath } from 'next/cache';
import type { PortfolioAsset } from '@prisma/client';
import { getNextPortfolioAssetStatus } from '@/lib/portfolio-asset-status';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import {
  createPortfolioAssetFromFormData,
  getPortfolioUploadErrorMessage,
  updatePortfolioAssetFromFormData,
} from '@/lib/portfolio-upload-service';
import { deleteR2Object } from '@/lib/r2/storage';
import { requireAdminSession } from '@/lib/admin-session';

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

export async function uploadPortfolioImage(
  previousState: PortfolioUploadState,
  formData: FormData,
): Promise<PortfolioUploadState> {
  void previousState;

  await requireAdminSession();

  try {
    await createPortfolioAssetFromFormData(formData);

    return { status: 'success', message: 'Portfolio media uploaded.' };
  } catch (error) {
    logger.error('Failed to upload portfolio media.', { error });

    return { status: 'error', message: getPortfolioUploadErrorMessage(error) };
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

    return { status: 'error', message: getPortfolioUploadErrorMessage(error) };
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

  try {
    return await updatePortfolioAssetFromFormData(formData);
  } catch (error) {
    logger.error('Failed to update portfolio asset.', { error });
    throw error instanceof Error ? error : new Error('Portfolio asset update failed.');
  }
}

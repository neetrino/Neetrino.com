'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { R2ConfigurationError, deleteR2Object, uploadR2ImageAsWebp } from '@/lib/r2/storage';
import { requireAdminSession } from '@/lib/admin-session';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const PARTNER_UPLOAD_PREFIX = 'partners';
const SUPPORTED_IMAGE_TYPES = ['image/avif', 'image/jpeg', 'image/png', 'image/webp'] as const;
const PARTNER_REVALIDATE_PATHS = ['/admin/partners', '/'] as const;

export type PartnerUploadState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

export type PartnerDeleteState = {
  status: 'idle' | 'success' | 'error';
  message: string;
};

function readOptionalText(formData: FormData, fieldName: string): string | undefined {
  const value = formData.get(fieldName);

  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function createObjectKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${PARTNER_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.webp`;
}

function createNameFromFile(file: File): string {
  const filename = file.name.replace(/\.[^/.]+$/, '');

  return filename
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function validateImageFile(file: File): File {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Partner image must be smaller than 10MB.');
  }

  if (!SUPPORTED_IMAGE_TYPES.includes(file.type as (typeof SUPPORTED_IMAGE_TYPES)[number])) {
    throw new Error('Partner image must be AVIF, JPEG, PNG, or WebP.');
  }

  return file;
}

function readImageFile(formData: FormData): File {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    throw new Error('Partner image is required.');
  }

  return validateImageFile(file);
}

function readPartnerId(formData: FormData): string {
  const value = formData.get('partnerId');

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('Partner id is required.');
  }

  return value;
}

function getUploadErrorMessage(error: unknown): string {
  if (error instanceof R2ConfigurationError) {
    return 'Cloudflare R2 is not configured. Add the R2_* values to .env.local.';
  }

  return error instanceof Error ? error.message : 'Partner image upload failed.';
}

function revalidatePartnerPaths(): void {
  for (const path of PARTNER_REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

function isManagedPartnerUploadKey(key: string): boolean {
  return key.startsWith(`${PARTNER_UPLOAD_PREFIX}/`);
}

async function deleteManagedPartnerObject(key: string, partnerId: string): Promise<void> {
  if (!isManagedPartnerUploadKey(key)) {
    return;
  }

  try {
    await deleteR2Object({ key });
  } catch (error) {
    logger.error('Failed to delete partner image from R2.', {
      error,
      partnerId,
      key,
    });
  }
}

async function getNextPartnerSortOrder(): Promise<number> {
  const result = await prisma.partner.aggregate({
    _max: { sortOrder: true },
  });

  return (result._max.sortOrder ?? -1) + 1;
}

export async function uploadPartnerImage(
  previousState: PartnerUploadState,
  formData: FormData,
): Promise<PartnerUploadState> {
  void previousState;

  await requireAdminSession();

  try {
    const image = readImageFile(formData);
    const name = readOptionalText(formData, 'name') ?? createNameFromFile(image);
    const alt = readOptionalText(formData, 'alt') ?? name;
    const sortOrder = await getNextPartnerSortOrder();
    const key = createObjectKey();
    const uploaded = await uploadR2ImageAsWebp({
      key,
      body: Buffer.from(await image.arrayBuffer()),
    });

    await prisma.partner.create({
      data: {
        name,
        alt,
        status: 'ACTIVE',
        sortOrder,
        key: uploaded.key,
        url: uploaded.url,
        contentType: uploaded.contentType,
        sizeBytes: uploaded.sizeBytes,
      },
    });

    revalidatePartnerPaths();

    return { status: 'success', message: 'Partner uploaded.' };
  } catch (error) {
    logger.error('Partner image upload failed.', { error });

    return { status: 'error', message: getUploadErrorMessage(error) };
  }
}

export async function deletePartnerImage(
  previousState: PartnerDeleteState,
  formData: FormData,
): Promise<PartnerDeleteState> {
  void previousState;

  await requireAdminSession();

  try {
    const partnerId = readPartnerId(formData);
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });

    if (!partner) {
      throw new Error('Partner not found.');
    }

    await deleteManagedPartnerObject(partner.key, partner.id);
    await prisma.partner.delete({ where: { id: partner.id } });
    revalidatePartnerPaths();

    return { status: 'success', message: 'Partner deleted.' };
  } catch (error) {
    logger.error('Partner delete failed.', { error });

    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Partner delete failed.',
    };
  }
}

export async function updatePartnerImage(
  previousState: PartnerUploadState,
  formData: FormData,
): Promise<PartnerUploadState> {
  void previousState;

  await requireAdminSession();

  try {
    const partnerId = readPartnerId(formData);
    const image = readImageFile(formData);
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });

    if (!partner) {
      throw new Error('Partner not found.');
    }

    const name = readOptionalText(formData, 'name') ?? createNameFromFile(image);
    const alt = readOptionalText(formData, 'alt') ?? name;
    const key = createObjectKey();
    const uploaded = await uploadR2ImageAsWebp({
      key,
      body: Buffer.from(await image.arrayBuffer()),
    });
    const previousKey = partner.key;

    await prisma.partner.update({
      where: { id: partner.id },
      data: {
        name,
        alt,
        key: uploaded.key,
        url: uploaded.url,
        contentType: uploaded.contentType,
        sizeBytes: uploaded.sizeBytes,
      },
    });

    await deleteManagedPartnerObject(previousKey, partner.id);
    revalidatePartnerPaths();

    return { status: 'success', message: 'Partner updated.' };
  } catch (error) {
    logger.error('Partner image update failed.', { error });

    return { status: 'error', message: getUploadErrorMessage(error) };
  }
}

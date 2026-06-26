'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin-session';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const PRODUCT_TYPES = ['ONE_TIME', 'PERMANENT'] as const;
const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
const SECRET_SLUG_BYTES = 24;

export type ProductType = (typeof PRODUCT_TYPES)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  priceAmd: number;
  type: ProductType;
  status: ProductStatus;
  secretSlug: string;
  createdAt: string;
  updatedAt: string;
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

function readPriceAmd(formData: FormData): number {
  const value = readRequiredText(formData, 'priceAmd');
  const price = Number(value);

  if (!Number.isInteger(price) || price <= 0) {
    throw new Error('Price must be a positive AMD amount.');
  }

  return price;
}

function readProductType(formData: FormData): ProductType {
  const value = formData.get('type');

  return PRODUCT_TYPES.includes(value as ProductType) ? (value as ProductType) : 'ONE_TIME';
}

function readProductStatus(formData: FormData): ProductStatus {
  const value = formData.get('status');

  return PRODUCT_STATUSES.includes(value as ProductStatus) ? (value as ProductStatus) : 'ACTIVE';
}

function serializeProduct(product: {
  id: string;
  name: string;
  description: string | null;
  priceAmd: number;
  type: string;
  status: string;
  secretSlug: string;
  createdAt: Date;
  updatedAt: Date;
}): AdminProduct {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    priceAmd: product.priceAmd,
    type: PRODUCT_TYPES.includes(product.type as ProductType) ? (product.type as ProductType) : 'ONE_TIME',
    status: PRODUCT_STATUSES.includes(product.status as ProductStatus) ? (product.status as ProductStatus) : 'ACTIVE',
    secretSlug: product.secretSlug,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

async function createUniqueSecretSlug(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const secretSlug = randomBytes(SECRET_SLUG_BYTES).toString('base64url');
    const existing = await prisma.paymentProduct.findUnique({ where: { secretSlug } });

    if (!existing) {
      return secretSlug;
    }
  }

  throw new Error('Could not generate a unique product URL.');
}

function revalidateProductPaths(secretSlug?: string): void {
  revalidatePath('/admin/products');

  if (secretSlug) {
    revalidatePath(`/p/${secretSlug}`);
  }
}

export async function createPaymentProduct(formData: FormData): Promise<AdminProduct> {
  await requireAdminSession();

  try {
    const product = await prisma.paymentProduct.create({
      data: {
        name: readRequiredText(formData, 'name'),
        description: readOptionalText(formData, 'description'),
        priceAmd: readPriceAmd(formData),
        type: readProductType(formData),
        secretSlug: await createUniqueSecretSlug(),
      },
    });

    revalidateProductPaths(product.secretSlug);

    return serializeProduct(product);
  } catch (error) {
    logger.error('Failed to create payment product.', { error });
    throw error instanceof Error ? error : new Error('Product creation failed.');
  }
}

export async function updatePaymentProduct(formData: FormData): Promise<AdminProduct> {
  await requireAdminSession();

  try {
    const productId = readRequiredText(formData, 'productId');
    const product = await prisma.paymentProduct.update({
      where: { id: productId },
      data: {
        name: readRequiredText(formData, 'name'),
        description: readOptionalText(formData, 'description'),
        priceAmd: readPriceAmd(formData),
        type: readProductType(formData),
        status: readProductStatus(formData),
      },
    });

    revalidateProductPaths(product.secretSlug);

    return serializeProduct(product);
  } catch (error) {
    logger.error('Failed to update payment product.', { error });
    throw error instanceof Error ? error : new Error('Product update failed.');
  }
}

export async function deactivatePaymentProduct(formData: FormData): Promise<AdminProduct> {
  await requireAdminSession();

  try {
    const productId = readRequiredText(formData, 'productId');
    const product = await prisma.paymentProduct.update({
      where: { id: productId },
      data: { status: 'INACTIVE' },
    });

    revalidateProductPaths(product.secretSlug);

    return serializeProduct(product);
  } catch (error) {
    logger.error('Failed to deactivate payment product.', { error });
    throw error instanceof Error ? error : new Error('Product deactivation failed.');
  }
}

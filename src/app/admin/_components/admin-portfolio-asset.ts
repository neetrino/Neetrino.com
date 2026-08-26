import type { PortfolioAsset } from '@prisma/client';

export type AdminPortfolioAsset = {
  id: string;
  title: string;
  alt: string;
  url: string;
  assetType: string;
  status: string;
  sortOrder: number;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  projectUrl: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readRequiredString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function readNullableString(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }

  return typeof value === 'string' ? value : undefined;
}

function readFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toCreatedAtIso(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  if (typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value))) {
    return value;
  }

  return null;
}

export function serializeAdminPortfolioAsset(asset: PortfolioAsset): AdminPortfolioAsset {
  const createdAt = toCreatedAtIso(asset.createdAt);

  if (!createdAt) {
    throw new Error('Portfolio asset createdAt is invalid.');
  }

  return {
    id: asset.id,
    title: asset.title,
    alt: asset.alt,
    url: asset.url,
    assetType: asset.assetType,
    status: asset.status,
    sortOrder: asset.sortOrder,
    contentType: asset.contentType,
    sizeBytes: asset.sizeBytes,
    createdAt,
    projectUrl: asset.projectUrl,
  };
}

/** Parses a JSON portfolio asset from the admin API. Dates arrive as ISO strings. */
export function parseAdminPortfolioAsset(value: unknown): AdminPortfolioAsset | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const title = readRequiredString(value.title);
  const alt = readRequiredString(value.alt);
  const url = readRequiredString(value.url);
  const assetType = readRequiredString(value.assetType);
  const status = readRequiredString(value.status);
  const contentType = readRequiredString(value.contentType);
  const sortOrder = readFiniteNumber(value.sortOrder);
  const sizeBytes = readFiniteNumber(value.sizeBytes);
  const createdAt = toCreatedAtIso(value.createdAt);
  const projectUrl = readNullableString(value.projectUrl);

  if (
    !id ||
    !title ||
    !alt ||
    !url ||
    !assetType ||
    !status ||
    !contentType ||
    sortOrder === null ||
    sizeBytes === null ||
    !createdAt ||
    projectUrl === undefined
  ) {
    return null;
  }

  return {
    id,
    title,
    alt,
    url,
    assetType,
    status,
    sortOrder,
    contentType,
    sizeBytes,
    createdAt,
    projectUrl,
  };
}

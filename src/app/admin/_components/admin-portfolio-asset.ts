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

export function serializeAdminPortfolioAsset(asset: PortfolioAsset): AdminPortfolioAsset {
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
    createdAt: asset.createdAt.toISOString(),
    projectUrl: asset.projectUrl,
  };
}

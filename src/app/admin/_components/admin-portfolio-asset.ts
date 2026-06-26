import type { PortfolioAsset } from '@prisma/client';

export type AdminPortfolioAsset = {
  id: string;
  title: string;
  alt: string;
  url: string;
  assetType: string;
  status: string;
  sortOrder: number;
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
  };
}

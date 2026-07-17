import { resolvePortfolioProjectHref } from '@/app/_components/portfolio-data';
import type { AdminPortfolioAsset } from './admin-portfolio-asset';

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;

export type PortfolioSheetFormValues = {
  title: string;
  alt: string;
  assetType: string;
  status: string;
  projectUrl: string;
};

export function formatPortfolioFileSize(sizeBytes: number): string {
  if (sizeBytes < BYTES_PER_KB) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < BYTES_PER_MB) {
    return `${(sizeBytes / BYTES_PER_KB).toFixed(1)} KB`;
  }

  return `${(sizeBytes / BYTES_PER_MB).toFixed(1)} MB`;
}

export function formatPortfolioCreatedAt(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function createPortfolioSheetFormValues(asset: AdminPortfolioAsset): PortfolioSheetFormValues {
  return {
    title: asset.title,
    alt: asset.alt,
    assetType: asset.assetType,
    status: asset.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE',
    projectUrl: resolvePortfolioProjectHref(asset.title, asset.alt, asset.projectUrl) ?? '',
  };
}

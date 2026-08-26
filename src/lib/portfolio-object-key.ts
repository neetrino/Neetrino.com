import { randomUUID } from 'node:crypto';
import { getPortfolioMediaExtension } from '@/lib/portfolio-media';

const PORTFOLIO_UPLOAD_PREFIX = 'portfolio';
const PORTFOLIO_OBJECT_KEY_PATTERN =
  /^portfolio\/\d{4}\/\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i;

export function createPortfolioObjectKey(contentType: string): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const extension = getPortfolioMediaExtension(contentType);

  return `${PORTFOLIO_UPLOAD_PREFIX}/${year}/${month}/${randomUUID()}.${extension}`;
}

export function isPortfolioObjectKey(key: string): boolean {
  return PORTFOLIO_OBJECT_KEY_PATTERN.test(key);
}

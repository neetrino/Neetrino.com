import type { ServiceIconKey } from './services-data';
import { staticAsset } from '@/lib/static-asset';

/** Service detail visuals on R2 CDN (`static/services/*.webp`). */
export const SERVICE_DETAIL_IMAGES: Record<ServiceIconKey, string> = {
  saas: staticAsset('/services/detail-saas.webp'),
  crm: staticAsset('/services/detail-crm.webp'),
  website: staticAsset('/services/detail-website.webp'),
  mobile: staticAsset('/services/detail-mobile.webp'),
  ai: staticAsset('/services/detail-ai.webp'),
  erp: staticAsset('/services/detail-erp.webp'),
};

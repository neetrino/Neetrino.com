import type { Partner } from '@prisma/client';

export type AdminPartner = {
  id: string;
  name: string;
  alt: string;
  url: string;
  status: string;
  sortOrder: number;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
};

export function serializeAdminPartner(partner: Partner): AdminPartner {
  return {
    id: partner.id,
    name: partner.name,
    alt: partner.alt,
    url: partner.url,
    status: partner.status,
    sortOrder: partner.sortOrder,
    contentType: partner.contentType,
    sizeBytes: partner.sizeBytes,
    createdAt: partner.createdAt.toISOString(),
  };
}

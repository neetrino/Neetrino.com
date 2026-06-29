import { AdminPageHeader } from '../_components/admin-page-header';
import { ProductManager } from '../_components/product-manager';
import type { AdminProduct, ProductStatus, ProductType } from '../_actions/product-actions';
import { resolveAppUrl } from '@/lib/app-url';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const PRODUCT_TYPES = ['ONE_TIME', 'PERMANENT'] as const;
const PRODUCT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;

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

async function getProducts(): Promise<AdminProduct[]> {
  try {
    const products = await prisma.paymentProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map(serializeProduct);
  } catch (error) {
    logger.error('Failed to load admin products.', { error });
    return [];
  }
}

export default async function AdminProductsPage(): Promise<React.JSX.Element> {
  const [products, appUrl] = await Promise.all([getProducts(), resolveAppUrl()]);

  return (
    <>
      <AdminPageHeader sectionKey="products" />
      <ProductManager appUrl={appUrl} initialProducts={products} />
    </>
  );
}

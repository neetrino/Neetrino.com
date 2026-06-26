import { AdminPageHeader } from '../_components/admin-page-header';
import { serializeAdminPortfolioAsset } from '../_components/admin-portfolio-asset';
import { PortfolioAssetList } from '../_components/portfolio-asset-list';
import { PortfolioUploadButton } from '../_components/portfolio-upload-button';
import { deletePortfolioImage, uploadPortfolioImage } from '../_actions/portfolio-actions';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const PORTFOLIO_ADMIN_DESCRIPTION =
  'Upload images, WebM animations, or GIF fallbacks. Reorder cards and toggle visibility. Slots update automatically. Recommended: WebM for better performance. GIF is supported as fallback. Max 10 MB.';

async function getPortfolioAssets() {
  try {
    return await prisma.portfolioAsset.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    logger.error('Failed to load admin portfolio assets.', { error });
    return [];
  }
}

export default async function AdminPortfolioPage(): Promise<React.JSX.Element> {
  const assets = await getPortfolioAssets();
  const adminAssets = assets.map(serializeAdminPortfolioAsset);

  return (
    <>
      <AdminPageHeader title="Portfolio" description={PORTFOLIO_ADMIN_DESCRIPTION}>
        <div className="admin-header-actions">
          <PortfolioUploadButton
            action={uploadPortfolioImage}
            assetType="IMAGE"
            label="Upload animation / image"
          />
        </div>
      </AdminPageHeader>
      {adminAssets.length > 0 ? (
        <PortfolioAssetList assets={adminAssets} deleteAction={deletePortfolioImage} />
      ) : (
        <div className="admin-empty">No portfolio assets yet. Upload the first item from the button above.</div>
      )}
    </>
  );
}

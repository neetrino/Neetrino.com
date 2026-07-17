import { AdminPageHeader } from '../_components/admin-page-header';
import { AdminText } from '../_components/admin-text';
import { serializeAdminPortfolioAsset } from '../_components/admin-portfolio-asset';
import { PortfolioAssetList } from '../_components/portfolio-asset-list';
import { PortfolioUploadButton } from '../_components/portfolio-upload-button';
import { deletePortfolioImage } from '../_actions/portfolio-actions';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
      <AdminPageHeader sectionKey="portfolio" />
      <div className="admin-portfolio-toolbar">
        <div className="admin-header-actions">
          <PortfolioUploadButton labelPath="portfolio.upload" />
        </div>
      </div>
      {adminAssets.length > 0 ? (
        <PortfolioAssetList assets={adminAssets} deleteAction={deletePortfolioImage} />
      ) : (
        <div className="admin-empty">
          <AdminText path="portfolio.empty" />
        </div>
      )}
    </>
  );
}

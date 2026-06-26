import Image from 'next/image';
import { AdminPageHeader } from '../_components/admin-page-header';
import { PortfolioDeleteButton } from '../_components/portfolio-delete-button';
import { PortfolioUploadButton } from '../_components/portfolio-upload-button';
import { deletePortfolioImage, uploadPortfolioImage } from '../_actions/portfolio-actions';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const BYTE_UNIT = 1024;
const IMAGE_SIZE_LABEL_DIGITS = 1;

async function getPortfolioAssets() {
  try {
    return await prisma.portfolioAsset.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    logger.error('Failed to load admin portfolio assets.', { error });
    return [];
  }
}

function formatImageSize(sizeBytes: number): string {
  return `${(sizeBytes / BYTE_UNIT / BYTE_UNIT).toFixed(IMAGE_SIZE_LABEL_DIGITS)} MB`;
}

export default async function AdminPortfolioPage(): Promise<React.JSX.Element> {
  const assets = await getPortfolioAssets();

  return (
    <>
      <AdminPageHeader title="Portfolio" description="Upload and manage portfolio images from the admin panel.">
        <div className="admin-header-actions">
          <PortfolioUploadButton action={uploadPortfolioImage} assetType="IMAGE" label="Upload" />
        </div>
      </AdminPageHeader>
      {assets.length > 0 ? (
        <section className="admin-gallery" aria-label="Portfolio assets">
          {assets.map((asset) => (
            <article key={asset.id} className="admin-gallery-card">
              <Image src={asset.url} alt={asset.alt} width={380} height={285} sizes="260px" />
              <div>
                <h2>{asset.title}</h2>
                <p>
                  {asset.assetType === 'ANIMATION_IMAGE' ? 'Animation image' : 'Image'} / {formatImageSize(asset.sizeBytes)}
                </p>
                <PortfolioDeleteButton action={deletePortfolioImage} assetId={asset.id} assetTitle={asset.title} />
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="admin-empty">No portfolio images yet. Upload the first image from the left panel.</div>
      )}
    </>
  );
}

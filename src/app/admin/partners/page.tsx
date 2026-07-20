import { AdminPageHeader } from '../_components/admin-page-header';
import { AdminText } from '../_components/admin-text';
import { serializeAdminPartner } from '../_components/admin-partner';
import { PartnerList } from '../_components/partner-list';
import { PartnerUploadButton } from '../_components/partner-upload-button';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

async function getPartners() {
  try {
    return await prisma.partner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  } catch (error) {
    logger.error('Failed to load admin partners.', { error });
    return [];
  }
}

export default async function AdminPartnersPage(): Promise<React.JSX.Element> {
  const partners = await getPartners();
  const adminPartners = partners.map(serializeAdminPartner);

  return (
    <>
      <AdminPageHeader sectionKey="partners" />
      <div className="admin-portfolio-toolbar">
        <div className="admin-header-actions">
          <PartnerUploadButton />
        </div>
      </div>
      {adminPartners.length > 0 ? (
        <PartnerList partners={adminPartners} />
      ) : (
        <div className="admin-empty">
          <AdminText path="partners.empty" />
        </div>
      )}
    </>
  );
}

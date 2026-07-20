'use client';

import { useState } from 'react';
import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { deletePartnerImage } from '../_actions/partner-actions';
import type { AdminPartner } from './admin-partner';
import { PartnerDeleteButton } from './partner-delete-button';
import { PartnerUploadSheet } from './partner-upload-sheet';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';

type PartnerListProps = {
  partners: AdminPartner[];
};

export function PartnerList({ partners }: PartnerListProps): React.JSX.Element {
  const { copy } = useAdminI18n();
  const [editingPartner, setEditingPartner] = useState<AdminPartner | null>(null);

  return (
    <>
      <ul className="admin-portfolio-list" aria-label={copy.partners.listAria}>
        {partners.map((partner) => (
          <li key={partner.id} className="admin-portfolio-row admin-portfolio-row--logo-only">
            <div className="admin-portfolio-thumb-wrap">
              <Image
                src={partner.url}
                alt={partner.alt}
                width={72}
                height={72}
                sizes="72px"
                unoptimized={isRemoteImageUrl(partner.url)}
                className="admin-portfolio-thumb"
              />
            </div>
            <div className="admin-portfolio-actions">
              <button
                type="button"
                className="admin-secondary-button"
                aria-label={formatAdminMessage(copy.partners.editAria, { name: partner.name })}
                onClick={() => setEditingPartner(partner)}
              >
                {copy.common.edit}
              </button>
              <PartnerDeleteButton
                action={deletePartnerImage}
                partnerId={partner.id}
                partnerName={partner.name}
              />
            </div>
          </li>
        ))}
      </ul>
      {editingPartner ? (
        <PartnerUploadSheet partner={editingPartner} onClose={() => setEditingPartner(null)} />
      ) : null}
    </>
  );
}

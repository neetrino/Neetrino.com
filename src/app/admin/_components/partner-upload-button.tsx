'use client';

import { useState } from 'react';
import { useAdminI18n } from './admin-i18n-provider';
import { PartnerUploadSheet } from './partner-upload-sheet';

export function PartnerUploadButton(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { copy } = useAdminI18n();

  return (
    <>
      <button type="button" className="admin-primary-button" onClick={() => setIsOpen(true)}>
        {copy.partners.upload}
      </button>
      {isOpen ? <PartnerUploadSheet onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}

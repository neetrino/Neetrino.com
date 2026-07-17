'use client';

import { useState } from 'react';
import { useAdminI18n } from './admin-i18n-provider';
import { PortfolioUploadSheet } from './portfolio-upload-sheet';

type PortfolioUploadButtonProps = {
  label?: string;
  labelPath?: 'portfolio.upload';
};

export function PortfolioUploadButton({ label, labelPath }: PortfolioUploadButtonProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const { copy } = useAdminI18n();
  const buttonLabel = label ?? (labelPath ? copy.portfolio.upload : '');

  return (
    <>
      <button type="button" className="admin-primary-button" onClick={() => setIsOpen(true)}>
        {buttonLabel}
      </button>
      {isOpen ? <PortfolioUploadSheet onClose={() => setIsOpen(false)} /> : null}
    </>
  );
}

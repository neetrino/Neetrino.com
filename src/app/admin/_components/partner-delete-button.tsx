'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { PartnerDeleteState } from '../_actions/partner-actions';
import { AdminConfirmDialog } from './admin-confirm-dialog';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type PartnerDeleteButtonProps = {
  action: (state: PartnerDeleteState, formData: FormData) => Promise<PartnerDeleteState>;
  partnerId: string;
  partnerName: string;
};

export function PartnerDeleteButton({
  action,
  partnerId,
  partnerName,
}: PartnerDeleteButtonProps): React.JSX.Element {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const description = formatAdminMessage(copy.partners.deleteConfirm, { name: partnerName });

  function handleConfirm(): void {
    setErrorMessage('');
    const formData = new FormData();
    formData.set('partnerId', partnerId);

    startTransition(async () => {
      const result = await action({ status: 'idle', message: '' }, formData);

      if (result.status === 'success') {
        setIsDialogOpen(false);
        showSuccessToast(copy.partners.deleteSuccess);
        router.refresh();
        return;
      }

      setErrorMessage(result.message);
    });
  }

  return (
    <div className="admin-portfolio-delete-form">
      <button
        type="button"
        className="admin-danger-button"
        disabled={isPending}
        onClick={() => setIsDialogOpen(true)}
      >
        {isPending ? copy.common.deleting : copy.common.delete}
      </button>
      {errorMessage && !isDialogOpen ? <p className="admin-card-error">{errorMessage}</p> : null}
      {isDialogOpen ? (
        <AdminConfirmDialog
          title={copy.partners.deleteDialogTitle}
          description={errorMessage || description}
          confirmText={partnerName}
          confirmInputLabel={formatAdminMessage(copy.partners.deleteTypeLabel, { name: partnerName })}
          confirmInputPlaceholder={partnerName}
          isConfirming={isPending}
          onCancel={() => {
            if (!isPending) {
              setIsDialogOpen(false);
              setErrorMessage('');
            }
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
}

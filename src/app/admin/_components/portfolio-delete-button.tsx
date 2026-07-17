'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';
import { AdminConfirmDialog } from './admin-confirm-dialog';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type PortfolioDeleteButtonProps = {
  action: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
  assetId: string;
  assetTitle: string;
  confirmMessage?: string;
  onDeleted?: () => void;
};

export function PortfolioDeleteButton({
  action,
  assetId,
  assetTitle,
  confirmMessage,
  onDeleted,
}: PortfolioDeleteButtonProps): React.JSX.Element {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const description =
    confirmMessage ?? formatAdminMessage(copy.portfolio.deleteConfirm, { title: assetTitle });

  function handleConfirm(): void {
    setErrorMessage('');
    const formData = new FormData();
    formData.set('assetId', assetId);

    startTransition(async () => {
      const result = await action({ status: 'idle', message: '' }, formData);

      if (result.status === 'success') {
        setIsDialogOpen(false);
        showSuccessToast(copy.portfolio.deleteSuccess);
        onDeleted?.();
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
          title={copy.portfolio.deleteDialogTitle}
          description={errorMessage || description}
          confirmText={assetTitle}
          confirmInputLabel={formatAdminMessage(copy.portfolio.deleteTypeLabel, { title: assetTitle })}
          confirmInputPlaceholder={assetTitle}
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

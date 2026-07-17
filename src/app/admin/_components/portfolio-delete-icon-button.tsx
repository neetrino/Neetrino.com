'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';
import { AdminConfirmDialog } from './admin-confirm-dialog';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type PortfolioDeleteIconButtonProps = {
  action: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
  assetId: string;
  assetTitle: string;
  confirmMessage?: string;
  disabled?: boolean;
  onDeleted?: () => void;
};

export function PortfolioDeleteIconButton({
  action,
  assetId,
  assetTitle,
  confirmMessage,
  disabled = false,
  onDeleted,
}: PortfolioDeleteIconButtonProps): React.JSX.Element {
  const router = useRouter();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');
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
    <>
      <button
        type="button"
        className="admin-portfolio-sheet-delete-x"
        aria-label={formatAdminMessage(copy.portfolio.deleteAria, { title: assetTitle })}
        disabled={disabled || isPending}
        onClick={() => setIsDialogOpen(true)}
      >
        <span aria-hidden>×</span>
      </button>
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
    </>
  );
}

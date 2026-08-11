'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  deleteContactMessage,
  type ContactMessageDeleteState,
} from '../_actions/message-actions';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { useAdminToast } from './admin-toast';

type MessageDeleteButtonProps = {
  messageId: string;
  messageName: string;
  onDeleted?: () => void;
};

export function MessageDeleteButton({
  messageId,
  messageName,
  onDeleted,
}: MessageDeleteButtonProps): React.JSX.Element {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { copy } = useAdminI18n();
  const { showSuccessToast } = useAdminToast();

  function handleClick(): void {
    const confirmed = window.confirm(
      formatAdminMessage(copy.messages.deleteConfirm, { name: messageName }),
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage('');
    const formData = new FormData();
    formData.set('messageId', messageId);

    startTransition(async () => {
      const initialState: ContactMessageDeleteState = { status: 'idle', message: '' };
      const result = await deleteContactMessage(initialState, formData);

      if (result.status === 'success') {
        showSuccessToast(copy.messages.deleteSuccess);
        onDeleted?.();
        router.refresh();
        return;
      }

      setErrorMessage(result.message || copy.messages.deleteError);
    });
  }

  return (
    <div className="admin-card-icon-form">
      <button
        type="button"
        className="admin-danger-button"
        disabled={isPending}
        aria-label={formatAdminMessage(copy.messages.deleteAria, { name: messageName })}
        onClick={handleClick}
      >
        {isPending ? copy.common.deleting : copy.common.delete}
      </button>
      {errorMessage ? <p className="admin-card-error">{errorMessage}</p> : null}
    </div>
  );
}

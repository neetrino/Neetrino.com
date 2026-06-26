'use client';

import { useActionState } from 'react';
import { deleteContactMessage } from '../_actions/contact-actions';
import type { ContactActionState } from '@/app/_actions/contact-actions';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';

const INITIAL_DELETE_STATE: ContactActionState = {
  status: 'idle',
  message: '',
};

type ContactDeleteButtonProps = {
  messageId: string;
  senderName: string;
};

export function ContactDeleteButton({
  messageId,
  senderName,
}: ContactDeleteButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(deleteContactMessage, INITIAL_DELETE_STATE);
  const { copy } = useAdminI18n();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const confirmed = window.confirm(formatAdminMessage(copy.messages.deleteConfirm, { name: senderName }));

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} className="admin-card-icon-form" onSubmit={handleSubmit}>
      <input name="messageId" type="hidden" value={messageId} />
      <button
        type="submit"
        className="admin-icon-button admin-icon-button--danger"
        disabled={isPending}
        aria-label={formatAdminMessage(copy.messages.deleteAria, { name: senderName })}
      >
        <span className="admin-icon admin-icon--delete" aria-hidden />
      </button>
      {state.status === 'error' ? <p className="admin-card-error">{state.message}</p> : null}
    </form>
  );
}

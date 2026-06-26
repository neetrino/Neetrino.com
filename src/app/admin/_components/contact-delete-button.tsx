'use client';

import { useActionState } from 'react';
import { deleteContactMessage } from '../_actions/contact-actions';
import type { ContactActionState } from '@/app/_actions/contact-actions';

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const confirmed = window.confirm(`Delete message from "${senderName}"?`);

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
        aria-label={`Delete message from ${senderName}`}
      >
        <span className="admin-icon admin-icon--delete" aria-hidden />
      </button>
      {state.status === 'error' ? <p className="admin-card-error">{state.message}</p> : null}
    </form>
  );
}

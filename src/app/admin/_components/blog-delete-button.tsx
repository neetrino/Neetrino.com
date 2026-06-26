'use client';

import { useActionState } from 'react';
import type { BlogActionState } from '../_actions/blog-actions';
import { deleteBlogPost } from '../_actions/blog-actions';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';

const INITIAL_DELETE_STATE: BlogActionState = {
  status: 'idle',
  message: '',
};

type BlogDeleteButtonProps = {
  postId: string;
  postTitle: string;
};

export function BlogDeleteButton({ postId, postTitle }: BlogDeleteButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(deleteBlogPost, INITIAL_DELETE_STATE);
  const { copy } = useAdminI18n();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const confirmed = window.confirm(formatAdminMessage(copy.blog.deleteConfirm, { title: postTitle }));

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} className="admin-card-icon-form" onSubmit={handleSubmit}>
      <input name="postId" type="hidden" value={postId} />
      <button
        type="submit"
        className="admin-icon-button admin-icon-button--danger"
        disabled={isPending}
        aria-label={formatAdminMessage(copy.blog.deleteAria, { title: postTitle })}
      >
        <span className="admin-icon admin-icon--delete" aria-hidden />
      </button>
      {state.status === 'error' ? <p className="admin-card-error">{state.message}</p> : null}
    </form>
  );
}

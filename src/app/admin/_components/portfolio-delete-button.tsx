'use client';

import { useActionState } from 'react';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';

const INITIAL_DELETE_STATE: PortfolioDeleteState = {
  status: 'idle',
  message: '',
};

type PortfolioDeleteButtonProps = {
  action: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
  assetId: string;
  assetTitle: string;
};

export function PortfolioDeleteButton({
  action,
  assetId,
  assetTitle,
}: PortfolioDeleteButtonProps): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(action, INITIAL_DELETE_STATE);
  const { copy } = useAdminI18n();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const confirmed = window.confirm(formatAdminMessage(copy.portfolio.deleteConfirm, { title: assetTitle }));

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} className="admin-portfolio-delete-form" onSubmit={handleSubmit}>
      <input name="assetId" type="hidden" value={assetId} />
      <button type="submit" className="admin-danger-button" disabled={isPending}>
        {isPending ? copy.common.deleting : copy.common.delete}
      </button>
      {state.status === 'error' ? <p className="admin-card-error">{state.message}</p> : null}
    </form>
  );
}

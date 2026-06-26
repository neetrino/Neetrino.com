'use client';

import { useActionState } from 'react';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const confirmed = window.confirm(`Delete "${assetTitle}" from portfolio?`);

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} className="admin-card-delete-form" onSubmit={handleSubmit}>
      <input name="assetId" type="hidden" value={assetId} />
      <button type="submit" className="admin-danger-button" disabled={isPending}>
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
      {state.status === 'error' ? <p className="admin-card-error">{state.message}</p> : null}
    </form>
  );
}

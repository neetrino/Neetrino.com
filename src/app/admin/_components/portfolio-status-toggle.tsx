'use client';

import { useTransition } from 'react';
import { togglePortfolioAssetStatus } from '../_actions/portfolio-actions';
import { isPortfolioAssetActive } from '@/lib/portfolio-asset-status';

type PortfolioStatusToggleProps = {
  assetId: string;
  status: string;
};

export function PortfolioStatusToggle({ assetId, status }: PortfolioStatusToggleProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition();
  const isActive = isPortfolioAssetActive(status);

  function handleChange(): void {
    const formData = new FormData();
    formData.set('assetId', assetId);

    startTransition(async () => {
      await togglePortfolioAssetStatus(formData);
    });
  }

  return (
    <label className="admin-portfolio-active">
      <input
        type="checkbox"
        className="admin-portfolio-active-input"
        checked={isActive}
        onChange={handleChange}
        disabled={isPending}
        aria-label={isActive ? 'Set asset to draft' : 'Activate asset'}
      />
      <span>Active</span>
    </label>
  );
}

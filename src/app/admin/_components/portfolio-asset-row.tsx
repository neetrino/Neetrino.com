'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';
import type { AdminPortfolioAsset } from './admin-portfolio-asset';
import { PORTFOLIO_DRAG_TOP_TRANSITION } from './portfolio-asset-list-drag';
import { PortfolioDeleteButton } from './portfolio-delete-button';
import { PortfolioStatusToggle } from './portfolio-status-toggle';
import { formatAdminMessage, useAdminI18n } from './admin-i18n-provider';
import { formatPortfolioSlotMeta } from '@/lib/portfolio-slots';
import { getPortfolioVisibilityLabel } from '@/lib/portfolio-asset-status';
import { isRemoteImageUrl } from '@/lib/image-url';

const ROW_INTERACTIVE_SELECTOR =
  '.admin-portfolio-actions, .admin-portfolio-drag-handle, a, button, input, label, form';

export type PortfolioRowProps = {
  asset: AdminPortfolioAsset;
  index: number;
  deleteAction: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
  isDragging: boolean;
  isDraggedRow: boolean;
  rowTop: number;
  animatePositions: boolean;
  onOpen: (assetId: string) => void;
  onHandlePointerDown: (index: number, event: React.PointerEvent<HTMLSpanElement>) => void;
  onHandlePointerMove: (event: React.PointerEvent<HTMLSpanElement>) => void;
  onHandlePointerUp: (event: React.PointerEvent<HTMLSpanElement>) => void;
  onHandlePointerCancel: (event: React.PointerEvent<HTMLSpanElement>) => void;
};

function isInteractiveRowTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(ROW_INTERACTIVE_SELECTOR));
}

export function PortfolioRow({
  asset,
  index,
  deleteAction,
  isDragging,
  isDraggedRow,
  rowTop,
  animatePositions,
  onOpen,
  onHandlePointerDown,
  onHandlePointerMove,
  onHandlePointerUp,
  onHandlePointerCancel,
}: PortfolioRowProps): React.JSX.Element {
  const { copy } = useAdminI18n();

  function handleRowClick(event: React.MouseEvent<HTMLLIElement>): void {
    if (isDragging || isInteractiveRowTarget(event.target)) {
      return;
    }

    onOpen(asset.id);
  }

  function handleRowKeyDown(event: React.KeyboardEvent<HTMLLIElement>): void {
    if (isDragging || isInteractiveRowTarget(event.target)) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(asset.id);
    }
  }

  return (
    <li
      data-portfolio-row
      data-portfolio-index={index}
      className={
        isDraggedRow
          ? 'admin-portfolio-row admin-portfolio-row--floating'
          : isDragging
            ? 'admin-portfolio-row admin-portfolio-row--animated'
            : 'admin-portfolio-row admin-portfolio-row--clickable'
      }
      style={
        isDragging
          ? {
              top: rowTop,
              transition: animatePositions ? PORTFOLIO_DRAG_TOP_TRANSITION : 'none',
            }
          : undefined
      }
      role={isDragging ? undefined : 'button'}
      tabIndex={isDragging ? -1 : 0}
      aria-label={formatAdminMessage(copy.portfolio.openAria, { title: asset.title })}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
    >
      <span
        className="admin-portfolio-drag-handle"
        aria-label={formatAdminMessage(copy.portfolio.reorderAria, { title: asset.title })}
        onPointerDown={(event) => {
          event.stopPropagation();
          onHandlePointerDown(index, event);
        }}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        onPointerCancel={onHandlePointerCancel}
      >
        <span className="admin-portfolio-drag-grip" aria-hidden />
      </span>
      <div className="admin-portfolio-thumb-wrap">
        <Image
          src={asset.url}
          alt={asset.alt}
          width={72}
          height={72}
          sizes="72px"
          unoptimized={isRemoteImageUrl(asset.url)}
          className="admin-portfolio-thumb"
        />
      </div>
      <div className="admin-portfolio-copy">
        <h2>{asset.title}</h2>
        <p>{formatPortfolioSlotMeta(index, asset.assetType)}</p>
        <p className="admin-portfolio-visibility">{getPortfolioVisibilityLabel(asset.status)}</p>
      </div>
      <div className="admin-portfolio-actions">
        <PortfolioStatusToggle assetId={asset.id} status={asset.status} />
        <PortfolioDeleteButton action={deleteAction} assetId={asset.id} assetTitle={asset.title} />
      </div>
    </li>
  );
}

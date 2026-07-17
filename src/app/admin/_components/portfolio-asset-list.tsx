'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import type { PortfolioDeleteState } from '../_actions/portfolio-actions';
import { reorderPortfolioAssets } from '../_actions/portfolio-actions';
import type { AdminPortfolioAsset } from './admin-portfolio-asset';
import {
  getInsertIndexFromPointer,
  getVisualRank,
  moveAsset,
  resolveOverIndex,
} from './portfolio-asset-list-drag';
import { PortfolioAssetSheet } from './portfolio-asset-sheet';
import { PortfolioRow } from './portfolio-asset-row';
import { useAdminI18n } from './admin-i18n-provider';

const DEFAULT_PORTFOLIO_ROW_HEIGHT = 109;

type PortfolioAssetListProps = {
  assets: AdminPortfolioAsset[];
  deleteAction: (state: PortfolioDeleteState, formData: FormData) => Promise<PortfolioDeleteState>;
};

export function PortfolioAssetList({ assets: initialAssets, deleteAction }: PortfolioAssetListProps): React.JSX.Element {
  const listRef = useRef<HTMLUListElement>(null);
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [rowHeight, setRowHeight] = useState(DEFAULT_PORTFOLIO_ROW_HEIGHT);
  const [animatePositions, setAnimatePositions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { copy } = useAdminI18n();

  useEffect(() => {
    const timer = window.setTimeout(() => setAssets(initialAssets), 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [initialAssets]);

  useEffect(() => {
    if (draggedIndex === null || overIndex === null) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAnimatePositions(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [draggedIndex, overIndex]);

  function persistOrder(orderedAssets: AdminPortfolioAsset[]): void {
    const formData = new FormData();
    formData.set('orderedIds', JSON.stringify(orderedAssets.map((asset) => asset.id)));

    startTransition(async () => {
      await reorderPortfolioAssets(formData);
    });
  }

  function updateOverIndex(insertIndex: number): void {
    if (draggedIndex === null) {
      return;
    }

    const nextOverIndex = resolveOverIndex(insertIndex, draggedIndex, assets.length);

    if (nextOverIndex !== overIndex) {
      setOverIndex(nextOverIndex);
    }
  }

  function finishDrag(): void {
    if (draggedIndex === null || overIndex === null) {
      setDraggedIndex(null);
      setOverIndex(null);
      setAnimatePositions(false);
      return;
    }

    if (draggedIndex !== overIndex) {
      const nextAssets = moveAsset(assets, draggedIndex, overIndex);
      setAssets(nextAssets);
      persistOrder(nextAssets);
    }

    setDraggedIndex(null);
    setOverIndex(null);
    setAnimatePositions(false);
  }

  function handleHandlePointerDown(index: number, event: React.PointerEvent<HTMLSpanElement>): void {
    if (isPending) {
      return;
    }

    const rowElement = event.currentTarget.closest('[data-portfolio-row]');

    if (!(rowElement instanceof HTMLLIElement)) {
      return;
    }

    setAnimatePositions(false);
    setRowHeight(rowElement.offsetHeight);
    setDraggedIndex(index);
    setOverIndex(index);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleHandlePointerMove(event: React.PointerEvent<HTMLSpanElement>): void {
    if (draggedIndex === null || !listRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updateOverIndex(getInsertIndexFromPointer(listRef.current, event.clientY, draggedIndex, assets.length));
  }

  function handleHandlePointerUp(event: React.PointerEvent<HTMLSpanElement>): void {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    event.currentTarget.releasePointerCapture(event.pointerId);
    finishDrag();
  }

  function handleHandlePointerCancel(event: React.PointerEvent<HTMLSpanElement>): void {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggedIndex(null);
    setOverIndex(null);
    setAnimatePositions(false);
  }

  const isDragging = draggedIndex !== null && overIndex !== null;
  const listHeight = isDragging ? assets.length * rowHeight : undefined;
  const gapTop = isDragging ? overIndex * rowHeight : 0;
  const selectedIndex = selectedAssetId ? assets.findIndex((asset) => asset.id === selectedAssetId) : -1;
  const selectedAsset = selectedIndex >= 0 ? assets[selectedIndex] : null;

  return (
    <section className="admin-portfolio-list" aria-label={copy.portfolio.listAria}>
      <ul
        ref={listRef}
        className={isDragging ? 'admin-portfolio-list-items admin-portfolio-list-items--dragging' : 'admin-portfolio-list-items'}
        style={listHeight ? { height: listHeight } : undefined}
      >
        {isDragging ? (
          <li
            className="admin-portfolio-gap"
            style={{
              height: rowHeight,
              top: gapTop,
              transition: animatePositions ? 'top 0.22s ease' : 'none',
            }}
            aria-hidden
          />
        ) : null}
        {assets.map((asset, index) => (
          <PortfolioRow
            key={asset.id}
            asset={asset}
            index={index}
            deleteAction={deleteAction}
            isDragging={isDragging}
            isDraggedRow={draggedIndex === index}
            rowTop={
              isDragging
                ? getVisualRank(index, draggedIndex, overIndex, assets.length) * rowHeight
                : 0
            }
            animatePositions={animatePositions}
            onOpen={setSelectedAssetId}
            onHandlePointerDown={handleHandlePointerDown}
            onHandlePointerMove={handleHandlePointerMove}
            onHandlePointerUp={handleHandlePointerUp}
            onHandlePointerCancel={handleHandlePointerCancel}
          />
        ))}
      </ul>
      {selectedAsset ? (
        <PortfolioAssetSheet
          asset={selectedAsset}
          index={selectedIndex}
          deleteAction={deleteAction}
          onClose={() => setSelectedAssetId(null)}
          onUpdated={(updatedAsset) => {
            setAssets((current) =>
              current.map((item) => (item.id === updatedAsset.id ? updatedAsset : item)),
            );
          }}
        />
      ) : null}
    </section>
  );
}

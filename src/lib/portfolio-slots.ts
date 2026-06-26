const PORTFOLIO_SLOT_SIDE_LEFT = 'left';
const PORTFOLIO_SLOT_SIDE_RIGHT = 'right';

/** Maps list index to the portfolio grid slot id shown in admin. */
export function getPortfolioSlotId(index: number): string {
  const row = Math.floor(index / 2) + 1;
  const side = index % 2 === 0 ? PORTFOLIO_SLOT_SIDE_LEFT : PORTFOLIO_SLOT_SIDE_RIGHT;

  return `grid_${row}_${side}`;
}

/** Human-readable slot line for admin rows, e.g. "Slot grid_1_left · image". */
export function formatPortfolioSlotMeta(index: number, assetType: string): string {
  const slot = getPortfolioSlotId(index);
  const typeLabel = assetType === 'ANIMATION_IMAGE' ? 'animation' : 'image';

  return `Slot ${slot} · ${typeLabel}`;
}

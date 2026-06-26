const PORTFOLIO_ROW_TRANSITION_MS = 220;

export const PORTFOLIO_DRAG_TOP_TRANSITION = `top ${PORTFOLIO_ROW_TRANSITION_MS}ms ease, box-shadow ${PORTFOLIO_ROW_TRANSITION_MS}ms ease, opacity ${PORTFOLIO_ROW_TRANSITION_MS}ms ease`;

export function moveAsset<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
}

/** Resolves hover position to the final index after the dragged row is removed. */
export function resolveOverIndex(insertIndex: number, draggedIndex: number, itemCount: number): number {
  const clampedInsert = Math.max(0, Math.min(insertIndex, itemCount));
  const overIndex = clampedInsert > draggedIndex ? clampedInsert - 1 : clampedInsert;

  return Math.max(0, Math.min(overIndex, itemCount - 1));
}

/** Rank in the list while dragging: opens a gap at `overIndex`. */
export function getVisualRank(
  index: number,
  draggedIndex: number,
  overIndex: number,
  itemCount: number,
): number {
  if (index === draggedIndex) {
    return overIndex;
  }

  let staticRank = 0;

  for (let current = 0; current < itemCount; current += 1) {
    if (current === draggedIndex) {
      continue;
    }

    if (current === index) {
      return staticRank >= overIndex ? staticRank + 1 : staticRank;
    }

    staticRank += 1;
  }

  return staticRank;
}

export function getInsertIndexFromPointer(
  listElement: HTMLUListElement,
  clientY: number,
  draggedIndex: number,
  itemCount: number,
): number {
  const rows = [...listElement.querySelectorAll<HTMLLIElement>('[data-portfolio-row]')]
    .filter((row) => Number(row.dataset.portfolioIndex) !== draggedIndex)
    .sort((left, right) => left.getBoundingClientRect().top - right.getBoundingClientRect().top);

  for (const row of rows) {
    const originalIndex = Number(row.dataset.portfolioIndex);

    if (Number.isNaN(originalIndex)) {
      continue;
    }

    const rect = row.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;

    if (clientY < midpoint) {
      return originalIndex;
    }
  }

  return itemCount;
}

export const PORTFOLIO_ASSET_STATUSES = ['ACTIVE', 'DRAFT'] as const;

export type PortfolioAssetStatus = (typeof PORTFOLIO_ASSET_STATUSES)[number];

export function isPortfolioAssetActive(status: string): boolean {
  return status === 'ACTIVE';
}

export function getPortfolioVisibilityLabel(status: string): string {
  return isPortfolioAssetActive(status) ? 'Visible' : 'Draft';
}

export function getNextPortfolioAssetStatus(status: string): PortfolioAssetStatus {
  return isPortfolioAssetActive(status) ? 'DRAFT' : 'ACTIVE';
}

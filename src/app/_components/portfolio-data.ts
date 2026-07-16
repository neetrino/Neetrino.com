export type PortfolioProjectVariant =
  | 'anra'
  | 'degusto'
  | 'digital-implant'
  | 'dvbs'
  | 'marco'
  | 'ncie'
  | 'toon'
  | 'zeppelin';

export type PortfolioProject = {
  id: string;
  title: string;
  alt: string;
  image: string;
  /** Live project website when known; otherwise the card action is hidden. */
  href: string | null;
  variant?: PortfolioProjectVariant;
  overlayTitle?: string;
};

/**
 * Portfolio cards are sourced from the admin (database). No static image
 * fallback is provided; when the database is unavailable the list is empty.
 */
export const portfolioProjects: PortfolioProject[] = [];

/** Live client sites linked from portfolio card actions. */
export const PORTFOLIO_LIVE_HREFS: Record<PortfolioProjectVariant, string> = {
  anra: 'https://anra.am/',
  degusto: 'https://degusto.am/',
  'digital-implant': 'https://www.implantclinic.am/hy',
  dvbs: 'https://borboraqua.am/',
  marco: 'https://marco.am/',
  ncie: 'https://ncie.am/en/',
  toon: 'https://toonexpo.com/',
  zeppelin: 'https://www.zeppelin.am/am',
};

/** Resolves the public live URL for a known portfolio project variant. */
export function portfolioProjectLiveHref(variant: PortfolioProjectVariant | undefined): string | null {
  if (!variant) {
    return null;
  }

  return PORTFOLIO_LIVE_HREFS[variant];
}

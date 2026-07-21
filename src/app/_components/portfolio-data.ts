export type PortfolioProjectVariant =
  | 'anra'
  | 'avetis'
  | 'degusto'
  | 'digital-implant'
  | 'dvbs'
  | 'hay-masters'
  | 'lilis'
  | 'marco'
  | 'ncie'
  | 'qualitech'
  | 'toon'
  | 'zeppelin';

export type PortfolioProject = {
  id: string;
  title: string;
  alt: string;
  image: string;
  /** Slack / live project URL from admin; falls back to known variant sites. */
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
export const PORTFOLIO_LIVE_HREFS: Partial<Record<PortfolioProjectVariant, string>> = {
  anra: 'https://anra.am/',
  avetis: 'https://avetis.am/',
  degusto: 'https://degusto.am/',
  'digital-implant': 'https://www.implantclinic.am/hy',
  dvbs: 'https://borboraqua.am/',
  'hay-masters': 'https://haymasters.am/',
  lilis: 'https://lilisflowers.am/',
  marco: 'https://marco.am/',
  ncie: 'https://ncie.am/en/',
  qualitech: 'https://www.instrument.am/',
  toon: 'https://toonexpo.com/',
  zeppelin: 'https://www.zeppelin.am/am',
};

function normalizePortfolioText(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

/** Infers a known project variant from title/alt for live URL fallbacks. */
export function resolvePortfolioVariant(title: string, alt: string): PortfolioProjectVariant | undefined {
  const normalizedTitle = normalizePortfolioText(title);
  const normalizedAlt = normalizePortfolioText(alt);
  const combined = `${normalizedTitle} ${normalizedAlt}`;

  if (combined.includes('tooon') || combined.includes('toon expo') || combined.includes('toonexpo')) {
    return 'toon';
  }

  if (combined.includes('degusto')) {
    return 'degusto';
  }

  if (combined.includes('dvbs') || combined.includes('borbor')) {
    return 'dvbs';
  }

  if (
    combined.includes('digital implant') ||
    combined.includes('implant clinic') ||
    combined.includes('implantclinic')
  ) {
    return 'digital-implant';
  }

  if (combined.includes('ncie')) {
    return 'ncie';
  }

  if (combined.includes('anra') || combined.includes('nuclear regulatory')) {
    return 'anra';
  }

  if (combined.includes('zeppelin')) {
    return 'zeppelin';
  }

  if (combined.includes('marco')) {
    return 'marco';
  }

  if (combined.includes('avetis')) {
    return 'avetis';
  }

  if (combined.includes('hay masters') || combined.includes('haymasters')) {
    return 'hay-masters';
  }

  if (combined.includes('lilis')) {
    return 'lilis';
  }

  if (combined.includes('qualitech')) {
    return 'qualitech';
  }

  return undefined;
}

/** Resolves the public live URL for a known portfolio project variant. */
export function portfolioProjectLiveHref(variant: PortfolioProjectVariant | undefined): string | null {
  if (!variant) {
    return null;
  }

  return PORTFOLIO_LIVE_HREFS[variant] ?? null;
}

/**
 * Prefers an admin-saved project URL, otherwise the known live site for the variant.
 */
export function resolvePortfolioProjectHref(
  title: string,
  alt: string,
  projectUrl?: string | null,
): string | null {
  const customUrl = typeof projectUrl === 'string' ? projectUrl.trim() : '';

  if (customUrl.length > 0) {
    return customUrl;
  }

  return portfolioProjectLiveHref(resolvePortfolioVariant(title, alt));
}

export type PortfolioProject = {
  title: string;
  alt: string;
  image: string;
  variant?: 'zeppelin';
  overlayTitle?: string;
};

/**
 * Portfolio cards are sourced from the admin (database). No static image
 * fallback is provided; when the database is unavailable the list is empty.
 */
export const portfolioProjects: PortfolioProject[] = [];

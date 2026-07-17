import type { ProjectCard } from '@/app/_components/home-data';
import { portfolioBottomRow, portfolioTopRow } from '@/app/_components/home-data';
import {
  PORTFOLIO_ANRA_MOCKUP_SRC,
  PORTFOLIO_DVBS_BANNER_SRC,
} from '@/app/_components/portfolio-constants';
import {
  portfolioProjects as staticPortfolioProjects,
  resolvePortfolioProjectHref,
  resolvePortfolioVariant,
  type PortfolioProject,
} from '@/app/_components/portfolio-data';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const HOME_PORTFOLIO_TOP_TEMPLATES = [
  { width: 505, height: 378, radius: 43 },
  { width: 505, height: 378, radius: 45 },
  { width: 592, height: 383, radius: 35 },
] as const;
const HOME_PORTFOLIO_BOTTOM_TEMPLATES = [
  { width: 379, height: 378, radius: 32 },
  { width: 505, height: 378, radius: 43 },
  { width: 505, height: 378, radius: 45 },
  { width: 592, height: 383, radius: 35 },
] as const;

type PublicPortfolioAsset = {
  id: string;
  title: string;
  alt: string;
  url: string;
  projectUrl: string | null;
};
type HomePortfolioTemplate = Pick<ProjectCard, 'height' | 'radius' | 'width'>;

export type PublicPortfolioData = {
  homeBottomRow: ProjectCard[];
  homeTopRow: ProjectCard[];
  portfolioProjects: PortfolioProject[];
};

function getTemplate<T>(templates: readonly T[], index: number): T {
  return templates[index % templates.length];
}

function toProjectCard(asset: PublicPortfolioAsset, template: HomePortfolioTemplate): ProjectCard {
  return {
    title: asset.alt || asset.title,
    image: asset.url,
    width: template.width,
    height: template.height,
    radius: template.radius,
  };
}

function splitHomeRows(assets: PublicPortfolioAsset[]): Pick<PublicPortfolioData, 'homeBottomRow' | 'homeTopRow'> {
  const topAssets = assets.filter((_, index) => index % 2 === 0);
  const bottomAssets = assets.filter((_, index) => index % 2 === 1);

  return {
    homeTopRow: topAssets.map((asset, index) =>
      toProjectCard(asset, getTemplate(HOME_PORTFOLIO_TOP_TEMPLATES, index)),
    ),
    homeBottomRow: bottomAssets.map((asset, index) =>
      toProjectCard(asset, getTemplate(HOME_PORTFOLIO_BOTTOM_TEMPLATES, index)),
    ),
  };
}

function getStaticPortfolioData(): PublicPortfolioData {
  return {
    homeTopRow: portfolioTopRow,
    homeBottomRow: portfolioBottomRow,
    portfolioProjects: staticPortfolioProjects,
  };
}

function toPortfolioProject(asset: PublicPortfolioAsset): PortfolioProject {
  const variant = resolvePortfolioVariant(asset.title, asset.alt);
  let image = asset.url;

  if (variant === 'dvbs') {
    image = PORTFOLIO_DVBS_BANNER_SRC;
  }

  if (variant === 'anra') {
    image = PORTFOLIO_ANRA_MOCKUP_SRC;
  }

  return {
    id: asset.id,
    title: asset.title,
    alt: asset.alt,
    image,
    href: resolvePortfolioProjectHref(asset.title, asset.alt, asset.projectUrl),
    variant,
  };
}

function toErrorContext(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { error };
}

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL is not set; using static portfolio data.');
    return getStaticPortfolioData();
  }

  try {
    const assets = await prisma.portfolioAsset.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        alt: true,
        title: true,
        url: true,
        projectUrl: true,
      },
    });
    const rows = splitHomeRows(assets);

    return {
      ...rows,
      portfolioProjects: assets.map(toPortfolioProject),
    };
  } catch (error) {
    logger.error('Failed to load portfolio assets; using static portfolio data.', toErrorContext(error));
    return getStaticPortfolioData();
  }
}

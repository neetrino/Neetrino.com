import type { ProjectCard } from '@/app/_components/home-data';
import { portfolioBottomRow, portfolioTopRow } from '@/app/_components/home-data';
import {
  PORTFOLIO_ANRA_MOCKUP_SRC,
  PORTFOLIO_CARD_MEDIA_HEIGHT,
  PORTFOLIO_CARD_MEDIA_WIDTH,
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

/** Uniform home marquee card size — same media ratio as portfolio page cards. */
const HOME_PORTFOLIO_CARD_TEMPLATE = {
  width: PORTFOLIO_CARD_MEDIA_WIDTH,
  height: PORTFOLIO_CARD_MEDIA_HEIGHT,
  radius: 16,
} as const;

type PublicPortfolioAsset = {
  id: string;
  title: string;
  alt: string;
  url: string;
  contentType: string;
  projectUrl: string | null;
};

export type PublicPortfolioData = {
  homeBottomRow: ProjectCard[];
  homeTopRow: ProjectCard[];
  portfolioProjects: PortfolioProject[];
};

function resolveHomeProjectMedia(asset: PublicPortfolioAsset): { image: string; contentType?: string } {
  const variant = resolvePortfolioVariant(asset.title, asset.alt);

  if (variant === 'dvbs') {
    return { image: PORTFOLIO_DVBS_BANNER_SRC };
  }

  if (variant === 'anra') {
    return { image: PORTFOLIO_ANRA_MOCKUP_SRC };
  }

  return { image: asset.url, contentType: asset.contentType };
}

function toProjectCard(asset: PublicPortfolioAsset): ProjectCard {
  const media = resolveHomeProjectMedia(asset);

  return {
    title: asset.alt || asset.title,
    image: media.image,
    contentType: media.contentType,
    width: HOME_PORTFOLIO_CARD_TEMPLATE.width,
    height: HOME_PORTFOLIO_CARD_TEMPLATE.height,
    radius: HOME_PORTFOLIO_CARD_TEMPLATE.radius,
  };
}

function splitHomeRows(assets: PublicPortfolioAsset[]): Pick<PublicPortfolioData, 'homeBottomRow' | 'homeTopRow'> {
  const topAssets = assets.filter((_, index) => index % 2 === 0);
  const bottomAssets = assets.filter((_, index) => index % 2 === 1);

  return {
    homeTopRow: topAssets.map(toProjectCard),
    homeBottomRow: bottomAssets.map(toProjectCard),
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
  const media = resolveHomeProjectMedia(asset);

  return {
    id: asset.id,
    title: asset.title,
    alt: asset.alt,
    image: media.image,
    contentType: media.contentType,
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
        contentType: true,
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

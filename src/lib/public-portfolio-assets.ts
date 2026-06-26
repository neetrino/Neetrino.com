import type { ProjectCard } from '@/app/_components/home-data';
import type { PortfolioProject } from '@/app/_components/portfolio-data';
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
  title: string;
  alt: string;
  url: string;
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

export async function getPublicPortfolioData(): Promise<PublicPortfolioData> {
  const assets = await prisma.portfolioAsset.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      alt: true,
      title: true,
      url: true,
    },
  });
  const rows = splitHomeRows(assets);

  return {
    ...rows,
    portfolioProjects: assets.map((asset) => ({
      title: asset.title,
      alt: asset.alt,
      image: asset.url,
    })),
  };
}

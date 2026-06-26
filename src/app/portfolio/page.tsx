import type { Metadata } from 'next';
import { PortfolioPage } from '../_components/portfolio-page';
import { portfolioMessages } from '../_components/portfolio-messages';
import { getPublicPortfolioData } from '@/lib/public-portfolio-assets';

export const metadata: Metadata = {
  title: portfolioMessages.meta.pageTitle,
  description: portfolioMessages.meta.description,
};

export const revalidate = 300;

export default async function Portfolio(): Promise<React.JSX.Element> {
  const portfolioData = await getPublicPortfolioData();

  return <PortfolioPage projects={portfolioData.portfolioProjects} />;
}

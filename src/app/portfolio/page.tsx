import type { Metadata } from 'next';
import { PortfolioPage } from '../_components/portfolio-page';
import { portfolioMessages } from '../_components/portfolio-messages';

export const metadata: Metadata = {
  title: portfolioMessages.meta.pageTitle,
  description: portfolioMessages.meta.description,
};

export const revalidate = 300;

export default function Portfolio(): React.JSX.Element {
  return <PortfolioPage />;
}

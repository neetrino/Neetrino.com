import type { Metadata } from 'next';
import { PortfolioPage } from '../_components/portfolio-page';

export const metadata: Metadata = {
  title: 'Portfolio | Neetrino',
  description:
    'Neetrino portfolio — selected websites, mobile apps, CRM systems, SaaS platforms, and digital products.',
};

export default function Portfolio(): React.JSX.Element {
  return <PortfolioPage />;
}

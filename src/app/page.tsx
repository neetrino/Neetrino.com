import { NeetrinoHome } from './_components/neetrino-home';
import { getPublicPortfolioData } from '@/lib/public-portfolio-assets';

export const revalidate = 300;

export default async function Home(): Promise<React.JSX.Element> {
  const portfolioData = await getPublicPortfolioData();

  return (
    <NeetrinoHome
      portfolioBottomRow={portfolioData.homeBottomRow}
      portfolioTopRow={portfolioData.homeTopRow}
    />
  );
}

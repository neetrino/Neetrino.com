import { NeetrinoHome } from './_components/neetrino-home';
import { getPublicPartnerLogos } from '@/lib/public-partner-logos';
import { getPublicPortfolioData } from '@/lib/public-portfolio-assets';

export const revalidate = 300;

export default async function Home(): Promise<React.JSX.Element> {
  const [portfolioData, partnerLogos] = await Promise.all([
    getPublicPortfolioData(),
    getPublicPartnerLogos(),
  ]);

  return (
    <NeetrinoHome
      partnerLogos={partnerLogos}
      portfolioBottomRow={portfolioData.homeBottomRow}
      portfolioTopRow={portfolioData.homeTopRow}
    />
  );
}

import { NeetrinoHome } from './_components/neetrino-home';
import { getPublicPartnerLogos } from '@/lib/public-partner-logos';
import { getPublicPortfolioData } from '@/lib/public-portfolio-assets';
import { staticAsset } from '@/lib/static-asset';

/** Long ISR window: DB only on visit when cache is stale (see docs/database-audit). Must be a literal for Next.js. */
export const revalidate = 86_400;

const HOME_HERO_PRELOAD_HREFS = [
  staticAsset('/figma-home/philipp-hubert-dvvjh-ucdb30-unsplash1.webp'),
  staticAsset('/figma-home/30.webp'),
  staticAsset('/figma-home/neetrino-hero-brand.svg'),
] as const;

export default async function Home(): Promise<React.JSX.Element> {
  const [portfolioData, partnerLogos] = await Promise.all([
    getPublicPortfolioData(),
    getPublicPartnerLogos(),
  ]);

  return (
    <>
      {HOME_HERO_PRELOAD_HREFS.map((href) => (
        <link key={href} rel="preload" as="image" href={href} fetchPriority="high" />
      ))}
      <NeetrinoHome
        partnerLogos={partnerLogos}
        portfolioBottomRow={portfolioData.homeBottomRow}
        portfolioTopRow={portfolioData.homeTopRow}
      />
    </>
  );
}

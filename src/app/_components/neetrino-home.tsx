import { HomeAbout } from './home-about';
import { HomeAboutVisual } from './home-about-visual';
import { HomeHero } from './home-hero';
import { HomeMobile } from './home-mobile';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeServices } from './home-services';
import { homeCopy, type ProjectCard } from './home-data';
import { NeetrinoPageShell } from './neetrino-page-shell';
import type { PublicPartnerLogo } from '@/lib/public-partner-logos';

type NeetrinoHomeProps = {
  partnerLogos: readonly PublicPartnerLogo[];
  portfolioBottomRow: ProjectCard[];
  portfolioTopRow: ProjectCard[];
};

export function NeetrinoHome({
  partnerLogos,
  portfolioBottomRow,
  portfolioTopRow,
}: NeetrinoHomeProps): React.JSX.Element {
  const mobilePortfolioProjects = [...portfolioTopRow, ...portfolioBottomRow];

  return (
    <NeetrinoPageShell mainId="home" srOnlyTitle={homeCopy.meta.pageTitle}>
      <div className="home-desktop">
        <div className="home-page-glow" aria-hidden />
        <HomeHero />
        <HomeServices />
        <HomePortfolio bottomRow={portfolioBottomRow} topRow={portfolioTopRow} />
        <HomeAbout visual={<HomeAboutVisual />} />
        <HomePartners logos={partnerLogos} />
      </div>

      <div className="home-mobile-wrap">
        <HomeMobile partnerLogos={partnerLogos} portfolioProjects={mobilePortfolioProjects} />
      </div>
    </NeetrinoPageShell>
  );
}

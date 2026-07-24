import type { ProjectCard } from './home-data';
import { HomeMobileBackground } from './home-mobile-background';
import { HomeMobileHero } from './home-mobile-hero';
import { HomeMobilePortfolio } from './home-mobile-portfolio';
import { HomeMobileServices } from './home-mobile-services';
import { HomePartners } from './home-partners';
import type { PublicPartnerLogo } from '@/lib/public-partner-logos';
import './home-mobile.css';

type HomeMobileProps = {
  partnerLogos: readonly PublicPartnerLogo[];
  portfolioProjects: ProjectCard[];
};

/** Mobile home page — flow layout matching Figma node 1:1478. */
export function HomeMobile({
  partnerLogos,
  portfolioProjects,
}: HomeMobileProps): React.JSX.Element {
  return (
    <div className="home-mobile">
      <HomeMobileBackground />

      <div className="home-mobile-page">
        <div className="home-page-glow home-mobile-page-glow" aria-hidden />
        <div className="home-mobile-container">
          <HomeMobileHero />
          <HomeMobileServices />
          <HomeMobilePortfolio projects={portfolioProjects} />
        </div>
        <HomePartners logos={partnerLogos} />
      </div>
    </div>
  );
}

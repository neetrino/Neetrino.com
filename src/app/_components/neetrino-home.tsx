import { HomeAbout } from './home-about';
import { HomeHero } from './home-hero';
import { HomeMobile } from './home-mobile';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeServices } from './home-services';
import { homeCopy } from './home-data';
import { NeetrinoPageShell } from './neetrino-page-shell';

export function NeetrinoHome(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="home" srOnlyTitle={homeCopy.meta.pageTitle}>
      <div className="home-desktop">
        <div className="home-page-glow" aria-hidden />
        <div className="home-page-center-beam" aria-hidden data-name="Rectangle 17418" />
        <HomeHero />
        <HomeServices />
        <HomePortfolio />
        <HomeAbout />
        <HomePartners />
      </div>

      <div className="home-mobile-wrap">
        <HomeMobile />
      </div>
    </NeetrinoPageShell>
  );
}

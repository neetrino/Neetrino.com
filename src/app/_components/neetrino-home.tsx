import { HomeAbout } from './home-about';
import { HomeHero } from './home-hero';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeServices } from './home-services';
import { NeetrinoPageShell } from './neetrino-page-shell';

export function NeetrinoHome(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="home" srOnlyTitle="Neetrino IT Company">
      <div className="home-page-glow" aria-hidden />
      <div className="home-page-center-beam" aria-hidden data-name="Rectangle 17418" />
      <HomeHero />
      <HomeServices />
      <HomePortfolio />
      <HomeAbout />
      <HomePartners />
    </NeetrinoPageShell>
  );
}

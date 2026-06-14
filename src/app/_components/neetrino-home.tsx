import { CanvasScaler } from './canvas-scaler';
import { HomeAbout } from './home-about';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { HomeHero } from './home-hero';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeServices } from './home-services';

export function NeetrinoHome(): React.JSX.Element {
  return (
    <main className="home-page">
      <CanvasScaler wrapClassName="neetrino-canvas-wrap--hero">
        <div className="home-page-glow" aria-hidden />
        <h1 className="sr-only">Neetrino IT Company</h1>
        <HomeHeader />
        <HomeHero />
        <HomeServices />
        <HomePortfolio />
        <HomeAbout />
        <HomePartners />
        <HomeFooter />
      </CanvasScaler>
    </main>
  );
}

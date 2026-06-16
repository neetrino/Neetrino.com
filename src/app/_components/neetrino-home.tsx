import { CanvasScaler } from './canvas-scaler';
import { HomeAbout } from './home-about';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { HomeHero } from './home-hero';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeScrollPerformance } from './home-scroll-performance';
import { HomeServices } from './home-services';
import { HomeSmoothAnchorScroll } from './home-smooth-anchor-scroll';

export function NeetrinoHome(): React.JSX.Element {
  return (
    <main className="home-page" id="home">
      <HomeSmoothAnchorScroll />
      <HomeScrollPerformance>
        <HomeHeader />
        <CanvasScaler wrapClassName="neetrino-canvas-wrap--page">
          <div className="home-page-glow" aria-hidden />
          <h1 className="sr-only">Neetrino IT Company</h1>
          <HomeHero />
          <HomeServices />
          <HomePortfolio />
          <HomeAbout />
          <HomePartners />
          <HomeFooter />
        </CanvasScaler>
      </HomeScrollPerformance>
    </main>
  );
}

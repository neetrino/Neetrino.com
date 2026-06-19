import { HomeMobileBackground } from './home-mobile-background';
import { HomeMobileHero } from './home-mobile-hero';
import { HomeMobileServices } from './home-mobile-services';
import './home-mobile.css';

/** Mobile home page — flow layout matching Figma node 1:1478. */
export function HomeMobile(): React.JSX.Element {
  return (
    <div className="home-mobile">
      <HomeMobileBackground />

      <div className="home-mobile-page">
        <div className="home-page-glow" aria-hidden />
        <div className="home-mobile-container home-mobile-container--hero">
          <HomeMobileHero />
        </div>
        <div className="home-mobile-container home-mobile-container--after-hero">
          <HomeMobileServices />
        </div>
      </div>
    </div>
  );
}

import { AboutMobileBackground } from './about-mobile-background';
import { AboutMobileCapsule } from './about-mobile-capsule';
import { AboutMobileCountries, AboutMobileTeam } from './about-mobile-countries-team';
import { AboutMobileHero } from './about-mobile-hero';
import { AboutMobileLead } from './about-mobile-lead';
import { AboutMobileMissionVision } from './about-mobile-mission-vision';
import { AboutMobileWhy } from './about-mobile-why';
import './about-mobile.css';

/** Mobile about page — flow layout matching neetrino.com/about-us. */
export function AboutMobile(): React.JSX.Element {
  return (
    <div className="about-mobile">
      <AboutMobileBackground />

      <div className="about-mobile-page">
        <div className="about-mobile-container">
          <AboutMobileHero />
          <AboutMobileLead />
          <div className="about-mobile-capsule-track">
            <AboutMobileCapsule />
            <AboutMobileMissionVision />
            <AboutMobileWhy />
            <AboutMobileCountries />
          </div>
          <AboutMobileTeam />
        </div>
      </div>
    </div>
  );
}

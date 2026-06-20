import Image from 'next/image';

import { impactStats, teamText } from './about-data';
import { ExploreButton } from './home-ui';
import { MobileImpactStat, MobileReflectTitle } from './about-mobile-ui';

const MOBILE_IMPACT_STATS = impactStats.slice(0, 3);

export function AboutMobileCountries(): React.JSX.Element {
  return (
    <>
      <section className="about-mobile-countries-section" aria-labelledby="about-mobile-countries-title">
        <MobileReflectTitle
          className="about-mobile-countries-title"
          align="center"
          stacked
          lines={[
            { text: 'WE WORK WITH MORE THAN' },
            { text: '10 COUNTRIES', accent: true },
          ]}
        />

        <div className="about-mobile-map-wrap">
          <Image
            src="/about/world-map.webp"
            alt="World map"
            fill
            sizes="100vw"
            loading="lazy"
            fetchPriority="low"
            className="about-mobile-map-img"
          />
        </div>
      </section>

      <section className="about-mobile-impact-section" aria-label="Company impact">
        <div className="about-mobile-impact-stats">
          {MOBILE_IMPACT_STATS.map((stat) => (
            <MobileImpactStat key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </>
  );
}

export function AboutMobileTeam(): React.JSX.Element {
  return (
    <section className="about-mobile-team-section" aria-labelledby="about-mobile-team-title">
      <div className="about-mobile-team-inner">
        <MobileReflectTitle
          className="about-mobile-team-title"
          align="left"
          lines={[
            { text: 'MEET OUR ' },
            { text: 'TEAM', accent: true },
          ]}
        />

        <div className="about-mobile-team-content">
          <div className="about-mobile-team-copy-glow" aria-hidden />
          <p className="about-mobile-team-copy">{teamText}</p>

          <div className="about-mobile-team-cta">
            <ExploreButton href="/team" label="Explore" />
          </div>
        </div>
      </div>

      <div className="about-mobile-team-image-wrap" aria-hidden>
        <div className="about-mobile-team-image-frame">
          <Image
            src="/about/meet-our-team-collaboration-mobile.webp"
            alt=""
            fill
            sizes="90vw"
            loading="lazy"
            fetchPriority="low"
            className="about-mobile-team-image"
          />
        </div>
      </div>
    </section>
  );
}

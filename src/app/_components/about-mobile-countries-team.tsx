'use client';

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

import { useHomeI18n } from './home-i18n-provider';
import { ExploreButton } from './home-ui';
import { MobileImpactStat, MobileReflectTitle } from './about-mobile-ui';

export function AboutMobileCountries(): React.JSX.Element {
  const { aboutData } = useHomeI18n();
  const mobileImpactStats = aboutData.impactStats.slice(0, 3);

  return (
    <>
      <section className="about-mobile-countries-section" aria-labelledby="about-mobile-countries-title">
        <MobileReflectTitle
          className="about-mobile-countries-title"
          align="center"
          stacked
          lines={aboutData.countriesTitleMobile.lines.map((line) => ({
            text: line.text,
            accent: line.accent === true,
          }))}
        />

        <div className="about-mobile-map-wrap">
          <CdnImage
            src={staticAsset("/about/world-map.webp")}
            alt={aboutData.countriesMapAlt}
            fill
            sizes="100vw"
            loading="lazy"
            fetchPriority="low"
            className="about-mobile-map-img"
          />
        </div>
      </section>

      <section className="about-mobile-impact-section" aria-label={aboutData.ariaImpact}>
        <div className="about-mobile-impact-stats">
          {mobileImpactStats.map((stat) => (
            <MobileImpactStat key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </>
  );
}

export function AboutMobileTeam(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-mobile-team-section" aria-labelledby="about-mobile-team-title">
      <div className="about-mobile-team-inner">
        <MobileReflectTitle
          className="about-mobile-team-title"
          align="left"
          lines={[
            { text: aboutData.teamTitle.plain },
            { text: aboutData.teamTitle.accent, accent: true },
          ]}
        />

        <div className="about-mobile-team-content">
          <div className="about-mobile-team-copy-glow" aria-hidden />
          <p className="about-mobile-team-copy">{aboutData.teamText}</p>

          <div className="about-mobile-team-cta">
            <ExploreButton href="/team" label={aboutData.exploreCta} />
          </div>
        </div>
      </div>

      <div className="about-mobile-team-image-wrap" aria-hidden>
        <div className="about-mobile-team-image-frame">
          <CdnImage
            src={staticAsset("/about/meet-our-team-collaboration-mobile.webp")}
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

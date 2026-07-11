'use client';

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

import { useHomeI18n } from './home-i18n-provider';
import { ExploreButton } from './home-ui';
import { MobileImpactStat, MobileReflectTitle } from './about-mobile-ui';

function AboutMobileCountriesScene(): React.JSX.Element {
  return (
    <div className="about-mobile-countries-scene" aria-hidden>
      <span className="about-mobile-countries-bg-base">
        <span className="about-mobile-countries-bg-side about-mobile-countries-bg-side--left" />
        <span className="about-mobile-countries-bg-side about-mobile-countries-bg-side--right" />
      </span>
      <span className="about-mobile-countries-bg-grid" />
      <span className="about-mobile-countries-bg-glow" />
      <span className="about-mobile-countries-center-column" />
      <span className="about-mobile-countries-glass about-mobile-countries-glass--left" />
      <span className="about-mobile-countries-glass about-mobile-countries-glass--right" />
      <span className="about-mobile-countries-beam-bottom" />
      <span className="about-mobile-countries-beam-bottom-core" />
      <span className="about-mobile-countries-atmosphere" />
    </div>
  );
}

export function AboutMobileCountries(): React.JSX.Element {
  const { aboutData } = useHomeI18n();
  const mobileImpactStats = aboutData.impactStats.slice(0, 3);

  return (
    <section className="about-mobile-countries-section" aria-labelledby="about-mobile-countries-title">
      <AboutMobileCountriesScene />

      <MobileReflectTitle
        className="about-mobile-countries-title"
        titleId="about-mobile-countries-title"
        align="center"
        stacked
        showMirror={false}
        lines={aboutData.countriesTitleMobile.lines.map((line) => ({
          text: line.text,
          accent: line.accent === true,
        }))}
      />

      <div className="about-mobile-map-wrap">
        <CdnImage
          src={staticAsset('/about/world-map.webp')}
          alt={aboutData.countriesMapAlt}
          fill
          sizes="(max-width: 430px) 88vw, 365px"
          loading="lazy"
          fetchPriority="low"
          className="about-mobile-map-img"
        />
      </div>

      <div className="about-mobile-countries-stats" aria-label={aboutData.ariaImpact}>
        {mobileImpactStats.map((stat) => (
          <MobileImpactStat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

export function AboutMobileTeam(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-mobile-team-section" aria-labelledby="about-mobile-team-title">
      <div className="about-mobile-team-inner">
        <MobileReflectTitle
          className="about-mobile-team-title"
          titleId="about-mobile-team-title"
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
            src={staticAsset('/about/team-no-bg.webp')}
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

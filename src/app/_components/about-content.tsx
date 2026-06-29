'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';
import { useHomeI18n } from './home-i18n-provider';
import { ExploreButton } from './home-ui';
import { GradientStat, ReflectTitle } from './about-ui';

function AboutMissionVision(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <>
      <div className="about-cube" aria-hidden>
        <Image
          src={staticAsset("/about/cube-transparent-v2.webp")}
          alt=""
          fill
          sizes="205px"
          loading="lazy"
          fetchPriority="low"
          className="about-cube-img"
        />
      </div>
      <ReflectTitle
        className="about-title-mission"
        plain={aboutData.missionTitle.plain}
        accent={aboutData.missionTitle.accent}
      />
      <p className="about-copy about-copy-mission">{aboutData.missionText}</p>
      <ReflectTitle
        className="about-title-vision"
        plain={aboutData.visionTitle.plain}
        accent={aboutData.visionTitle.accent}
      />
      <p className="about-copy about-copy-vision">{aboutData.visionText}</p>
    </>
  );
}

function AboutWhyChoose(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-why" aria-labelledby="about-why-title">
      <div className="about-why-panel" aria-hidden />
      <ReflectTitle
        className="about-title-why"
        plain={aboutData.whyTitle.plain}
        accent={aboutData.whyTitle.accent}
        trailing={aboutData.whyTitle.trailing}
      />
      {aboutData.whyIllustrations.map((item) => (
        <div key={item.alt} className={`about-why-illustration ${item.className}`}>
          <Image
            src={item.src}
            alt=""
            fill
            sizes="250px"
            loading="lazy"
            fetchPriority="low"
            className="about-why-img"
          />
        </div>
      ))}
      <div className="about-why-features">
        {aboutData.whyFeatures.map((feature) => (
          <p key={feature.lead} className="about-why-feature">
            <span>{feature.lead}</span>
            <span>{feature.rest}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

function AboutCountries(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-countries" aria-labelledby="about-countries-title">
      <ReflectTitle
        className="about-title-countries"
        plain={aboutData.countriesTitle.plain}
        accent={aboutData.countriesTitle.accent}
      />
      <div className="about-map" aria-hidden>
        <Image
          src={staticAsset("/about/world-map.webp")}
          alt=""
          fill
          sizes="987px"
          loading="lazy"
          fetchPriority="low"
          className="about-map-img"
        />
      </div>
      <div className="about-impact-stats">
        {aboutData.impactStats.map((stat) => (
          <GradientStat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function AboutTeam(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-team" aria-labelledby="about-team-title">
      <ReflectTitle
        className="about-title-team"
        plain={aboutData.teamTitle.plain}
        accent={aboutData.teamTitle.accent}
      />
      <p className="about-copy about-copy-team">{aboutData.teamText}</p>
      <div className="about-team-cta">
        <ExploreButton href="/services" label={aboutData.exploreCta} />
      </div>
      <div className="about-team-image">
        <Image
          src={staticAsset("/about/team-live.webp")}
          alt={aboutData.teamImageAlt}
          fill
          sizes="663px"
          loading="lazy"
          fetchPriority="low"
          className="about-team-img"
        />
      </div>
    </section>
  );
}

export function AboutContent(): React.JSX.Element {
  return (
    <>
      <AboutMissionVision />
      <AboutWhyChoose />
      <AboutCountries />
      <AboutTeam />
    </>
  );
}

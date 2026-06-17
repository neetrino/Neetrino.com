import Image from 'next/image';
import {
  impactStats,
  missionText,
  teamText,
  visionText,
  whyFeatures,
  whyIllustrations,
} from './about-data';
import { ExploreButton } from './home-ui';
import { GradientStat, ReflectTitle } from './about-ui';

function AboutMissionVision(): React.JSX.Element {
  return (
    <>
      <div className="about-cube" aria-hidden>
        <Image src="/about/cube.png" alt="" fill sizes="191px" className="about-cube-img" />
      </div>
      <ReflectTitle className="about-title-mission" plain="THE " accent="MISSION" />
      <p className="about-copy about-copy-mission">{missionText}</p>
      <ReflectTitle className="about-title-vision" plain="THE " accent="VISION" />
      <p className="about-copy about-copy-vision">{visionText}</p>
    </>
  );
}

function AboutWhyChoose(): React.JSX.Element {
  return (
    <section className="about-why" aria-labelledby="about-why-title">
      <div className="about-why-panel" aria-hidden />
      <ReflectTitle
        className="about-title-why"
        plain="WHY "
        accent="CHOOSE"
        trailing=" US?"
      />
      {whyIllustrations.map((item) => (
        <div key={item.alt} className={`about-why-illustration ${item.className}`}>
          <Image src={item.src} alt="" fill sizes="250px" className="about-why-img" />
        </div>
      ))}
      <div className="about-why-features">
        {whyFeatures.map((feature) => (
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
  return (
    <section className="about-countries" aria-labelledby="about-countries-title">
      <ReflectTitle
        className="about-title-countries"
        plain="WE WORK WITH MORE THAN "
        accent="10 COUNTRIES"
      />
      <div className="about-map" aria-hidden>
        <Image src="/about/world-map.svg" alt="" fill sizes="987px" className="about-map-img" />
      </div>
      <div className="about-impact-stats">
        {impactStats.map((stat) => (
          <GradientStat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function AboutTeam(): React.JSX.Element {
  return (
    <section className="about-team" aria-labelledby="about-team-title">
      <ReflectTitle className="about-title-team" plain="MEET OUR " accent="TEAM" />
      <p className="about-copy about-copy-team">{teamText}</p>
      <div className="about-team-cta">
        <ExploreButton href="/services" label="Explore" />
      </div>
      <div className="about-team-image">
        <Image src="/about/team.png" alt="Neetrino team" fill sizes="620px" className="about-team-img" />
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

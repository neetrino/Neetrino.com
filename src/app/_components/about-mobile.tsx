import Image from 'next/image';
import {
  heroHeadline,
  heroIntroLeft,
  heroIntroRight,
  impactStats,
  missionText,
  teamText,
  visionText,
  whyFeatures,
  whyIllustrations,
} from './about-data';
import { GradientStat } from './about-ui';

const sections = [
  { title: 'The Mission', body: missionText },
  { title: 'The Vision', body: visionText },
] as const;

export function AboutMobile(): React.JSX.Element {
  return (
    <div className="about-mobile">
      <h1 className="about-mobile-headline">
        {heroHeadline.line1Plain} <em>{heroHeadline.line1Accent}</em> {heroHeadline.line2}{' '}
        {heroHeadline.line3} <em>{heroHeadline.line4}</em>
      </h1>
      <p className="about-mobile-intro">{heroIntroRight}</p>
      <p className="about-mobile-intro">{heroIntroLeft}</p>

      <div className="about-mobile-stats">
        {impactStats.map((stat) => (
          <GradientStat key={stat.label} {...stat} />
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.title} className="about-mobile-section">
          <h2>{section.title}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section className="about-mobile-section">
        <h2>Why choose us?</h2>
        <div className="about-mobile-why">
          {whyIllustrations.map((item) => (
            <Image key={item.alt} src={item.src} alt={item.alt} width={96} height={96} />
          ))}
        </div>
        <ul className="about-mobile-features">
          {whyFeatures.map((feature) => (
            <li key={feature.lead}>
              {feature.lead} {feature.rest}
            </li>
          ))}
        </ul>
      </section>

      <section className="about-mobile-section">
        <h2>Meet our team</h2>
        <Image
          src="/about/team.png"
          alt="Neetrino team"
          width={620}
          height={402}
          className="about-mobile-team"
        />
        <p>{teamText}</p>
      </section>
    </div>
  );
}

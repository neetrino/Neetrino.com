'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';

import { useHomeI18n } from './home-i18n-provider';
import { MobileHeroStat } from './about-mobile-ui';

export function AboutMobileHero(): React.JSX.Element {
  const { aboutData } = useHomeI18n();
  const { heroHeadline, heroIntroMobile, heroStats } = aboutData;

  return (
    <section className="about-mobile-hero" aria-labelledby="about-mobile-title">
      <div className="about-mobile-hero-robot" aria-hidden>
        <div className="about-mobile-hero-robot-scale">
          <div className="about-mobile-hero-robot-flip">
            <div className="about-mobile-hero-robot-frame">
              <Image
                src={staticAsset("/about/robot-mobile.webp")}
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="102vw"
                className="about-mobile-hero-robot-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="about-mobile-hero-content">
        <div className="about-mobile-hero-headline-wrap">
          <h1 id="about-mobile-title" className="about-mobile-hero-headline">
            <span className="about-mobile-hero-headline-line">
              {heroHeadline.line1Plain} <em>{heroHeadline.line1Accent}</em>
            </span>
            <span className="about-mobile-hero-headline-line">{heroHeadline.line2}</span>
            <span className="about-mobile-hero-headline-line">{heroHeadline.line3}</span>
            <span className="about-mobile-hero-headline-line about-mobile-hero-headline-line--accent">
              <em>{heroHeadline.line4}</em>
            </span>
          </h1>
        </div>

        <p className="about-mobile-hero-intro">{heroIntroMobile}</p>

        <div className="about-mobile-hero-stats-panel">
          <div className="about-mobile-hero-stats-bg" aria-hidden />
          <div className="about-mobile-hero-stats-grid">
            {heroStats.map((stat) => (
              <MobileHeroStat key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

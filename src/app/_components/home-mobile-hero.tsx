import Image from 'next/image';
import Link from 'next/link';

import { HOME_IMAGE_QUALITY } from './home-constants';
import { heroStats } from './home-data';
import { HomeHeroBgCore } from './home-hero-bg-core';
import { HomeHeroRobot } from './home-hero-robot';
import { HomeHeroTechAtmosphere } from './home-hero-tech-atmosphere';
import { HeroStatToneClass } from './home-ui';

/** Mobile hero — Figma node 1:1478 flow layout; background matches desktop. */
export function HomeMobileHero(): React.JSX.Element {
  const [firstStat, secondStat, thirdStat] = heroStats;

  return (
    <section className="home-mobile-hero home-hero" aria-label="Hero">
      <div className="home-mobile-hero-scene" aria-hidden>
        <div className="home-hero-bg-shell">
          <HomeHeroBgCore philippPriority />
        </div>
        <HomeHeroTechAtmosphere />
      </div>

      <div className="home-mobile-hero-robot-layer" aria-hidden>
        <HomeHeroRobot priority />
      </div>

      <div className="home-mobile-hero-copy">
        <p className="home-mobile-hero-brand">
          <span>NEET</span>
          <span>RIN</span>
          <span>O</span>
        </p>

        <p className="home-mobile-hero-tagline">
          <span>We build </span>
          <strong>high-performance websites</strong>
          <span>
            {' '}
            and digital solutions that help businesses grow, scale, and stand out online.
          </span>
        </p>
      </div>

      <div className="home-mobile-hero-stats">
        <div className="home-mobile-hero-stats-panel">
          <div className="home-mobile-hero-stats-bg" aria-hidden />

          <div className="home-mobile-hero-actions">
            <Link href="/#contact" className="home-mobile-hero-btn home-mobile-hero-btn--primary">
              Get a Quote
            </Link>
            <Link href="/#contact" className="home-mobile-hero-btn home-mobile-hero-btn--contact">
              Contact
            </Link>
          </div>

          <div className="home-mobile-hero-stats-row">
          {firstStat ? (
            <article className={`home-mobile-hero-stat ${HeroStatToneClass(firstStat.tone)}`}>
              <p className="home-mobile-hero-stat-value">{firstStat.value}</p>
              <p className="home-mobile-hero-stat-label">
                <span>Years of </span>
                <span>experience</span>
              </p>
            </article>
          ) : null}

          {secondStat ? (
            <article className={`home-mobile-hero-stat ${HeroStatToneClass(secondStat.tone)}`}>
              <p className="home-mobile-hero-stat-value">{secondStat.value}</p>
              <p className="home-mobile-hero-stat-label">{secondStat.label}</p>
            </article>
          ) : null}
        </div>

        {thirdStat ? (
          <article
            className={`home-mobile-hero-stat home-mobile-hero-stat-wide ${HeroStatToneClass(thirdStat.tone)}`}
          >
            <p className="home-mobile-hero-stat-value">{thirdStat.value}</p>
            <p className="home-mobile-hero-stat-label">{thirdStat.label}</p>
            <div className="home-mobile-hero-stat-hand" aria-hidden>
              <Image
                src="/figma-home/28-a.webp"
                alt=""
                fill
                sizes="270px"
                quality={HOME_IMAGE_QUALITY}
                className="home-mobile-hero-stat-hand-img"
              />
            </div>
          </article>
        ) : null}
        </div>
      </div>
    </section>
  );
}

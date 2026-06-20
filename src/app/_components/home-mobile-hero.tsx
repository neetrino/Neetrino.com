'use client';

import Image from 'next/image';
import Link from 'next/link';

import { HOME_IMAGE_QUALITY } from './home-constants';
import { HomeHeroBgCore } from './home-hero-bg-core';
import { HomeHeroRobot } from './home-hero-robot';
import { HomeHeroTechAtmosphere } from './home-hero-tech-atmosphere';
import { useHomeI18n } from './home-i18n-provider';
import { HeroStatToneClass } from './home-ui';

/** Mobile hero — Figma node 1:1478 flow layout; background matches desktop. */
export function HomeMobileHero(): React.JSX.Element {
  const { heroStats, homeCopy } = useHomeI18n();
  const [firstStat, secondStat, thirdStat] = heroStats;
  const { hero } = homeCopy;

  return (
    <section className="home-mobile-hero home-hero" aria-label={hero.ariaLabel}>
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
          <span>{hero.brand.first}</span>
          <span>{hero.brand.second}</span>
          <span>{hero.brand.third}</span>
        </p>

        <p className="home-mobile-hero-tagline">
          <span>{hero.tagline.prefix}</span>
          <strong>{hero.tagline.accent}</strong>
          <span>{hero.tagline.suffix}</span>
        </p>
      </div>

      <div className="home-mobile-hero-stats">
        <div className="home-mobile-hero-stats-panel">
          <div className="home-mobile-hero-stats-bg" aria-hidden />

          <div className="home-mobile-hero-actions">
            <Link href="/#contact" className="home-mobile-hero-btn home-mobile-hero-btn--primary">
              {hero.actions.quote}
            </Link>
            <Link href="/#contact" className="home-mobile-hero-btn home-mobile-hero-btn--contact">
              {hero.actions.contact}
            </Link>
          </div>

          <div className="home-mobile-hero-stats-row">
            {firstStat ? (
              <article className={`home-mobile-hero-stat ${HeroStatToneClass(firstStat.tone)}`}>
                <p className="home-mobile-hero-stat-value">{firstStat.value}</p>
                <p className="home-mobile-hero-stat-label">
                  {firstStat.mobileLabelLines?.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
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
            </article>
          ) : null}
        </div>
      </div>

      {thirdStat ? (
        <div className="home-mobile-hero-hand-layer" aria-hidden>
          <div className="home-mobile-hero-hand">
            <div className="home-mobile-hero-hand-motion">
              <Image
                src="/figma-home/28-a.webp"
                alt=""
                fill
                sizes="550px"
                quality={HOME_IMAGE_QUALITY}
                className="home-mobile-hero-stat-hand-img"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

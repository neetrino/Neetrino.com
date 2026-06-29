'use client';

import Link from 'next/link';

import { HomeHeroBgCore } from './home-hero-bg-core';
import { HomeHeroRobot } from './home-hero-robot';
import { useHomeI18n } from './home-i18n-provider';
import { AnimatedStatValue } from './animated-stat-value';
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
                <AnimatedStatValue value={firstStat.value} className="home-mobile-hero-stat-value" />
                <p className="home-mobile-hero-stat-label">
                  {firstStat.mobileLabelLines?.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </p>
              </article>
            ) : null}

            {secondStat ? (
              <article className={`home-mobile-hero-stat ${HeroStatToneClass(secondStat.tone)}`}>
                <AnimatedStatValue value={secondStat.value} className="home-mobile-hero-stat-value" />
                <p className="home-mobile-hero-stat-label">{secondStat.label}</p>
              </article>
            ) : null}
          </div>

          {thirdStat ? (
            <article
              className={`home-mobile-hero-stat home-mobile-hero-stat-wide ${HeroStatToneClass(thirdStat.tone)}`}
            >
              <AnimatedStatValue value={thirdStat.value} className="home-mobile-hero-stat-value" />
              <p className="home-mobile-hero-stat-label">{thirdStat.label}</p>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}

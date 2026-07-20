'use client';

import { HomeHeroBgCore } from './home-hero-bg-core';
import { HomeHeroBottomPanel } from './home-hero-bottom-panel';
import { HomeHeroHandLayer } from './home-hero-hand-layer';
import { HomeHeroRobot } from './home-hero-robot';
import { useHomeI18n } from './home-i18n-provider';

import { AnimatedStatValue } from './animated-stat-value';
import { HeroStatToneClass } from './home-ui';

export function HomeHero(): React.JSX.Element {
  const { heroStats, homeCopy } = useHomeI18n();
  const [firstStat, secondStat, thirdStat] = heroStats;
  const { hero } = homeCopy;

  return (
    <section className="home-hero" aria-label={hero.ariaLabel}>
      <div className="home-hero-bg-shell" aria-hidden>
        <HomeHeroBgCore philippPriority brandPriority />
        <HomeHeroRobot priority />
        <HomeHeroBottomPanel />
      </div>

      <div className="home-hero-stage">
        <p className="home-hero-tagline">
          <span>{hero.tagline.prefix}</span>
          <strong>{hero.tagline.accent}</strong>
          <span>{hero.tagline.suffix}</span>
        </p>

        <div className="home-hero-stats">
          <div className="home-hero-stats-group">
            {firstStat && secondStat ? (
              <>
                <article className={`home-hero-stat ${HeroStatToneClass(firstStat.tone)}`}>
                  <AnimatedStatValue value={firstStat.value} className="home-hero-stat-value" />
                  <p className="home-hero-stat-label">
                    {firstStat.labelLines?.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </article>
                <article className={`home-hero-stat ${HeroStatToneClass(secondStat.tone)}`}>
                  <AnimatedStatValue value={secondStat.value} className="home-hero-stat-value" />
                  <p className="home-hero-stat-label">{secondStat.label}</p>
                </article>
              </>
            ) : null}
          </div>

          {thirdStat ? (
            <article className={`home-hero-stat home-hero-stat-wide ${HeroStatToneClass(thirdStat.tone)}`}>
              <AnimatedStatValue value={thirdStat.value} className="home-hero-stat-value" />
              <p className="home-hero-stat-label">{thirdStat.label}</p>
            </article>
          ) : null}
        </div>
      </div>

      <HomeHeroHandLayer />
    </section>
  );
}

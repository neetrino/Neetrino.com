'use client';

import Image from 'next/image';

import { HomeHeroBgCore } from './home-hero-bg-core';
import { HomeHeroDeferredDecor } from './home-hero-deferred-decor';
import { HomeHeroHandLayer } from './home-hero-hand-layer';
import { HomeHeroRobot } from './home-hero-robot';
import { useHomeI18n } from './home-i18n-provider';

import { HeroStatToneClass } from './home-ui';

export function HomeHero(): React.JSX.Element {
  const { heroStats, homeCopy } = useHomeI18n();
  const [firstStat, secondStat, thirdStat] = heroStats;
  const { hero } = homeCopy;

  return (
    <section className="home-hero" aria-label={hero.ariaLabel}>
      <div className="home-hero-bg-shell" aria-hidden>
        <HomeHeroBgCore philippPriority brandPriority />
        <HomeHeroRobot />
        <HomeHeroDeferredDecor />
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
                  <p className="home-hero-stat-value">{firstStat.value}</p>
                  <p className="home-hero-stat-label">
                    {firstStat.labelLines?.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                </article>
                <article className={`home-hero-stat ${HeroStatToneClass(secondStat.tone)}`}>
                  <p className="home-hero-stat-value">{secondStat.value}</p>
                  <p className="home-hero-stat-label">{secondStat.label}</p>
                </article>
              </>
            ) : null}
          </div>

          {thirdStat ? (
            <article className={`home-hero-stat home-hero-stat-wide ${HeroStatToneClass(thirdStat.tone)}`}>
              <p className="home-hero-stat-value">{thirdStat.value}</p>
              <p className="home-hero-stat-label">{thirdStat.label}</p>
            </article>
          ) : null}
        </div>

        <a href="#contact" className="home-hero-chat" aria-label={hero.chatAriaLabel}>
          <Image src="/figma-home/chat.svg" alt="" width={79} height={79} loading="lazy" fetchPriority="low" />
        </a>
      </div>

      <HomeHeroHandLayer />
    </section>
  );
}

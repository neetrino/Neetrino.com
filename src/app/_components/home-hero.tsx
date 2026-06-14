import Image from 'next/image';
import { heroStats } from './home-data';
import { HomeHeroBottomPanel } from './home-hero-bottom-panel';
import { HeroStatToneClass } from './home-ui';

export function HomeHero(): React.JSX.Element {
  const [firstStat, secondStat, thirdStat] = heroStats;

  return (
    <section id="home" className="home-hero">
      <div className="home-hero-bg-philipp" aria-hidden>
        <Image
          src="/figma-home/philipp-hubert-dvvjh-ucdb30-unsplash1.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-bg-philipp-image"
        />
      </div>

      <div className="home-hero-bg-glow" aria-hidden>
        <Image
          src="/figma-home/erica-anderson1.png"
          alt=""
          fill
          priority
          sizes="824px"
          className="home-hero-bg-glow-image"
        />
      </div>

      <div className="home-hero-stage home-hero-stage-robot" aria-hidden>
        <div className="home-hero-robot-wrap">
          <div className="home-hero-robot-crop">
            <div className="home-hero-robot-motion">
              <Image
                src="/figma-home/30.png"
                alt=""
                fill
                priority
                sizes="629px"
                className="home-hero-robot"
              />
            </div>
          </div>
        </div>
      </div>

      <HomeHeroBottomPanel />

      <div className="home-hero-stage">
        <p className="home-hero-brand" aria-hidden>
          NEETRINO
        </p>

        <p className="home-hero-tagline">
          <span>We build </span>
          <strong>high-performance websites</strong>
          <span>
            {' '}
            and digital solutions that help businesses grow, scale, and stand out online.
          </span>
        </p>

        <div className="home-hero-stats">
          <div className="home-hero-stats-group">
            {firstStat && secondStat ? (
              <>
                <article className={`home-hero-stat ${HeroStatToneClass(firstStat.tone)}`}>
                  <p className="home-hero-stat-value">{firstStat.value}</p>
                  <p className="home-hero-stat-label">
                    <span>Years of</span>
                    <span>experience</span>
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

        <div className="home-hero-hand" aria-hidden>
          <Image
            src="/figma-home/28-a.png"
            alt=""
            fill
            sizes="450px"
            className="home-hero-hand-image"
          />
        </div>

        <a href="#contact" className="home-hero-chat" aria-label="Open chat">
          <Image src="/figma-home/chat.svg" alt="" width={79} height={79} />
        </a>
      </div>
    </section>
  );
}

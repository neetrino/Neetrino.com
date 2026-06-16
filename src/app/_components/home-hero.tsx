import Image from 'next/image';

import { heroStats } from './home-data';

import { HomeHeroBottomPanel } from './home-hero-bottom-panel';
import { HomeHeroTechAtmosphere } from './home-hero-tech-atmosphere';

import { HeroStatToneClass } from './home-ui';



export function HomeHero(): React.JSX.Element {

  const [firstStat, secondStat, thirdStat] = heroStats;



  return (

    <section className="home-hero" aria-label="Hero">

      <div className="home-hero-bg-shell" aria-hidden>

        <div className="home-hero-bg-mesh">

          <div className="home-hero-bg-mesh-scroll">

            <div className="home-hero-bg-mesh-rotate">

              <Image

                src="/figma-home/vector1.svg"

                alt=""

                fill

                priority

                sizes="1722px"

                className="home-hero-bg-mesh-image"

              />

            </div>

          </div>

        </div>



        <div className="home-hero-bg-philipp">

          <div className="home-hero-bg-philipp-flip">

            <Image

              src="/figma-home/philipp-hubert-dvvjh-ucdb30-unsplash1.webp"

              alt=""

              fill

              priority

              sizes="1440px"

              className="home-hero-bg-philipp-image"

            />

          </div>

        </div>



        <HomeHeroBottomPanel />

        <HomeHeroTechAtmosphere />

        <div className="home-hero-lower-matte-band" />

      </div>



      <div className="home-hero-brand-layer" aria-hidden>
        <p className="home-hero-brand">NEETRINO</p>
      </div>

      <div className="home-hero-stage home-hero-stage-robot" aria-hidden>

        <div className="home-hero-robot-wrap">

          <div className="home-hero-robot-crop">

            <div className="home-hero-robot-motion">

              <Image

                src="/figma-home/30.webp"

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



      <div className="home-hero-stage">

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



        <a href="#contact" className="home-hero-chat" aria-label="Open chat">

          <Image src="/figma-home/chat.svg" alt="" width={79} height={79} />

        </a>

      </div>

      <div className="home-hero-hand-layer" aria-hidden>
        <div className="home-hero-hand">
          <div className="home-hero-hand-motion">
            <Image
              src="/figma-home/28-a.webp"
              alt=""
              fill
              priority
              sizes="880px"
              className="home-hero-hand-image"
            />
          </div>
        </div>
      </div>

    </section>

  );

}



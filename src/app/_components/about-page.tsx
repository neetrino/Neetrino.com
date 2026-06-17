import Image from 'next/image';
import { AboutContent } from './about-content';
import { AboutHero } from './about-hero';
import { AboutMobile } from './about-mobile';
import { HOME_IMAGE_QUALITY } from './home-constants';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './about.css';

function AboutDecor(): React.JSX.Element {
  return (
    <div className="about-decor" aria-hidden>
      <div className="home-hero-bg-mesh">
        <div className="home-hero-bg-mesh-scroll">
          <div className="home-hero-bg-mesh-rotate">
            <Image
              src="/figma-home/vector1.svg"
              alt=""
              fill
              sizes="1722px"
              quality={HOME_IMAGE_QUALITY}
              className="home-hero-bg-mesh-image"
            />
          </div>
        </div>
      </div>

      <div className="home-page-glow" />
      <span className="about-glow-blue-1" />
      <span className="about-glow-blue-2" />
      <span className="about-radial" />

      <div className="about-hero-streak">
        <Image src="/about/hero-streak.svg" alt="" fill sizes="1318px" className="about-hero-streak-img" />
      </div>

      <span className="about-ray about-ray-1" />
      <span className="about-ray about-ray-2" />
      <span className="about-ray about-ray-3" />
      <span className="about-ray about-ray-4" />
      <span className="about-ray about-ray-5" />

      <span className="about-frost" />
      <span className="about-beam" />
    </div>
  );
}

export function AboutPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="about-top" srOnlyTitle="About Neetrino">
      <div className="home-page-center-beam" aria-hidden data-name="Rectangle 17418" />
      <div className="about-body">
        <AboutDecor />
        <AboutHero />
        <AboutContent />
      </div>
      <AboutMobile />
    </NeetrinoPageShell>
  );
}

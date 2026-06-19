import Image from 'next/image';

const MOBILE_BG_IMG_CLASS = 'about-mobile-bg-img';

/** Full-page decorative background for the mobile about page (Figma node 1:2152). */
export function AboutMobileBackground(): React.JSX.Element {
  return (
    <div className="about-mobile-bg" aria-hidden>
      <div className="home-hero-bg-mesh">
        <div className="home-hero-bg-mesh-scroll">
          <div className="home-hero-bg-mesh-rotate">
            <Image
              src="/figma-home/vector1.svg"
              alt=""
              fill
              sizes="1722px"
              loading="lazy"
              fetchPriority="low"
              className="home-hero-bg-mesh-image"
            />
          </div>
        </div>
      </div>

      <div className="about-mobile-bg-hero-beam">
        <span className="about-mobile-bg-hero-beam-line about-mobile-bg-hero-beam-line--a" />
        <span className="about-mobile-bg-hero-beam-line about-mobile-bg-hero-beam-line--b" />
        <span className="about-mobile-bg-hero-beam-glow about-mobile-bg-hero-beam-glow--1" />
        <span className="about-mobile-bg-hero-beam-glow about-mobile-bg-hero-beam-glow--2" />
        <span className="about-mobile-bg-hero-beam-glow about-mobile-bg-hero-beam-glow--3" />
        <div className="about-mobile-bg-hero-side about-mobile-bg-hero-side--left">
          <div className="about-mobile-bg-hero-side-expand">
            <Image src="/about/mobile-bg/vector-27398.svg" alt="" fill sizes="1495px" className={MOBILE_BG_IMG_CLASS} />
          </div>
        </div>
        <div className="about-mobile-bg-hero-side about-mobile-bg-hero-side--right">
          <div className="about-mobile-bg-hero-side-expand about-mobile-bg-hero-side-expand--right">
            <Image src="/about/mobile-bg/vector-27397.svg" alt="" fill sizes="1297px" className={MOBILE_BG_IMG_CLASS} />
          </div>
        </div>
        <div className="about-mobile-bg-hero-panel about-mobile-bg-hero-panel--left">
          <div className="about-mobile-bg-hero-panel-expand">
            <Image src="/about/mobile-bg/rectangle-side-left.svg" alt="" fill sizes="502px" className={MOBILE_BG_IMG_CLASS} />
          </div>
        </div>
        <div className="about-mobile-bg-hero-panel about-mobile-bg-hero-panel--right">
          <div className="about-mobile-bg-hero-panel-expand">
            <Image src="/about/mobile-bg/rectangle-side-right.svg" alt="" fill sizes="502px" className={MOBILE_BG_IMG_CLASS} />
          </div>
        </div>
      </div>

      <div className="about-mobile-bg-ray about-mobile-bg-ray--hero">
        <div className="about-mobile-bg-ray-expand">
          <Image src="/about/ray-17417.svg" alt="" fill sizes="1868px" className={MOBILE_BG_IMG_CLASS} />
        </div>
      </div>

      <div className="about-mobile-bg-ellipse about-mobile-bg-ellipse--hero">
        <div className="about-mobile-bg-ellipse-expand">
          <Image src="/about/ellipse-27.svg" alt="" fill sizes="948px" className={MOBILE_BG_IMG_CLASS} />
        </div>
      </div>

      <div className="about-mobile-bg-ellipse about-mobile-bg-ellipse--mission">
        <div className="about-mobile-bg-ellipse-expand">
          <Image src="/about/mobile-bg/ellipse-28.svg" alt="" fill sizes="948px" className={MOBILE_BG_IMG_CLASS} />
        </div>
      </div>

      <div className="about-mobile-bg-ellipse about-mobile-bg-ellipse--vision">
        <div className="about-mobile-bg-ellipse-expand">
          <Image src="/about/mobile-bg/ellipse-29.svg" alt="" fill sizes="948px" className={MOBILE_BG_IMG_CLASS} />
        </div>
      </div>

      <div className="about-mobile-bg-ellipse about-mobile-bg-ellipse--countries">
        <Image src="/about/mobile-bg/ellipse-30.svg" alt="" fill sizes="693px" className={MOBILE_BG_IMG_CLASS} />
      </div>

      <div className="about-mobile-bg-beam-lights">
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--bottom-d">
          <Image src="/about/bottom-d.svg" alt="" fill sizes="305px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--bottom-c">
          <Image src="/about/mobile-bg/bottom-c.svg" alt="" fill sizes="137px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--bottom-b">
          <Image src="/about/mobile-bg/bottom-b.svg" alt="" fill sizes="137px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--center-c">
          <Image src="/about/mobile-bg/center-c.svg" alt="" fill sizes="42px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--center-b">
          <Image src="/about/mobile-bg/center-b.svg" alt="" fill sizes="56px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--center-a">
          <Image src="/about/mobile-bg/center-a.svg" alt="" fill sizes="55px" className={MOBILE_BG_IMG_CLASS} />
        </div>
        <div className="about-mobile-bg-beam-light about-mobile-bg-beam-light--bottom-a">
          <Image src="/about/mobile-bg/bottom-a.svg" alt="" fill sizes="126px" className={MOBILE_BG_IMG_CLASS} />
        </div>
      </div>

      <div className="about-mobile-bg-divider">
        <Image src="/about/mobile-bg/line-736.svg" alt="" fill sizes="440px" className={MOBILE_BG_IMG_CLASS} />
      </div>
    </div>
  );
}

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

const BG_IMG_CLASS = 'svc-mobile-bg-img';

/** Mobile services background — Figma node 1:911 (Light Rays Effect). */
export function ServicesMobileBackground(): React.JSX.Element {
  return (
    <div className="svc-mobile-bg" aria-hidden>
      <div className="svc-mobile-bg-mesh">
        <div className="svc-mobile-bg-mesh-scroll">
          <div className="svc-mobile-bg-mesh-rotate">
            <CdnImage
              src={staticAsset('/about/hero-streak.svg')}
              alt=""
              fill
              sizes="1722px"
              priority
              className="svc-mobile-bg-mesh-image"
            />
          </div>
        </div>
      </div>

      <div className="svc-mobile-bg-grid-far" aria-hidden />
      <div className="svc-mobile-bg-grid" aria-hidden />

      <div className="svc-mobile-bg-ellipse svc-mobile-bg-ellipse--left">
        <div className="svc-mobile-bg-ellipse-expand">
          <CdnImage
            src={staticAsset('/portfolio/ellipse-27.svg')}
            alt=""
            fill
            sizes="948px"
            className={BG_IMG_CLASS}
          />
        </div>
      </div>

      <div className="svc-mobile-bg-ellipse svc-mobile-bg-ellipse--right">
        <div className="svc-mobile-bg-ellipse-expand">
          <CdnImage
            src={staticAsset('/portfolio/ellipse-28.svg')}
            alt=""
            fill
            sizes="948px"
            className={BG_IMG_CLASS}
          />
        </div>
      </div>

      <div className="svc-mobile-bg-hero-beam">
        <span className="svc-mobile-bg-hero-beam-line svc-mobile-bg-hero-beam-line--a" />
        <span className="svc-mobile-bg-hero-beam-line svc-mobile-bg-hero-beam-line--b" />
        <span className="svc-mobile-bg-hero-beam-glow svc-mobile-bg-hero-beam-glow--1" />
        <span className="svc-mobile-bg-hero-beam-glow svc-mobile-bg-hero-beam-glow--2" />
        <span className="svc-mobile-bg-hero-beam-glow svc-mobile-bg-hero-beam-glow--3" />
        <div className="svc-mobile-bg-hero-side svc-mobile-bg-hero-side--left">
          <div className="svc-mobile-bg-hero-side-expand">
            <CdnImage
              src={staticAsset('/about/mobile-bg/vector-27398.svg')}
              alt=""
              fill
              sizes="1495px"
              className={BG_IMG_CLASS}
            />
          </div>
        </div>
        <div className="svc-mobile-bg-hero-side svc-mobile-bg-hero-side--right">
          <div className="svc-mobile-bg-hero-side-expand svc-mobile-bg-hero-side-expand--right">
            <CdnImage
              src={staticAsset('/about/mobile-bg/vector-27397.svg')}
              alt=""
              fill
              sizes="1297px"
              className={BG_IMG_CLASS}
            />
          </div>
        </div>
        <div className="svc-mobile-bg-hero-panel svc-mobile-bg-hero-panel--left">
          <div className="svc-mobile-bg-hero-panel-expand">
            <CdnImage
              src={staticAsset('/about/mobile-bg/rectangle-side-left.svg')}
              alt=""
              fill
              sizes="502px"
              className={BG_IMG_CLASS}
            />
          </div>
        </div>
        <div className="svc-mobile-bg-hero-panel svc-mobile-bg-hero-panel--right">
          <div className="svc-mobile-bg-hero-panel-expand">
            <CdnImage
              src={staticAsset('/about/mobile-bg/rectangle-side-right.svg')}
              alt=""
              fill
              sizes="502px"
              className={BG_IMG_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

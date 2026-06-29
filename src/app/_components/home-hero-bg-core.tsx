import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

import { HOME_IMAGE_QUALITY } from './home-constants';

type HomeHeroBgCoreProps = {
  philippPriority?: boolean;
  brandPriority?: boolean;
};

/** Mesh, philipp photo, and brand mark shared by desktop and mobile hero shells. */
export function HomeHeroBgCore({
  philippPriority = false,
  brandPriority = false,
}: HomeHeroBgCoreProps): React.JSX.Element {
  return (
    <>
      <div className="home-hero-bg-mesh">
        <div className="home-hero-bg-mesh-scroll">
          <div className="home-hero-bg-mesh-rotate">
            <CdnImage
              src={staticAsset("/about/hero-streak.svg")}
              alt=""
              fill
              sizes="1722px"
              quality={HOME_IMAGE_QUALITY}
              loading="lazy"
              fetchPriority="low"
              className="home-hero-bg-mesh-image"
            />
          </div>
        </div>
      </div>

      <div className="home-hero-bg-philipp">
        <div className="home-hero-bg-philipp-flip">
          <CdnImage
            src={staticAsset("/figma-home/philipp-hubert-dvvjh-ucdb30-unsplash1.webp")}
            alt=""
            fill
            priority={philippPriority}
            sizes="1440px"
            quality={HOME_IMAGE_QUALITY}
            fetchPriority={philippPriority ? 'high' : 'low'}
            className="home-hero-bg-philipp-image"
          />
        </div>
      </div>

      <div className="home-hero-brand-layer" aria-hidden>
        <CdnImage
          src={staticAsset("/figma-home/neetrino-hero-brand.svg")}
          alt=""
          width={1197}
          height={234}
          loading={brandPriority ? 'eager' : 'lazy'}
          fetchPriority={brandPriority ? 'high' : 'low'}
          priority={brandPriority}
          className="home-hero-brand"
        />
      </div>
    </>
  );
}

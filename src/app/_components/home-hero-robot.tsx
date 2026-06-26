import Image from 'next/image';

import { HOME_IMAGE_QUALITY } from './home-constants';

type HomeHeroRobotProps = {
  priority?: boolean;
};

/** Shared hero robot visual used on desktop and mobile home. */
export function HomeHeroRobot({ priority = false }: HomeHeroRobotProps): React.JSX.Element {
  return (
    <div className="home-hero-stage-robot" aria-hidden>
      <div className="home-hero-robot-wrap">
        <div className="home-hero-robot-crop">
          <div className="home-hero-robot-motion">
            <Image
              src="/figma-home/30.webp"
              alt=""
              fill
              sizes="629px"
              quality={HOME_IMAGE_QUALITY}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'low'}
              priority={priority}
              className="home-hero-robot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

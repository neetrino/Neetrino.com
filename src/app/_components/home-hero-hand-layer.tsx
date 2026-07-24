'use client';

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

import { HOME_IMAGE_QUALITY } from './home-constants';
import { useDeferredMount } from './use-deferred-mount';

const HAND_IDLE_TIMEOUT_MS = 600;
const HAND_ROOT_MARGIN = '80px 0px';
const HAND_ASSET_SRC = staticAsset('/figma-home/28-a.webp');

/** Defers the animated hand overlay until after the hero shell is painted. */
export function HomeHeroHandLayer(): React.JSX.Element | null {
  const { isReady, sentinelRef } = useDeferredMount({
    idleTimeoutMs: HAND_IDLE_TIMEOUT_MS,
    rootMargin: HAND_ROOT_MARGIN,
  });

  if (!isReady) {
    return <span ref={sentinelRef} className="home-hero-deferred-sentinel" aria-hidden />;
  }

  return (
    <div className="home-hero-hand-layer" aria-hidden>
      <div className="home-hero-hand">
        <div className="home-hero-hand-motion">
          <CdnImage
            src={HAND_ASSET_SRC}
            alt=""
            fill
            sizes="880px"
            quality={HOME_IMAGE_QUALITY}
            loading="lazy"
            fetchPriority="low"
            className="home-hero-hand-image"
          />
        </div>
      </div>
    </div>
  );
}

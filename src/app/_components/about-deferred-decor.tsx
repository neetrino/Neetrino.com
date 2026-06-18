'use client';

import Image from 'next/image';

import { HOME_IMAGE_QUALITY } from './home-constants';
import { useDeferredMount } from './use-deferred-mount';

const ABOUT_DECOR_BASE_IDLE_MS = 250;
const ABOUT_DECOR_HEAVY_IDLE_MS = 800;
const ABOUT_DECOR_ROOT_MARGIN = '160px 0px';

/** Lightweight hero-zone decor — visible soon after first paint. */
function AboutDecorBase(): React.JSX.Element {
  return (
    <>
      <div className="home-page-glow" />
      <span className="about-glow-blue-1" />
      <span className="about-radial" />

      <div className="about-hero-streak">
        <Image
          src="/about/hero-streak.svg"
          alt=""
          fill
          sizes="1318px"
          loading="lazy"
          fetchPriority="low"
          className="about-hero-streak-img"
        />
      </div>

      <span className="about-ray about-ray-1" />
    </>
  );
}

/** GPU-heavy decor — blurs, mesh, lower rays, glass panels. */
function AboutDecorHeavy(): React.JSX.Element {
  return (
    <>
      <div className="home-hero-bg-mesh">
        <div className="home-hero-bg-mesh-scroll">
          <div className="home-hero-bg-mesh-rotate">
            <Image
              src="/figma-home/vector1.svg"
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

      <span className="about-glow-blue-2" />
      <span className="about-glow-spectrum" />
      <span className="about-ray about-ray-2" />
      <span className="about-ray about-ray-3" />
      <span className="about-ray about-ray-4" />
      <span className="about-ray about-ray-5" />
      <span className="about-beam" />
    </>
  );
}

/** Staged about background decor to keep first paint fast without changing final UI. */
export function AboutDeferredDecor(): React.JSX.Element {
  const { isReady: isBaseReady, sentinelRef: baseSentinelRef } = useDeferredMount({
    idleTimeoutMs: ABOUT_DECOR_BASE_IDLE_MS,
    rootMargin: ABOUT_DECOR_ROOT_MARGIN,
  });
  const { isReady: isHeavyReady, sentinelRef: heavySentinelRef } = useDeferredMount({
    idleTimeoutMs: ABOUT_DECOR_HEAVY_IDLE_MS,
    rootMargin: ABOUT_DECOR_ROOT_MARGIN,
  });

  return (
    <div className="about-decor" aria-hidden>
      <span ref={baseSentinelRef} className="home-hero-deferred-sentinel" aria-hidden />
      {isBaseReady ? <AboutDecorBase /> : null}
      <span ref={heavySentinelRef} className="home-hero-deferred-sentinel" aria-hidden />
      {isHeavyReady ? <AboutDecorHeavy /> : null}
    </div>
  );
}

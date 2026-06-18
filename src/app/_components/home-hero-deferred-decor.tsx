'use client';

import { HomeHeroBottomPanel } from './home-hero-bottom-panel';
import { HomeHeroTechAtmosphere } from './home-hero-tech-atmosphere';
import { useDeferredMount } from './use-deferred-mount';

const DEFER_IDLE_TIMEOUT_MS = 900;
const DEFER_ROOT_MARGIN = '120px 0px';

/** Mounts expensive hero decor after first paint or when the hero nears the viewport. */
export function HomeHeroDeferredDecor(): React.JSX.Element | null {
  const { isReady, sentinelRef } = useDeferredMount({
    idleTimeoutMs: DEFER_IDLE_TIMEOUT_MS,
    rootMargin: DEFER_ROOT_MARGIN,
  });

  return (
    <>
      <span ref={sentinelRef} className="home-hero-deferred-sentinel" aria-hidden />
      {isReady ? (
        <>
          <HomeHeroBottomPanel />
          <HomeHeroTechAtmosphere />
        </>
      ) : null}
    </>
  );
}

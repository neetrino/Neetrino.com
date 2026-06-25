'use client';

import dynamic from 'next/dynamic';

import { useDeferredMount } from './use-deferred-mount';

const ABOUT_VISUAL_GEOMETRY_RADIUS = 1.45;
const ABOUT_VISUAL_CAMERA_DISTANCE = 2.6;
const ABOUT_VISUAL_IDLE_TIMEOUT_MS = 1800;
const ABOUT_VISUAL_ROOT_MARGIN = '320px 0px';

const GenerativeArtScene = dynamic(
  () =>
    import('@/components/ui/anomalous-matter-hero').then((module) => module.GenerativeArtScene),
  {
    ssr: false,
    loading: () => <div className="home-about-visual-placeholder" aria-hidden />,
  },
);

export function HomeAboutVisual(): React.JSX.Element {
  const { isReady, sentinelRef } = useDeferredMount({
    idleTimeoutMs: ABOUT_VISUAL_IDLE_TIMEOUT_MS,
    rootMargin: ABOUT_VISUAL_ROOT_MARGIN,
  });

  return (
    <div className="home-about-visual">
      <span ref={sentinelRef} aria-hidden />
      {isReady ? (
        <GenerativeArtScene
          className="home-about-visual-canvas"
          geometryRadius={ABOUT_VISUAL_GEOMETRY_RADIUS}
          cameraDistance={ABOUT_VISUAL_CAMERA_DISTANCE}
        />
      ) : (
        <div className="home-about-visual-placeholder" aria-hidden />
      )}
    </div>
  );
}

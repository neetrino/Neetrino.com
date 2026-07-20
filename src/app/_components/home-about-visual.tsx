'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { Application } from '@splinetool/runtime';

import { useDeferredMount } from './use-deferred-mount';

const ABOUT_SPLINE_SCENE =
  'https://prod.spline.design/g3KMDb3YnYqBx4eK/scene.splinecode';

/** Start loading before the section enters view so scroll does not wait on the scene. */
const ABOUT_SPLINE_IDLE_TIMEOUT_MS = 2200;
const ABOUT_SPLINE_ROOT_MARGIN = '480px 0px';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <div className="home-about-visual-placeholder" aria-hidden />,
});

type SplineApplicationInternals = {
  _renderer?: {
    pipeline?: {
      setWatermark?: (texture: null) => void;
      disableHelpers?: () => void;
    };
  };
  requestRender?: () => void;
};

function cleanSplineOverlays(app: Application): void {
  const internals = app as Application & SplineApplicationInternals;
  const pipeline = internals._renderer?.pipeline;
  pipeline?.setWatermark?.(null);
  pipeline?.disableHelpers?.();
  internals.requestRender?.();
}

export function HomeAboutVisual(): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const { isReady, sentinelRef } = useDeferredMount({
    idleTimeoutMs: ABOUT_SPLINE_IDLE_TIMEOUT_MS,
    rootMargin: ABOUT_SPLINE_ROOT_MARGIN,
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isReady) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const app = appRef.current;
        if (!app) {
          return;
        }

        if (entry?.isIntersecting) {
          app.play();
          return;
        }

        app.stop();
      },
      { rootMargin: '80px 0px', threshold: 0 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [isReady]);

  function handleSplineLoad(app: Application): void {
    app.setBackgroundColor('transparent');
    cleanSplineOverlays(app);
    app.setZoom(1.28);
    appRef.current = app;

    const root = rootRef.current;
    if (root) {
      const rect = root.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) {
        app.stop();
      }
    }
  }

  return (
    <div ref={rootRef} className="home-about-visual">
      <span ref={sentinelRef} className="home-hero-deferred-sentinel" aria-hidden />
      {isReady ? (
        <Spline
          scene={ABOUT_SPLINE_SCENE}
          className="home-about-visual-canvas"
          renderOnDemand
          onLoad={handleSplineLoad}
        />
      ) : (
        <div className="home-about-visual-placeholder" aria-hidden />
      )}
    </div>
  );
}

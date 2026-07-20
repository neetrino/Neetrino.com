'use client';

import dynamic from 'next/dynamic';
import type { Application } from '@splinetool/runtime';

const ABOUT_SPLINE_SCENE =
  'https://prod.spline.design/g3KMDb3YnYqBx4eK/scene.splinecode';

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

function handleSplineLoad(app: Application): void {
  app.setBackgroundColor('transparent');
  cleanSplineOverlays(app);
  app.setZoom(1.28);
}

export function HomeAboutVisual(): React.JSX.Element {
  return (
    <div className="home-about-visual">
      <Spline
        scene={ABOUT_SPLINE_SCENE}
        className="home-about-visual-canvas"
        onLoad={handleSplineLoad}
      />
    </div>
  );
}

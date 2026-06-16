'use client';

import dynamic from 'next/dynamic';

const ABOUT_VISUAL_GEOMETRY_RADIUS = 1.45;
const ABOUT_VISUAL_CAMERA_DISTANCE = 2.6;

const GenerativeArtScene = dynamic(
  () =>
    import('@/components/ui/anomalous-matter-hero').then((module) => module.GenerativeArtScene),
  {
    ssr: false,
    loading: () => <div className="home-about-visual-placeholder" aria-hidden />,
  },
);

export function HomeAboutVisual(): React.JSX.Element {
  return (
    <div className="home-about-visual">
      <GenerativeArtScene
        className="home-about-visual-canvas"
        geometryRadius={ABOUT_VISUAL_GEOMETRY_RADIUS}
        cameraDistance={ABOUT_VISUAL_CAMERA_DISTANCE}
      />
    </div>
  );
}

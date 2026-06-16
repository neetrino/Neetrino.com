'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type HomePortfolioCarouselProps = {
  children: ReactNode;
};

/** Pauses portfolio marquee animation when the section is off-screen. */
export function HomePortfolioCarousel({ children }: HomePortfolioCarouselProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        root.style.setProperty(
          '--home-portfolio-play-state',
          entry?.isIntersecting ? 'running' : 'paused',
        );
      },
      { rootMargin: '240px 0px', threshold: 0 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="home-portfolio-carousel">
      {children}
    </div>
  );
}

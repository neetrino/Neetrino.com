'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const PLAY_STATE_VAR = '--home-portfolio-play-state';
const INTERSECTION_ROOT_MARGIN = '240px 0px';

type HomePortfolioCarouselProps = {
  children: ReactNode;
};

/**
 * Keeps the portfolio marquee running while visible (including during page scroll).
 * Pauses only when the section is off-screen.
 */
export function HomePortfolioCarousel({ children }: HomePortfolioCarouselProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry?.isIntersecting ?? false;
        root.style.setProperty(PLAY_STATE_VAR, isVisible ? 'running' : 'paused');
      },
      { rootMargin: INTERSECTION_ROOT_MARGIN, threshold: 0 },
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

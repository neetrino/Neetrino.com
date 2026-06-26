'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const PLAY_STATE_VAR = '--home-portfolio-play-state';
const INTERSECTION_ROOT_MARGIN = '240px 0px';
const SCROLL_IDLE_MS = 150;

type HomePortfolioCarouselProps = {
  children: ReactNode;
};

/**
 * Pauses the portfolio marquee when the section is off-screen and while the
 * user is actively scrolling, so the animation never competes with scroll for
 * compositor time (avoids jank near the carousel).
 */
export function HomePortfolioCarousel({ children }: HomePortfolioCarouselProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let isVisible = false;
    let isScrolling = false;
    let scrollIdleTimer = 0;

    const syncPlayState = (): void => {
      root.style.setProperty(PLAY_STATE_VAR, isVisible && !isScrolling ? 'running' : 'paused');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry?.isIntersecting ?? false;
        syncPlayState();
      },
      { rootMargin: INTERSECTION_ROOT_MARGIN, threshold: 0 },
    );

    const handleScroll = (): void => {
      if (!isScrolling) {
        isScrolling = true;
        syncPlayState();
      }

      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
        syncPlayState();
      }, SCROLL_IDLE_MS);
    };

    const scrollOptions: AddEventListenerOptions = { passive: true };
    observer.observe(root);
    window.addEventListener('scroll', handleScroll, scrollOptions);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll, scrollOptions);
      window.clearTimeout(scrollIdleTimer);
    };
  }, []);

  return (
    <div ref={rootRef} className="home-portfolio-carousel">
      {children}
    </div>
  );
}

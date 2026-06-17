'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const SCROLL_IDLE_MS = 180;
const HERO_INTERSECTION_ROOT_MARGIN = '80px 0px';
const HERO_PLAY_STATE_VAR = '--home-hero-play-state';
const HOME_HERO_SELECTOR = '.home-hero';
const ABOUT_BODY_SELECTOR = '.about-body';

type HomeScrollPerformanceProps = {
  children: ReactNode;
};

function resolveHeroPlayState(isHeroVisible: boolean, isScrolling: boolean): 'running' | 'paused' {
  return isHeroVisible && !isScrolling ? 'running' : 'paused';
}

/**
 * Pauses hero motion while scrolling or off-screen.
 * Also suppresses expensive backdrop-filter blurs on hero elements during scroll
 * to eliminate GPU re-rasterisation jank (data-hero-scroll="scrolling" drives the CSS).
 */
export function HomeScrollPerformance({ children }: HomeScrollPerformanceProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const homeHero = root.querySelector(HOME_HERO_SELECTOR);
    const hasHomeHero = homeHero instanceof HTMLElement;
    root.dataset.hasHomeHero = hasHomeHero ? 'true' : 'false';
    root.dataset.hasAboutBody = root.querySelector(ABOUT_BODY_SELECTOR) ? 'true' : 'false';

    if (!hasHomeHero) {
      root.style.setProperty(HERO_PLAY_STATE_VAR, 'paused');

      return () => {
        delete root.dataset.hasHomeHero;
        delete root.dataset.hasAboutBody;
        root.style.removeProperty(HERO_PLAY_STATE_VAR);
      };
    }

    let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined;
    let scrollRaf = 0;
    let isHeroVisible = true;
    let isScrolling = false;

    const applyPlayState = (): void => {
      const playState = resolveHeroPlayState(isHeroVisible, isScrolling);
      root.style.setProperty(HERO_PLAY_STATE_VAR, playState);
      root.dataset.heroMotion = playState;

      if (isScrolling && isHeroVisible) {
        root.dataset.heroScroll = 'scrolling';
      } else {
        delete root.dataset.heroScroll;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroVisible = entry?.isIntersecting ?? false;
        applyPlayState();
      },
      { rootMargin: HERO_INTERSECTION_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(homeHero);

    const onScroll = (): void => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        if (!isScrolling) {
          isScrolling = true;
          applyPlayState();
        }

        clearTimeout(scrollIdleTimer);
        scrollIdleTimer = setTimeout(() => {
          isScrolling = false;
          applyPlayState();
        }, SCROLL_IDLE_MS);
      });
    };

    applyPlayState();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(scrollRaf);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(scrollIdleTimer);
      delete root.dataset.heroMotion;
      delete root.dataset.heroScroll;
      delete root.dataset.hasHomeHero;
      delete root.dataset.hasAboutBody;
      root.style.removeProperty(HERO_PLAY_STATE_VAR);
    };
  }, []);

  return (
    <div ref={rootRef} className="home-page-scale-root">
      {children}
    </div>
  );
}

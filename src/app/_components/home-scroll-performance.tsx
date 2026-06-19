'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const HERO_INTERSECTION_ROOT_MARGIN = '80px 0px';
const HERO_PLAY_STATE_VAR = '--home-hero-play-state';
const HOME_HERO_SELECTOR = '.home-hero';
const ABOUT_BODY_SELECTOR = '.about-body, .about-mobile-page, .about-mobile-capsule-track';

type HomeScrollPerformanceProps = {
  children: ReactNode;
};

/** Pauses hero motion when the hero is off-screen. */
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

    const applyPlayState = (isHeroVisible: boolean): void => {
      const playState = isHeroVisible ? 'running' : 'paused';
      root.style.setProperty(HERO_PLAY_STATE_VAR, playState);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        applyPlayState(entry?.isIntersecting ?? false);
      },
      { rootMargin: HERO_INTERSECTION_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(homeHero);
    applyPlayState(true);

    return () => {
      observer.disconnect();
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

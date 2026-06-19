'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const HERO_INTERSECTION_ROOT_MARGIN = '80px 0px';
const HERO_PLAY_STATE_VAR = '--home-hero-play-state';
const HOME_MOBILE_WRAP_SELECTOR = '.home-mobile-wrap';
const HOME_HERO_MOBILE_SELECTOR = '.home-mobile-hero';
const HOME_HERO_DESKTOP_SELECTOR = '.home-desktop .home-hero';
const ABOUT_BODY_SELECTOR = '.about-body, .about-mobile-page, .about-mobile-capsule-track';
const MOBILE_LAYOUT_QUERY = '(max-width: 899px)';

type HomeScrollPerformanceProps = {
  children: ReactNode;
};

function isElementDisplayed(element: HTMLElement): boolean {
  return getComputedStyle(element).display !== 'none';
}

/** Picks the hero section that is actually rendered for the current viewport. */
function resolveHomeHero(root: HTMLElement): HTMLElement | null {
  const mobileWrap = root.querySelector(HOME_MOBILE_WRAP_SELECTOR);

  if (mobileWrap instanceof HTMLElement && isElementDisplayed(mobileWrap)) {
    const mobileHero = root.querySelector(HOME_HERO_MOBILE_SELECTOR);
    return mobileHero instanceof HTMLElement ? mobileHero : null;
  }

  const desktopHero = root.querySelector(HOME_HERO_DESKTOP_SELECTOR);
  return desktopHero instanceof HTMLElement ? desktopHero : null;
}

/** Pauses hero motion when the hero is off-screen. */
export function HomeScrollPerformance({ children }: HomeScrollPerformanceProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let observedHero: HTMLElement | null = null;

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

    const bindHeroObserver = (): void => {
      const homeHero = resolveHomeHero(root);
      root.dataset.hasHomeHero = homeHero ? 'true' : 'false';
      root.dataset.hasAboutBody = root.querySelector(ABOUT_BODY_SELECTOR) ? 'true' : 'false';

      if (observedHero) {
        observer.unobserve(observedHero);
        observedHero = null;
      }

      if (!homeHero) {
        applyPlayState(false);
        return;
      }

      observedHero = homeHero;
      observer.observe(homeHero);
      applyPlayState(true);
    };

    bindHeroObserver();

    const mobileLayoutQuery = window.matchMedia(MOBILE_LAYOUT_QUERY);
    const handleLayoutChange = (): void => {
      bindHeroObserver();
    };

    mobileLayoutQuery.addEventListener('change', handleLayoutChange);

    return () => {
      mobileLayoutQuery.removeEventListener('change', handleLayoutChange);
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

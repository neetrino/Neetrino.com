'use client';

import { useEffect } from 'react';

const CRITICAL_ROUTE_IMAGES = [
  '/about/hero-streak.svg',
  '/about/robot.webp',
  '/portfolio/decor-stack.webp',
  '/portfolio/portfolio-title.webp',
  '/blog/blog-title.webp',
  '/services/decor-stack.webp',
  '/services/services-title.webp',
] as const;

function preloadImage(src: string): void {
  const image = new window.Image();
  image.decoding = 'async';
  image.src = src;
}

/** Warms critical route backgrounds so client navigation does not flash a dark shell. */
export function CriticalRouteImagePreloader(): null {
  useEffect(() => {
    CRITICAL_ROUTE_IMAGES.forEach(preloadImage);
  }, []);

  return null;
}

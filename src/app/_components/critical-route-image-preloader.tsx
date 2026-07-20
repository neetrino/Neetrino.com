'use client';

import { useEffect } from 'react';

import { staticAsset } from '@/lib/static-asset';

const CRITICAL_ROUTE_IMAGES = [
  '/figma-home/home-hero-streak.svg',
  staticAsset('/about/robot.webp'),
  staticAsset('/portfolio/decor-stack.webp'),
  staticAsset('/blog/blog-title.webp'),
  staticAsset('/services/decor-stack.webp'),
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

'use client';

import { useEffect, useState } from 'react';

const COUNT_UP_DURATION_MS = 1000;

function easeOutCubic(progress: number): number {
  return 1 - (1 - progress) ** 3;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Animates an integer from 0 to `target` when `isActive` becomes true. */
export function useCountUp(target: number, isActive: boolean): number {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (prefersReducedMotion()) {
      setCurrent(target);
      return;
    }

    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNT_UP_DURATION_MS, 1);
      setCurrent(Math.round(easeOutCubic(progress) * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isActive, target]);

  return current;
}

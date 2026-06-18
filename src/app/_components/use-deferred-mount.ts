'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export type UseDeferredMountOptions = {
  idleTimeoutMs: number;
  rootMargin?: string;
};

export type UseDeferredMountResult = {
  isReady: boolean;
  sentinelRef: RefObject<HTMLSpanElement | null>;
};

function scheduleIdleTask(callback: () => void, timeoutMs: number): number {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback, { timeout: timeoutMs });
  }

  return window.setTimeout(callback, timeoutMs);
}

function cancelIdleTask(handle: number): void {
  if (typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(handle);
    return;
  }

  window.clearTimeout(handle);
}

/** Defers mounting until the sentinel intersects or the browser is idle. */
export function useDeferredMount({
  idleTimeoutMs,
  rootMargin = '120px 0px',
}: UseDeferredMountOptions): UseDeferredMountResult {
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      return;
    }

    let cancelled = false;
    let idleId: number | undefined;
    let observer: IntersectionObserver | undefined;

    const mount = (): void => {
      if (!cancelled) {
        setIsReady(true);
      }
    };

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            mount();
          }
        },
        { rootMargin, threshold: 0 },
      );
      observer.observe(sentinel);
    }

    idleId = scheduleIdleTask(mount, idleTimeoutMs);

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (idleId !== undefined) {
        cancelIdleTask(idleId);
      }
    };
  }, [idleTimeoutMs, isReady, rootMargin]);

  return { isReady, sentinelRef };
}

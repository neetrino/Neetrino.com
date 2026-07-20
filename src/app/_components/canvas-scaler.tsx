'use client';

import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './home-constants';

const SCALE_EPSILON = 0.0001;
const HEIGHT_EPSILON = 0.5;
const DEFAULT_MIN_WIDTH = HOME_DESKTOP_MIN_WIDTH;
/** Avoid fighting the scroll thread with layout reads/writes mid-gesture. */
const SCROLL_IDLE_MS = 160;
const RESIZE_DEBOUNCE_MS = 120;

type CanvasScalerProps = {
  children: ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  wrapClassName?: string;
  innerClassName?: string;
  /** Minimum viewport width at which scaling is applied. Pass 0 to scale on all viewports including mobile. */
  minWidth?: number;
};

function measureContentHeight(inner: HTMLElement, canvasHeight?: number): number {
  if (canvasHeight !== undefined) {
    return canvasHeight;
  }

  const footer = inner.querySelector(':scope > footer');
  if (footer instanceof HTMLElement) {
    return footer.offsetTop + footer.offsetHeight;
  }

  return inner.offsetHeight;
}

/**
 * Scales a fixed-width design canvas to fit the viewport, matching production neetrino.com behavior.
 * Transform comes from `--home-canvas-scale` (set early by an inline boot script, then kept in sync here).
 */
export function CanvasScaler({
  children,
  canvasWidth = HOME_DESIGN_WIDTH,
  canvasHeight,
  wrapClassName,
  innerClassName,
  minWidth = DEFAULT_MIN_WIDTH,
}: CanvasScalerProps): React.JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastAppliedRef = useRef({ scale: 0, height: 0 });
  const resolvedMinWidth = Number.isFinite(minWidth) ? minWidth : DEFAULT_MIN_WIDTH;

  const updateScale = useCallback(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return;
    }

    const scaleHost = wrap.parentElement ?? wrap;
    const viewportWidth = window.innerWidth;
    const shouldScale = viewportWidth >= resolvedMinWidth;

    if (!shouldScale) {
      wrap.style.height = '';
      scaleHost.style.setProperty('--home-canvas-scale', '1');
      lastAppliedRef.current = { scale: 0, height: 0 };
      return;
    }

    const availableWidth = Math.min(wrap.clientWidth || viewportWidth, viewportWidth);
    const scale = availableWidth / canvasWidth;
    const contentHeight = measureContentHeight(inner, canvasHeight);
    const scaledHeight = contentHeight * scale;

    if (
      Math.abs(lastAppliedRef.current.scale - scale) < SCALE_EPSILON &&
      Math.abs(lastAppliedRef.current.height - scaledHeight) < HEIGHT_EPSILON
    ) {
      return;
    }

    wrap.style.height = `${scaledHeight}px`;
    scaleHost.style.setProperty('--home-canvas-scale', String(scale));
    lastAppliedRef.current = { scale, height: scaledHeight };
  }, [canvasHeight, canvasWidth, resolvedMinWidth]);

  useLayoutEffect(() => {
    let frame = 0;
    let resizeTimer = 0;
    let scrollIdleTimer = 0;
    let isScrolling = false;
    let needsUpdateAfterScroll = false;

    const runUpdate = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    };

    const scheduleUpdate = (): void => {
      if (isScrolling) {
        needsUpdateAfterScroll = true;
        return;
      }
      runUpdate();
    };

    const scheduleDebouncedUpdate = (): void => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(scheduleUpdate, RESIZE_DEBOUNCE_MS);
    };

    updateScale();

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return () => cancelAnimationFrame(frame);
    }

    // Watch wrap (width) and inner (content height). Updates are debounced and
    // deferred while the user is scrolling so scale work never hits the scroll thread.
    const resizeObserver = new ResizeObserver(scheduleDebouncedUpdate);
    resizeObserver.observe(wrap);
    if (canvasHeight === undefined) {
      resizeObserver.observe(inner);
    }

    const handleScroll = (): void => {
      isScrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
        if (needsUpdateAfterScroll) {
          needsUpdateAfterScroll = false;
          runUpdate();
        }
      }, SCROLL_IDLE_MS);
    };

    const resizeOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener('resize', scheduleDebouncedUpdate, resizeOptions);
    window.addEventListener('load', scheduleUpdate, resizeOptions);
    window.addEventListener('scroll', handleScroll, resizeOptions);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(scrollIdleTimer);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleDebouncedUpdate, resizeOptions);
      window.removeEventListener('load', scheduleUpdate, resizeOptions);
      window.removeEventListener('scroll', handleScroll, resizeOptions);
    };
  }, [canvasHeight, updateScale]);

  const innerStyle =
    resolvedMinWidth === 0
      ? {
          width: canvasWidth,
          ...(canvasHeight !== undefined ? { minHeight: canvasHeight } : null),
        }
      : undefined;

  return (
    <div
      ref={wrapRef}
      className={`neetrino-canvas-wrap overflow-hidden${wrapClassName ? ` ${wrapClassName}` : ''}`}
      data-neetrino-canvas
      data-scale-mobile={resolvedMinWidth === 0 ? 'true' : undefined}
    >
      <div
        ref={innerRef}
        className={`neetrino-canvas-inner${innerClassName ? ` ${innerClassName}` : ''}`}
        style={innerStyle}
      >
        {children}
      </div>
    </div>
  );
}

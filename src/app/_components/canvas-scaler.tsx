'use client';

import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './home-constants';

const SCALE_EPSILON = 0.0001;
const HEIGHT_EPSILON = 0.5;
const DEFAULT_MIN_WIDTH = HOME_DESKTOP_MIN_WIDTH;

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
      // Always reset — mobile must stay 1:1 (no leftover transform / zoom).
      inner.style.transform = 'none';
      wrap.style.height = '';
      scaleHost.style.setProperty('--home-canvas-scale', '1');
      lastAppliedRef.current = { scale: 0, height: 0 };
      return;
    }

    // Prefer viewport width — an unscaled 1440px canvas can inflate layout measurements.
    const availableWidth = Math.min(wrap.clientWidth || viewportWidth, viewportWidth);
    const scale = availableWidth / canvasWidth;
    const contentHeight = measureContentHeight(inner, canvasHeight);
    // Height must stay content-driven. Flooring to 100vh pads short pages (e.g. /team,
    // /services) with empty space below the footer after scale.
    const scaledHeight = contentHeight * scale;

    if (
      Math.abs(lastAppliedRef.current.scale - scale) < SCALE_EPSILON &&
      Math.abs(lastAppliedRef.current.height - scaledHeight) < HEIGHT_EPSILON
    ) {
      return;
    }

    inner.style.transform = `scale(${scale})`;
    wrap.style.height = `${scaledHeight}px`;
    scaleHost.style.setProperty('--home-canvas-scale', String(scale));
    lastAppliedRef.current = { scale, height: scaledHeight };
  }, [canvasHeight, canvasWidth, resolvedMinWidth]);

  useLayoutEffect(() => {
    let frame = 0;

    const scheduleUpdate = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    };

    updateScale();

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return () => cancelAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(wrap);
    if (canvasHeight === undefined) {
      resizeObserver.observe(inner);
    }

    const resizeOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener('resize', scheduleUpdate, resizeOptions);
    window.addEventListener('load', scheduleUpdate, resizeOptions);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleUpdate, resizeOptions);
      window.removeEventListener('load', scheduleUpdate, resizeOptions);
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

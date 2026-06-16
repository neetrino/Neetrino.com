'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './home-constants';

const SCALE_EPSILON = 0.0001;
const HEIGHT_EPSILON = 0.5;

type CanvasScalerProps = {
  children: ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  wrapClassName?: string;
  innerClassName?: string;
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

function bindPendingImageLoads(container: HTMLElement, onUpdate: () => void): () => void {
  const bindImages = (): void => {
    container.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', onUpdate, { once: true });
      }
    });
  };

  bindImages();

  const observer = new MutationObserver((mutations) => {
    let hasNewImages = false;

    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          hasNewImages = true;
          return;
        }

        if (node instanceof HTMLElement && node.querySelector('img')) {
          hasNewImages = true;
        }
      });
    }

    if (hasNewImages) {
      bindImages();
      onUpdate();
    }
  });

  observer.observe(container, { childList: true, subtree: true });
  return () => observer.disconnect();
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
}: CanvasScalerProps): React.JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lastAppliedRef = useRef({ scale: 0, height: 0 });

  const updateScale = useCallback(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return;
    }

    const scaleHost = wrap.parentElement ?? wrap;

    const isDesktop = window.innerWidth >= HOME_DESKTOP_MIN_WIDTH;
    if (!isDesktop) {
      if (lastAppliedRef.current.scale !== 0 || lastAppliedRef.current.height !== 0) {
        inner.style.transform = '';
        wrap.style.height = '';
        scaleHost.style.removeProperty('--home-canvas-scale');
        lastAppliedRef.current = { scale: 0, height: 0 };
      }
      return;
    }

    const scale = wrap.offsetWidth / canvasWidth;
    const contentHeight = measureContentHeight(inner, canvasHeight);
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
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    let frame = 0;

    const scheduleUpdate = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    };

    scheduleUpdate();

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return () => cancelAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(wrap);
    resizeObserver.observe(inner);

    const unbindImages = bindPendingImageLoads(inner, scheduleUpdate);
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      unbindImages();
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('load', scheduleUpdate);
    };
  }, [updateScale]);

  return (
    <div
      ref={wrapRef}
      className={`neetrino-canvas-wrap overflow-hidden${wrapClassName ? ` ${wrapClassName}` : ''}`}
      data-neetrino-canvas
    >
      <div
        ref={innerRef}
        className={`neetrino-canvas-inner${innerClassName ? ` ${innerClassName}` : ''}`}
        style={canvasHeight !== undefined ? { minHeight: canvasHeight } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

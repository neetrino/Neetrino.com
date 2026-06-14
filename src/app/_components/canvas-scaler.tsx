'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { HOME_DESIGN_WIDTH, HOME_DESKTOP_MIN_WIDTH } from './home-constants';

type CanvasScalerProps = {
  children: ReactNode;
  canvasWidth?: number;
  canvasHeight?: number;
  wrapClassName?: string;
  innerClassName?: string;
};

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

  const updateScale = useCallback(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) {
      return;
    }

    const isDesktop = window.innerWidth >= HOME_DESKTOP_MIN_WIDTH;
    if (!isDesktop) {
      inner.style.transform = '';
      wrap.style.height = '';
      return;
    }

    const scale = wrap.offsetWidth / canvasWidth;
    const contentHeight = canvasHeight ?? inner.scrollHeight;

    inner.style.transform = `scale(${scale})`;
    wrap.style.height = `${contentHeight * scale}px`;
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    let frame = 0;

    const scheduleUpdate = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateScale);
    };

    scheduleUpdate();

    const wrap = wrapRef.current;
    if (!wrap) {
      return () => cancelAnimationFrame(frame);
    }

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(wrap);
    if (innerRef.current) {
      resizeObserver.observe(innerRef.current);
    }
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleUpdate);
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

'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';
import { useEffect, useRef } from 'react';

const MOBILE_MAX_WIDTH_PX = 899;
const ABOUT_MOBILE_HEADER_TOP_PX = 26;
const ABOUT_MOBILE_HEADER_HEIGHT_PX = 60;
const ABOUT_MOBILE_CAPSULE_GAP_PX = 12;
const ABOUT_MOBILE_CAPSULE_STICK_TOP_PX =
  ABOUT_MOBILE_HEADER_TOP_PX + ABOUT_MOBILE_HEADER_HEIGHT_PX + ABOUT_MOBILE_CAPSULE_GAP_PX;
const CUBE_TRANSLATE_VAR = '--about-mobile-cube-translate-y';

type CubeMetrics = {
  travelPx: number;
  scrollRangePx: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readCssRemPx(element: HTMLElement, variableName: string, fallbackRem: number): number {
  const host = element.closest('.about-mobile') ?? element;
  const raw = getComputedStyle(host).getPropertyValue(variableName).trim();
  const rem = raw.endsWith('rem') ? parseFloat(raw) : fallbackRem;

  if (Number.isNaN(rem)) {
    return fallbackRem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function measureCubeMetrics(capsule: HTMLElement, track: HTMLElement, cube: HTMLElement): CubeMetrics {
  const startPx = readCssRemPx(capsule, '--about-mobile-cube-start', 4);
  const travelPx = Math.max(capsule.offsetHeight - cube.offsetHeight - startPx, 0);
  const scrollRangePx = Math.max(track.offsetHeight - window.innerHeight + ABOUT_MOBILE_CAPSULE_STICK_TOP_PX, 1);

  return { travelPx, scrollRangePx };
}

/** Full-height glass beam; cube travels vertically in sync with track scroll. */
export function AboutMobileCapsule(): React.JSX.Element {
  const capsuleRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const capsule = capsuleRef.current;
    const cube = cubeRef.current;
    if (!capsule || !cube) {
      return;
    }

    const track = capsule.closest('.about-mobile-capsule-track');
    if (!(track instanceof HTMLElement)) {
      return;
    }

    let frame = 0;
    let metrics = measureCubeMetrics(capsule, track, cube);

    const updateCubePosition = (): void => {
      if (window.innerWidth > MOBILE_MAX_WIDTH_PX) {
        capsule.style.removeProperty(CUBE_TRANSLATE_VAR);
        return;
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        capsule.style.setProperty(CUBE_TRANSLATE_VAR, '0px');
        return;
      }

      const scrolled = ABOUT_MOBILE_CAPSULE_STICK_TOP_PX - track.getBoundingClientRect().top;
      const progress = clamp(scrolled / metrics.scrollRangePx, 0, 1);
      const translateY = progress * metrics.travelPx;
      capsule.style.setProperty(CUBE_TRANSLATE_VAR, `${translateY}px`);
    };

    const remeasure = (): void => {
      metrics = measureCubeMetrics(capsule, track, cube);
      updateCubePosition();
    };

    const scheduleUpdate = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateCubePosition);
    };

    remeasure();

    const passiveOptions: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', scheduleUpdate, passiveOptions);
    window.addEventListener('resize', remeasure, passiveOptions);

    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(track);
    resizeObserver.observe(capsule);
    resizeObserver.observe(cube);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleUpdate, passiveOptions);
      window.removeEventListener('resize', remeasure, passiveOptions);
      resizeObserver.disconnect();
      capsule.style.removeProperty(CUBE_TRANSLATE_VAR);
    };
  }, []);

  return (
    <div ref={capsuleRef} className="about-mobile-capsule" aria-hidden>
      <span className="about-mobile-beam" />
      <div ref={cubeRef} className="about-mobile-cube">
        <Image
          src={staticAsset("/about/cube-transparent-v2.webp")}
          alt=""
          fill
          sizes="131px"
          loading="lazy"
          fetchPriority="low"
          className="about-mobile-cube-img"
        />
      </div>
    </div>
  );
}

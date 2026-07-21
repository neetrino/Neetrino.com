'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HASH_SCROLL_RETRY_LIMIT = 20;
const HASH_SCROLL_RETRY_MS = 50;

function hashFromHref(href: string): string | null {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) {
    return null;
  }

  const hash = href.slice(hashIndex);
  if (!hash || hash === '#') {
    return null;
  }

  return hash;
}

/**
 * Returns the hash when the link targets the current pathname
 * (e.g. `#about`, `/#about` on `/`, `/services#service-website` on `/services`).
 */
function resolveSamePageHash(href: string): string | null {
  const hash = hashFromHref(href);
  if (!hash) {
    return null;
  }

  if (href.startsWith('#')) {
    return hash;
  }

  const path = href.slice(0, href.indexOf('#')) || '/';
  if (path === window.location.pathname) {
    return hash;
  }

  return null;
}

function scrollToHash(hash: string, behavior: ScrollBehavior): boolean {
  const section = document.querySelector(hash);
  if (!(section instanceof HTMLElement)) {
    return false;
  }

  section.scrollIntoView({ behavior, block: 'start' });
  return true;
}

/** Smooth scroll for same-page anchor links; also restores hash targets after route changes. */
export function HomeSmoothAnchorScroll(): null {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a[href*="#"]');
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) {
        return;
      }

      const hash = resolveSamePageHash(href);
      if (!hash) {
        return;
      }

      const section = document.querySelector(hash);
      if (!(section instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, '', href.startsWith('#') ? hash : href);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === '#') {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const tryScroll = (): void => {
      if (cancelled) {
        return;
      }

      if (scrollToHash(hash, 'smooth')) {
        return;
      }

      attempts += 1;
      if (attempts < HASH_SCROLL_RETRY_LIMIT) {
        window.setTimeout(tryScroll, HASH_SCROLL_RETRY_MS);
      }
    };

    const frame = requestAnimationFrame(tryScroll);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}

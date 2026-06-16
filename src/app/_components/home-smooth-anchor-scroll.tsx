'use client';

import { useEffect } from 'react';

function resolveHash(href: string): string | null {
  if (href.startsWith('#')) {
    return href;
  }

  if (href.startsWith('/#') && window.location.pathname === '/') {
    return href.slice(1);
  }

  return null;
}

/** Smooth scroll for in-page anchor links only; wheel/trackpad scroll stays instant. */
export function HomeSmoothAnchorScroll(): null {
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a[href^="#"], a[href^="/#"]');
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || href === '#' || href === '/#') {
        return;
      }

      const hash = resolveHash(href);
      if (!hash) {
        return;
      }

      const section = document.querySelector(hash);
      if (!(section instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}

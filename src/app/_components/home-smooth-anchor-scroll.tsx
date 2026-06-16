'use client';

import { useEffect } from 'react';

/** Smooth scroll for in-page anchor links only; wheel/trackpad scroll stays instant. */
export function HomeSmoothAnchorScroll(): null {
  useEffect(() => {
    const home = document.getElementById('home');
    if (!home) {
      return;
    }

    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') {
        return;
      }

      const section = document.querySelector(hash);
      if (!(section instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    home.addEventListener('click', onClick);
    return () => home.removeEventListener('click', onClick);
  }, []);

  return null;
}

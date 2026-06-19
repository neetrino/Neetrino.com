'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AboutMobileMenu } from './about-mobile-menu';

/** Compact mobile header bar (logo + Menu) shared across all marketing pages. */
export function MobileHeader(): React.JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback((): void => setIsMenuOpen(false), []);
  const toggleMenu = useCallback((): void => setIsMenuOpen((open) => !open), []);

  return (
    <>
      <header
        className={
          isMenuOpen ? 'about-mobile-header about-mobile-header--menu-open' : 'about-mobile-header'
        }
      >
        <Link href="/" className="about-mobile-header-logo" aria-label="Neetrino home">
          <Image
            src="/figma-home/neetrino-logo.svg"
            alt=""
            width={96}
            height={32}
            priority
            className="about-mobile-header-logo-img"
          />
        </Link>
        <button
          type="button"
          className="about-mobile-header-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-haspopup="dialog"
          onClick={toggleMenu}
        >
          Menu
        </button>
      </header>

      {isMenuOpen ? <AboutMobileMenu onClose={closeMenu} /> : null}
    </>
  );
}

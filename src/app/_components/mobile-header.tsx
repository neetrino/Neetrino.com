'use client';

import { useCallback, useState } from 'react';
import { staticAsset } from '@/lib/static-asset';
import Image from 'next/image';
import Link from 'next/link';
import { AboutMobileMenu } from './about-mobile-menu';
import { useHomeI18n } from './home-i18n-provider';

/** Compact mobile header bar (logo + Menu) shared across all marketing pages. */
export function MobileHeader(): React.JSX.Element {
  const { homeCopy } = useHomeI18n();
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
        <Link href="/" className="about-mobile-header-logo" aria-label={homeCopy.navigation.logoHomeAriaLabel}>
          <Image
            src={staticAsset("/figma-home/neetrino-logo.svg")}
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
          aria-label={
            isMenuOpen
              ? homeCopy.navigation.mobileMenuCloseAriaLabel
              : homeCopy.navigation.mobileMenuOpenAriaLabel
          }
          aria-expanded={isMenuOpen}
          aria-haspopup="dialog"
          onClick={toggleMenu}
        >
          {homeCopy.navigation.mobileMenuLabel}
        </button>
      </header>

      {isMenuOpen ? <AboutMobileMenu onClose={closeMenu} /> : null}
    </>
  );
}

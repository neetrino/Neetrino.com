'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AboutMobileMenu } from './about-mobile-menu';
import { useHomeI18n } from './home-i18n-provider';

/** Served from /public — avoids CDN breakage on mobile networks. */
const HEADER_LOGO_SRC = '/figma-home/neetrino-logo.webp';
const HEADER_LOGO_WIDTH = 1682;
const HEADER_LOGO_HEIGHT = 477;

function MobileMenuIcon({ open }: { open: boolean }): React.JSX.Element {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M6 6l12 12" strokeLinecap="round" />
        <path d="M18 6L6 18" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h16" strokeLinecap="round" />
      <path d="M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

/** Compact mobile header bar (logo + menu) shared across all marketing pages. */
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
            src={HEADER_LOGO_SRC}
            alt={homeCopy.navigation.logoAlt}
            width={HEADER_LOGO_WIDTH}
            height={HEADER_LOGO_HEIGHT}
            priority
            unoptimized
            sizes="108px"
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
          <MobileMenuIcon open={isMenuOpen} />
        </button>
      </header>

      {isMenuOpen ? <AboutMobileMenu onClose={closeMenu} /> : null}
    </>
  );
}

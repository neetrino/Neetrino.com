'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

function GlobeIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

/** Compact mobile header bar (logo + language + menu) shared across marketing pages. */
export function MobileHeader(): React.JSX.Element {
  const { homeCopy, languageOptions, locale, setLocale } = useHomeI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((): void => setIsMenuOpen(false), []);
  const toggleMenu = useCallback((): void => {
    setIsLanguageOpen(false);
    setIsMenuOpen((open) => !open);
  }, []);
  const toggleLanguage = useCallback((): void => {
    setIsMenuOpen(false);
    setIsLanguageOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (!isLanguageOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLanguageOpen]);

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

        <div className="about-mobile-header-actions">
          <div ref={languageMenuRef} className="about-mobile-header-language-wrap">
            <button
              type="button"
              className="about-mobile-header-language"
              aria-expanded={isLanguageOpen}
              aria-haspopup="menu"
              aria-label={homeCopy.navigation.changeLanguageAriaLabel}
              onClick={toggleLanguage}
            >
              <GlobeIcon />
            </button>

            {isLanguageOpen ? (
              <div className="about-mobile-header-language-menu" role="menu">
                {languageOptions.map((language) => {
                  const isActive = language.locale === locale;

                  return (
                    <button
                      key={language.locale}
                      type="button"
                      className={
                        isActive
                          ? 'about-mobile-header-language-option about-mobile-header-language-option--active'
                          : 'about-mobile-header-language-option'
                      }
                      role="menuitemradio"
                      aria-checked={isActive}
                      onClick={() => {
                        setLocale(language.locale);
                        setIsLanguageOpen(false);
                      }}
                    >
                      <span className="about-mobile-header-language-option-code">{language.codeLabel}</span>
                      <span className="about-mobile-header-language-option-name">{language.nativeLabel}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

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
        </div>
      </header>

      {isMenuOpen ? <AboutMobileMenu onClose={closeMenu} /> : null}
    </>
  );
}

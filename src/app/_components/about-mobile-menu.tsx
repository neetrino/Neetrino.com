'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from './home-data';
import { useHomeI18n } from './home-i18n-provider';

type AboutMobileMenuProps = {
  onClose: () => void;
};

function useCurrentHash(pathname: string): string {
  const [hash, setHash] = useState('');

  useEffect(() => {
    const updateHash = (): void => setHash(window.location.hash);

    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, [pathname]);

  return hash;
}

function isNavLinkActive(item: NavItem, pathname: string, hash: string): boolean {
  const [path, fragment] = item.href.split('#');
  const routePath = path || '/';

  if (fragment) {
    return pathname === routePath && hash === `#${fragment}`;
  }

  return pathname === routePath && hash === '';
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

function MenuToggleIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M4 12h12" strokeLinecap="round" />
      <path d="M4 17h8" strokeLinecap="round" />
    </svg>
  );
}

function MobileMenuNavLink({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}): React.JSX.Element {
  return (
    <Link
      href={item.href}
      className={
        isActive
          ? 'about-mobile-menu-link about-mobile-menu-link--active'
          : 'about-mobile-menu-link'
      }
      aria-current={isActive ? 'page' : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  );
}

/** Full-screen mobile navigation panel opened from the header Menu button. */
export function AboutMobileMenu({ onClose }: AboutMobileMenuProps): React.JSX.Element {
  const { homeCopy, languageOptions, locale, moreNavItems, navItems, setLocale } = useHomeI18n();
  const menuId = useId();
  const pathname = usePathname();
  const currentHash = useCurrentHash(pathname);
  const isMoreActive = moreNavItems.some((item) => isNavLinkActive(item, pathname, currentHash));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="about-mobile-menu" role="presentation">
      <button
        type="button"
        className="about-mobile-menu-backdrop"
        aria-label={homeCopy.navigation.mobileMenuCloseAriaLabel}
        onClick={onClose}
      />

      <div
        id={menuId}
        className="about-mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label={homeCopy.navigation.siteNavigationAriaLabel}
      >
        <div className="about-mobile-menu-watermark" aria-hidden>
          <Image
            src="/figma-home/neetrino-hero-brand.svg"
            alt=""
            width={280}
            height={120}
            className="about-mobile-menu-watermark-brand"
          />
          <Image
            src="/about/robot-mobile.webp"
            alt=""
            width={220}
            height={320}
            className="about-mobile-menu-watermark-robot"
          />
        </div>

        <nav className="about-mobile-menu-nav" aria-label={homeCopy.navigation.mainAriaLabel}>
          {navItems.map((item, index) => (
            <div key={item.id} className="about-mobile-menu-item">
              <MobileMenuNavLink
                item={item}
                isActive={isNavLinkActive(item, pathname, currentHash)}
                onNavigate={onClose}
              />
              {index === 0 ? <span className="about-mobile-menu-divider" aria-hidden /> : null}
            </div>
          ))}

          <details
            className={
              isMoreActive
                ? 'about-mobile-menu-more about-mobile-menu-more--active'
                : 'about-mobile-menu-more'
            }
          >
            <summary>{homeCopy.navigation.moreLabel}</summary>
            <div className="about-mobile-menu-more-list">
              {moreNavItems.map((item) => (
                <MobileMenuNavLink
                  key={item.id}
                  item={item}
                  isActive={isNavLinkActive(item, pathname, currentHash)}
                  onNavigate={onClose}
                />
              ))}
            </div>
          </details>
        </nav>

        <div
          className="about-mobile-menu-languages"
          role="group"
          aria-label={homeCopy.navigation.languageGroupAriaLabel}
        >
          {languageOptions.map((language) => {
            const isActive = locale === language.locale;
            return (
              <button
                key={language.locale}
                type="button"
                className={
                  isActive
                    ? 'about-mobile-menu-lang about-mobile-menu-lang--active'
                    : 'about-mobile-menu-lang'
                }
                aria-pressed={isActive}
                onClick={() => setLocale(language.locale)}
              >
                <span className="about-mobile-menu-lang-icon">
                  <GlobeIcon />
                </span>
                {language.codeLabel}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="about-mobile-menu-toggle"
        aria-label={homeCopy.navigation.mobileMenuCloseAriaLabel}
        aria-controls={menuId}
        onClick={onClose}
      >
        <MenuToggleIcon />
      </button>
    </div>
  );
}

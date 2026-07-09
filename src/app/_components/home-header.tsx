'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { staticAsset } from '@/lib/static-asset';
import { CdnImage as Image } from '@/lib/cdn-image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { NavItem } from './home-data';
import { useHomeI18n } from './home-i18n-provider';

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

function isHeaderLinkActive(item: NavItem, pathname: string, hash: string): boolean {
  const [path, fragment] = item.href.split('#');
  const routePath = path || '/';

  if (fragment) {
    return pathname === routePath && hash === `#${fragment}`;
  }

  return pathname === routePath && hash === '';
}

function HeaderNavLink({ item, isActive }: { item: NavItem; isActive: boolean }): React.JSX.Element {
  return (
    <Link
      href={item.href}
      className={isActive ? 'home-header-link home-header-link--active' : 'home-header-link'}
      aria-current={isActive ? 'page' : undefined}
    >
      {item.label}
    </Link>
  );
}

export function HomeHeader(): React.JSX.Element {
  const { activeLanguage, homeCopy, languageOptions, locale, moreNavItems, navItems, setLocale } =
    useHomeI18n();
  const pathname = usePathname();
  const router = useRouter();
  const currentHash = useCurrentHash(pathname);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const isMoreActive = moreNavItems.some((item) => isHeaderLinkActive(item, pathname, currentHash));

  // Links inside the collapsed "More" dropdown are hidden, so Next.js never
  // auto-prefetches them. Warm them on open/hover to keep navigation client-side.
  const prefetchMoreItems = useCallback((): void => {
    moreNavItems.forEach((item) => router.prefetch(item.href));
  }, [moreNavItems, router]);

  useEffect(() => {
    if (!isLanguageOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLanguageOpen]);

  return (
    <header className="home-header">
      <div className="home-header-inner">
        <Link href="/" className="home-header-logo">
          <Image
            src={staticAsset('/figma-home/neetrino-logo.png')}
            alt={homeCopy.navigation.logoAlt}
            width={460}
            height={93}
            priority
          />
        </Link>
        <nav className="home-header-nav" aria-label={homeCopy.navigation.mainAriaLabel}>
          {navItems.map((item) => (
            <HeaderNavLink
              key={item.id}
              item={item}
              isActive={isHeaderLinkActive(item, pathname, currentHash)}
            />
          ))}
          <details
            className={isMoreActive ? 'home-header-more home-header-more--active' : 'home-header-more'}
            onToggle={(event) => {
              if (event.currentTarget.open) {
                prefetchMoreItems();
              }
            }}
          >
            <summary onMouseEnter={prefetchMoreItems}>{homeCopy.navigation.moreLabel}</summary>
            <div className="home-header-more-menu">
              {moreNavItems.map((item) => (
                <HeaderNavLink
                  key={item.id}
                  item={item}
                  isActive={isHeaderLinkActive(item, pathname, currentHash)}
                />
              ))}
            </div>
          </details>
        </nav>
        <Link href="/#contact" className="home-header-quote">
          {homeCopy.navigation.quoteLabel}
        </Link>
        <div ref={languageMenuRef} className="home-header-language-wrap">
          <button
            type="button"
            className="home-header-language"
            aria-expanded={isLanguageOpen}
            aria-haspopup="menu"
            aria-label={homeCopy.navigation.changeLanguageAriaLabel}
            onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
          >
            <span className="home-header-language-icon" aria-hidden="true">
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
            </span>
            {activeLanguage.codeLabel}
          </button>

          {isLanguageOpen ? (
            <div className="home-header-language-menu" role="menu">
              {languageOptions.map((language) => {
                const isActive = language.locale === locale;

                return (
                  <button
                    key={language.locale}
                    type="button"
                    className={
                      isActive
                        ? 'home-header-language-option home-header-language-option--active'
                        : 'home-header-language-option'
                    }
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      setLocale(language.locale);
                      setIsLanguageOpen(false);
                    }}
                  >
                    <span className="home-header-language-option-code">{language.codeLabel}</span>
                    <span className="home-header-language-option-name">{language.nativeLabel}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

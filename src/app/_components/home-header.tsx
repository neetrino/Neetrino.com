'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { moreNavItems, navItems, type NavItem } from './home-data';

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
  const pathname = usePathname();
  const currentHash = useCurrentHash(pathname);
  const isMoreActive = moreNavItems.some((item) => isHeaderLinkActive(item, pathname, currentHash));

  return (
    <header className="home-header">
      <div className="home-header-inner">
        <Link href="/" className="home-header-logo">
          <Image
            src="/figma-home/neetrino-logo.svg"
            alt="Neetrino"
            width={130}
            height={37}
            priority
          />
        </Link>
        <nav className="home-header-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <HeaderNavLink
              key={item.label}
              item={item}
              isActive={isHeaderLinkActive(item, pathname, currentHash)}
            />
          ))}
          <details className={isMoreActive ? 'home-header-more home-header-more--active' : 'home-header-more'}>
            <summary>More</summary>
            <div className="home-header-more-menu">
              {moreNavItems.map((item) => (
                <HeaderNavLink
                  key={item.label}
                  item={item}
                  isActive={isHeaderLinkActive(item, pathname, currentHash)}
                />
              ))}
            </div>
          </details>
        </nav>
        <Link href="/#contact" className="home-header-quote">
          Get a Quote
        </Link>
        <button type="button" className="home-header-language" aria-label="Change language">
          <span className="home-header-language-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </span>
          ENG
        </button>
      </div>
    </header>
  );
}

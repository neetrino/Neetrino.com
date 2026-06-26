'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { logoutAdmin } from '@/app/admin/_actions/auth-actions';
import { useAdminI18n } from './admin-i18n-provider';
import { AdminNavIcon } from './admin-nav-icon';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/blog', labelKey: 'blog', icon: 'doc' },
  { href: '/admin/portfolio', labelKey: 'portfolio', icon: 'grid' },
  { href: '/admin/contact', labelKey: 'messages', icon: 'message' },
  { href: '/admin/products', labelKey: 'products', icon: 'box' },
  { href: '/admin/orders', labelKey: 'orders', icon: 'cart' },
] as const;

export function AdminShell({ children }: { children: ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const { copy, languageOptions, locale, setLocale } = useAdminI18n();

  return (
    <div className="admin-page">
      <aside className="admin-sidebar" aria-label={copy.shell.navigationAriaLabel}>
        <Link href="/" className="admin-brand" aria-label={copy.shell.homeAriaLabel}>
          <span className="admin-brand-mark">N</span>
          <span>
            <strong>Neetrino</strong>
            <small>{copy.shell.panelLabel}</small>
          </span>
        </Link>
        <div className="admin-language-switcher" aria-label={copy.shell.languageLabel}>
          {languageOptions.map((language) => (
            <button
              key={language.locale}
              type="button"
              className={locale === language.locale ? 'admin-language-button is-active' : 'admin-language-button'}
              onClick={() => setLocale(language.locale)}
            >
              {language.codeLabel}
            </button>
          ))}
        </div>
        <nav className="admin-nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className={isActive ? 'admin-nav-item is-active' : 'admin-nav-item'}>
                <AdminNavIcon name={item.icon} />
                <span>{copy.shell.nav[item.labelKey]}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="admin-user-avatar">A</span>
            <span>
              <strong>{copy.shell.adminName}</strong>
              <small>{copy.shell.statusOn}</small>
            </span>
          </div>
          <form action={logoutAdmin} className="admin-footer-form">
            <button type="submit" className="admin-footer-action admin-footer-action--logout">
              {copy.shell.logout}
            </button>
          </form>
          <button type="button" className="admin-footer-action">
            {copy.shell.collapse}
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

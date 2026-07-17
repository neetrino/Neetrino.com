'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { logoutAdmin } from '@/app/admin/_actions/auth-actions';
import { useAdminI18n } from './admin-i18n-provider';
import { AdminNavIcon } from './admin-nav-icon';
import { useAdminSidebarCollapsed } from './use-admin-sidebar-collapsed';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/blog', labelKey: 'blog', icon: 'doc' },
  { href: '/admin/portfolio', labelKey: 'portfolio', icon: 'grid' },
  { href: '/admin/products', labelKey: 'products', icon: 'box' },
  { href: '/admin/orders', labelKey: 'orders', icon: 'cart' },
] as const;

export function AdminShell({ children }: { children: ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const { copy, languageOptions, locale, setLocale } = useAdminI18n();
  const { isCollapsed, toggleSidebar } = useAdminSidebarCollapsed();
  const toggleLabel = isCollapsed ? copy.shell.expand : copy.shell.collapse;

  return (
    <div className={isCollapsed ? 'admin-page admin-page--sidebar-collapsed' : 'admin-page'}>
      <aside id="admin-sidebar" className="admin-sidebar" aria-label={copy.shell.navigationAriaLabel}>
        <div className="admin-sidebar-top">
          <Link href="/" className="admin-brand" aria-label={copy.shell.homeAriaLabel} title="Neetrino">
            <span className="admin-brand-mark">N</span>
            <span className="admin-sidebar-label">
              <strong>Neetrino</strong>
              <small>{copy.shell.panelLabel}</small>
            </span>
          </Link>
          <button
            type="button"
            className="admin-sidebar-toggle"
            aria-expanded={!isCollapsed}
            aria-controls="admin-sidebar"
            aria-label={toggleLabel}
            title={toggleLabel}
            onClick={toggleSidebar}
          >
            <span aria-hidden>{isCollapsed ? '>' : '<'}</span>
          </button>
        </div>
        <div className="admin-language-switcher" aria-label={copy.shell.languageLabel}>
          {languageOptions.map((language) => (
            <button
              key={language.locale}
              type="button"
              className={locale === language.locale ? 'admin-language-button is-active' : 'admin-language-button'}
              title={language.nativeLabel}
              onClick={() => setLocale(language.locale)}
            >
              {language.codeLabel}
            </button>
          ))}
        </div>
        <nav className="admin-nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const label = copy.shell.nav[item.labelKey];

            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'admin-nav-item is-active' : 'admin-nav-item'}
                title={label}
                aria-label={label}
              >
                <AdminNavIcon name={item.icon} />
                <span className="admin-sidebar-label">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user" title={`${copy.shell.adminName} · ${copy.shell.statusOn}`}>
            <span className="admin-user-avatar">A</span>
            <span className="admin-sidebar-label">
              <strong>{copy.shell.adminName}</strong>
              <small>{copy.shell.statusOn}</small>
            </span>
          </div>
          <form action={logoutAdmin} className="admin-footer-form">
            <button
              type="submit"
              className="admin-footer-action admin-footer-action--logout"
              title={copy.shell.logout}
              aria-label={copy.shell.logout}
            >
              <span className="admin-sidebar-label">{copy.shell.logout}</span>
              <span className="admin-sidebar-collapsed-only" aria-hidden>
                ⎋
              </span>
            </button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

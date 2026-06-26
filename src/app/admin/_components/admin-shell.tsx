'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { logoutAdmin } from '@/app/admin/_actions/auth-actions';
import { AdminNavIcon } from './admin-nav-icon';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/blog', label: 'Blog', icon: 'doc' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: 'grid' },
  { href: '/admin/contact', label: 'Messages', icon: 'message' },
  { href: '/admin/products', label: 'Products', icon: 'box' },
  { href: '/admin/orders', label: 'Orders', icon: 'cart' },
] as const;

export function AdminShell({ children }: { children: ReactNode }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="admin-page">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link href="/" className="admin-brand" aria-label="Neetrino home">
          <span className="admin-brand-mark">N</span>
          <span>
            <strong>Neetrino</strong>
            <small>Admin Panel</small>
          </span>
        </Link>
        <nav className="admin-nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} className={isActive ? 'admin-nav-item is-active' : 'admin-nav-item'}>
                <AdminNavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <span className="admin-user-avatar">A</span>
            <span>
              <strong>Admin</strong>
              <small>Status: on</small>
            </span>
          </div>
          <form action={logoutAdmin} className="admin-footer-form">
            <button type="submit" className="admin-footer-action admin-footer-action--logout">
              Logout
            </button>
          </form>
          <button type="button" className="admin-footer-action">
            Collapse
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

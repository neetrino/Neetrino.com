'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/blog', label: 'Blog', icon: 'doc' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: 'grid' },
  { href: '/admin/contact', label: 'Messages', icon: 'message' },
  { href: '/admin/products', label: 'Products', icon: 'box' },
  { href: '/admin/orders', label: 'Orders', icon: 'cart' },
] as const;

function AdminIcon({ name }: { name: string }): React.JSX.Element {
  return <span className={`admin-nav-icon admin-nav-icon--${name}`} aria-hidden />;
}

export function AdminShell({ children }: { children: ReactNode }): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="admin-page">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <Link href="/admin/blog" className="admin-brand" aria-label="Neetrino admin home">
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
                <AdminIcon name={item.icon} />
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
          <button type="button" className="admin-footer-action">
            Logout
          </button>
          <button type="button" className="admin-footer-action">
            Collapse
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

import type { ReactNode } from 'react';
import { requireAdminSession } from '@/lib/admin-session';
import { AdminI18nProvider } from './_components/admin-i18n-provider';
import { AdminShell } from './_components/admin-shell';
import { AdminToastProvider } from './_components/admin-toast';
import './admin.css';
import './admin-drawer.css';
import './admin-forms.css';
import './admin-orders.css';
import './admin-products.css';

export const metadata = {
  title: 'Neetrino Admin',
};

export default async function AdminLayout({ children }: { children: ReactNode }): Promise<React.JSX.Element> {
  await requireAdminSession();

  return (
    <AdminI18nProvider>
      <AdminToastProvider>
        <AdminShell>{children}</AdminShell>
      </AdminToastProvider>
    </AdminI18nProvider>
  );
}

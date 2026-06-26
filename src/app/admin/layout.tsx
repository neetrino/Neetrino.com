import type { ReactNode } from 'react';
import { requireAdminSession } from '@/lib/admin-session';
import { AdminShell } from './_components/admin-shell';
import './admin.css';
import './admin-drawer.css';
import './admin-forms.css';

export const metadata = {
  title: 'Neetrino Admin',
};

export default async function AdminLayout({ children }: { children: ReactNode }): Promise<React.JSX.Element> {
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}

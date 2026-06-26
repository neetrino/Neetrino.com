import type { ReactNode } from 'react';
import { AdminShell } from './_components/admin-shell';
import './admin.css';
import './admin-drawer.css';
import './admin-forms.css';

export const metadata = {
  title: 'Neetrino Admin',
};

export default function AdminLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return <AdminShell>{children}</AdminShell>;
}

import type { Metadata } from 'next';
import { ADMIN_DEFAULT_PATH, ADMIN_LOGIN_PATH } from '@/lib/admin-auth';
import { AdminLoginForm } from './_components/admin-login-form';
import styles from './admin-login.module.css';

export const metadata: Metadata = {
  title: 'Admin Login | Neetrino',
};

type AdminLoginPageProps = {
  searchParams: Promise<{
    next?: string | string[];
  }>;
};

function getSafeNextPath(next: string | string[] | undefined): string {
  if (typeof next === 'string' && next.startsWith('/admin') && !next.startsWith(ADMIN_LOGIN_PATH)) {
    return next;
  }

  return ADMIN_DEFAULT_PATH;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="admin-login-title">
        <p className={styles.eyebrow}>Restricted access</p>
        <h1 className={styles.title} id="admin-login-title">
          Admin login
        </h1>
        <p className={styles.description}>
          Sign in with the private admin credentials to manage Neetrino content.
        </p>
        <AdminLoginForm nextPath={nextPath} />
      </section>
    </main>
  );
}

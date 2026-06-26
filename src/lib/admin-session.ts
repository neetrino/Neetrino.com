import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_LOGIN_PATH, ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from '@/lib/admin-auth';

export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE_NAME);
  const isAuthenticated = await verifyAdminSessionCookie(session?.value);

  if (!isAuthenticated) {
    redirect(ADMIN_LOGIN_PATH);
  }
}

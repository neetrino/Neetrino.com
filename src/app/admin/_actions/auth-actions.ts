'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_DEFAULT_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  AdminAuthConfigurationError,
  createAdminSessionCookieValue,
  verifyAdminCredentials,
} from '@/lib/admin-auth';
import { logger } from '@/lib/logger';

const ADMIN_PATH_PREFIX = '/admin';

export type AdminLoginState = {
  status: 'idle' | 'error';
  message: string;
};

function readText(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  return typeof value === 'string' ? value.trim() : '';
}

function readSafeAdminRedirect(formData: FormData): string {
  const nextPath = readText(formData, 'next');

  if (nextPath.startsWith(ADMIN_PATH_PREFIX) && !nextPath.startsWith(ADMIN_LOGIN_PATH)) {
    return nextPath;
  }

  return ADMIN_DEFAULT_PATH;
}

export async function loginAdmin(_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const username = readText(formData, 'username');
  const password = readText(formData, 'password');
  const nextPath = readSafeAdminRedirect(formData);

  try {
    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      return { status: 'error', message: 'Invalid username or password.' };
    }

    const cookieStore = await cookies();

    cookieStore.set(ADMIN_SESSION_COOKIE_NAME, await createAdminSessionCookieValue(), {
      httpOnly: true,
      maxAge: ADMIN_SESSION_TTL_SECONDS,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      logger.error('Admin authentication is not configured.', { error });

      return { status: 'error', message: 'Admin authentication is not configured.' };
    }

    logger.error('Admin login failed.', { error });

    return { status: 'error', message: 'Admin login failed.' };
  }

  redirect(nextPath);
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  redirect(ADMIN_LOGIN_PATH);
}

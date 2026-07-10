import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  ADMIN_DEFAULT_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSessionCookie,
} from '@/lib/admin-auth';

const ADMIN_PATH_PREFIX = '/admin';

function createLoginRedirect(request: NextRequest): NextResponse {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set('next', nextPath);

  return NextResponse.redirect(loginUrl);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);
  const isAuthenticated = await verifyAdminSessionCookie(session?.value);

  if (pathname === ADMIN_LOGIN_PATH) {
    return isAuthenticated ? NextResponse.redirect(new URL(ADMIN_DEFAULT_PATH, request.url)) : NextResponse.next();
  }

  if (pathname.startsWith(ADMIN_PATH_PREFIX) && !isAuthenticated) {
    return createLoginRedirect(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};

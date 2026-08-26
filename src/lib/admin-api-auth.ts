import 'server-only';

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionCookie } from '@/lib/admin-auth';

export async function assertAdminApiRequest(request: NextRequest): Promise<NextResponse | null> {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);
  const isAuthenticated = await verifyAdminSessionCookie(session?.value);

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

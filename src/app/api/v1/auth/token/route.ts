import { NextRequest, NextResponse } from 'next/server';

import { authenticateApiKey, createBearerToken } from '@/lib/api-auth';
import { createMemoryRateLimiter, getClientIp } from '@/lib/memory-rate-limit';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;
const rateLimiter = createMemoryRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

/**
 * Exchanges a configured API key for a short-lived bearer token.
 * Header: `X-API-Key`.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (rateLimiter.isLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const auth = await authenticateApiKey(request.headers);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const token = await createBearerToken();

  return NextResponse.json({
    data: token,
  });
}

import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

/**
 * Default health check must NOT touch Postgres.
 * Periodic uptime monitors would otherwise wake Neon every few minutes.
 *
 * Opt-in DB probe: GET /api/health?db=1
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const checkDatabase = request.nextUrl.searchParams.get('db') === '1';

  if (!checkDatabase) {
    return NextResponse.json({
      status: 'ok',
      database: 'skipped',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Health database probe failed.', { error });
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        message,
      },
      { status: 503 },
    );
  }
}

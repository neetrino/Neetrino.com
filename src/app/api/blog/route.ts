import { NextRequest, NextResponse } from 'next/server';

import { serializeBlogListItems } from '@/app/_components/blog/blog-serialize';
import { parseBlogListQuery } from '@/lib/blog-list-query';
import { logger } from '@/lib/logger';
import { createMemoryRateLimiter, getClientIp } from '@/lib/memory-rate-limit';
import { getPublishedBlogPostPage } from '@/lib/public-blog-posts';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 60;
const rateLimiter = createMemoryRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

/**
 * Returns a published blog listing page for infinite scroll.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (rateLimiter.isLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const query = parseBlogListQuery(request.nextUrl.searchParams);

  if ('error' in query) {
    return NextResponse.json({ error: query.error }, { status: 400 });
  }

  try {
    const page = await getPublishedBlogPostPage(query.offset, query.limit);
    const data = serializeBlogListItems(page.items);

    return NextResponse.json({
      data,
      meta: {
        offset: query.offset,
        limit: query.limit,
        total: page.total,
        hasMore: query.offset + data.length < page.total,
      },
    });
  } catch (error) {
    logger.error('Failed to serve published blog page.', { error });
    return NextResponse.json({ error: 'Unable to load blog posts' }, { status: 500 });
  }
}

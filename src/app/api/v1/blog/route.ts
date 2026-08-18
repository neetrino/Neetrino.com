import { NextRequest, NextResponse } from 'next/server';

import { authenticateBlogApiRequest } from '@/lib/api-auth';
import { parseBlogPostInput } from '@/lib/blog-post-input';
import { BlogPostConflictError, createBlogPostFromInput } from '@/lib/create-blog-post-from-input';
import { logger } from '@/lib/logger';
import { createMemoryRateLimiter, getClientIp } from '@/lib/memory-rate-limit';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const rateLimiter = createMemoryRateLimiter(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);

/**
 * Creates a blog post. Requires `X-API-Key` and `Authorization: Bearer <token>`.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  if (rateLimiter.isLimited(getClientIp(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const auth = await authenticateBlogApiRequest(request.headers);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input = parseBlogPostInput(body);

  if ('error' in input) {
    return NextResponse.json({ error: input.error }, { status: 400 });
  }

  try {
    const post = await createBlogPostFromInput(input);
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof BlogPostConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    logger.error('Blog API failed to create a post.', { error });
    return NextResponse.json({ error: 'Unable to create blog post' }, { status: 500 });
  }
}

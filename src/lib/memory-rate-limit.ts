import type { NextRequest } from 'next/server';

type RateBucket = {
  count: number;
  resetAt: number;
};

export type MemoryRateLimiter = {
  isLimited: (key: string) => boolean;
};

export function createMemoryRateLimiter(windowMs: number, maxRequests: number): MemoryRateLimiter {
  const buckets = new Map<string, RateBucket>();

  return {
    isLimited(key: string): boolean {
      const now = Date.now();
      const existing = buckets.get(key);

      if (!existing || existing.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
      }

      if (existing.count >= maxRequests) {
        return true;
      }

      existing.count += 1;
      return false;
    },
  };
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

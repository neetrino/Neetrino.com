const CDN_BASE = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '').replace(/\/$/, '');

/**
 * Resolves a public static asset path to the R2 CDN URL.
 * Example: `/about/hero-streak.svg` → `https://cdn.neetrino.com/static/about/hero-streak.svg`
 */
export function staticAsset(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (!CDN_BASE) {
    return normalized;
  }

  return `${CDN_BASE}/static${normalized}`;
}

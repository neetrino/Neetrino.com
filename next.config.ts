import type { NextConfig } from 'next';

const IMAGE_CACHE_SECONDS = 300;
const ASSET_CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800';
const PUBLIC_ASSET_FOLDERS = ['about', 'fonts', 'images', 'portfolio', 'services'];
const r2PublicUrl = process.env.R2_PUBLIC_URL;
const PUBLIC_ASSET_CACHE_HEADERS = [
  {
    key: 'Cache-Control',
    value: ASSET_CACHE_CONTROL,
  },
];
const r2RemotePattern = r2PublicUrl
  ? {
      protocol: 'https' as const,
      hostname: new URL(r2PublicUrl).hostname,
    }
  : undefined;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_R2_PUBLIC_URL:
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? process.env.R2_PUBLIC_URL ?? '',
  },
  async headers() {
    return PUBLIC_ASSET_FOLDERS.map((folder) => ({
      source: `/${folder}/:path*`,
      headers: PUBLIC_ASSET_CACHE_HEADERS,
    }));
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: IMAGE_CACHE_SECONDS,
    remotePatterns: r2RemotePattern ? [r2RemotePattern] : [],
    qualities: [52, 60, 75],
  },
};

export default nextConfig;

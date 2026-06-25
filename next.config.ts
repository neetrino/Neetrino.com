import type { NextConfig } from 'next';

const IMAGE_CACHE_SECONDS = 300;
const ASSET_CACHE_CONTROL = 'public, max-age=86400, stale-while-revalidate=604800';
const PUBLIC_ASSET_FOLDERS = ['about', 'figma-home', 'fonts', 'images', 'portfolio', 'services'];
const PUBLIC_ASSET_CACHE_HEADERS = [
  {
    key: 'Cache-Control',
    value: ASSET_CACHE_CONTROL,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return PUBLIC_ASSET_FOLDERS.map((folder) => ({
      source: `/${folder}/:path*`,
      headers: PUBLIC_ASSET_CACHE_HEADERS,
    }));
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: IMAGE_CACHE_SECONDS,
    qualities: [60, 75],
  },
};

export default nextConfig;

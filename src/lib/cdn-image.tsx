import Image, { type ImageProps } from 'next/image';

import { isRemoteImageUrl } from '@/lib/image-url';

/**
 * Drop-in `next/image` wrapper that bypasses Vercel optimization for CDN URLs.
 * Pre-optimized WebP assets on R2 should load directly from the edge.
 */
export function CdnImage({ src, unoptimized, alt = '', ...props }: ImageProps): React.JSX.Element {
  const resolvedSrc = typeof src === 'string' ? src : '';

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={unoptimized || isRemoteImageUrl(resolvedSrc)}
    />
  );
}

'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import {
  resolvePortfolioMediaKind,
  type PortfolioMediaKind,
} from '@/lib/portfolio-media';

type PortfolioMediaProps = {
  src: string;
  alt: string;
  contentType?: string;
  mediaKind?: PortfolioMediaKind;
  className?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  unoptimized?: boolean;
};

export function PortfolioMedia({
  src,
  alt,
  contentType,
  mediaKind,
  className,
  fill = false,
  sizes,
  quality,
  priority = false,
  loading = 'lazy',
  fetchPriority = 'low',
  decoding = 'async',
  unoptimized,
}: PortfolioMediaProps): React.JSX.Element {
  const kind = resolvePortfolioMediaKind(contentType, mediaKind);

  if (kind === 'video') {
    return (
      <video
        src={src}
        className={className}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        {...(fill ? { style: { position: 'absolute', inset: 0, width: '100%', height: '100%' } } : {})}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      unoptimized={unoptimized ?? isRemoteImageUrl(src)}
      className={className}
    />
  );
}

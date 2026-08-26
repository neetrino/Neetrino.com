export const PORTFOLIO_IMAGE_ACCEPT =
  'image/avif,image/gif,image/jpeg,image/png,image/webp' as const;

export const PORTFOLIO_VIDEO_ACCEPT = 'video/mp4,video/webm' as const;

export const PORTFOLIO_MEDIA_ACCEPT =
  `${PORTFOLIO_IMAGE_ACCEPT},${PORTFOLIO_VIDEO_ACCEPT}` as const;

export const SUPPORTED_PORTFOLIO_IMAGE_TYPES = [
  'image/avif',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_PORTFOLIO_GIF_TYPES = ['image/gif'] as const;

export const SUPPORTED_PORTFOLIO_VIDEO_TYPES = ['video/mp4', 'video/webm'] as const;

export const MAX_PORTFOLIO_IMAGE_BYTES = 50 * 1024 * 1024;
export const MAX_PORTFOLIO_VIDEO_BYTES = 200 * 1024 * 1024;

export type PortfolioMediaKind = 'image' | 'video';

const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
};

function formatPortfolioLimitMegabytes(bytes: number): number {
  return Math.round(bytes / (1024 * 1024));
}

export function getPortfolioMediaSizeLimitMessage(): string {
  const imageLimitMb = formatPortfolioLimitMegabytes(MAX_PORTFOLIO_IMAGE_BYTES);
  const videoLimitMb = formatPortfolioLimitMegabytes(MAX_PORTFOLIO_VIDEO_BYTES);

  return `Upload is too large. Images and GIFs: max ${imageLimitMb} MB. Videos: max ${videoLimitMb} MB.`;
}

export function isPortfolioVideoContentType(contentType: string): boolean {
  return contentType.startsWith('video/');
}

export function isPortfolioVideoFile(file: File): boolean {
  if (SUPPORTED_PORTFOLIO_VIDEO_TYPES.includes(file.type as (typeof SUPPORTED_PORTFOLIO_VIDEO_TYPES)[number])) {
    return true;
  }

  return /\.(mp4|webm)$/i.test(file.name);
}

export function isPortfolioGifFile(file: File): boolean {
  return file.type === 'image/gif';
}

export function resolvePortfolioMediaKind(
  contentType: string | undefined,
  mediaKind?: PortfolioMediaKind,
): PortfolioMediaKind {
  if (mediaKind) {
    return mediaKind;
  }

  if (contentType && isPortfolioVideoContentType(contentType)) {
    return 'video';
  }

  return 'image';
}

export function validatePortfolioMediaFile(file: File): PortfolioMediaKind {
  if (isPortfolioVideoFile(file)) {
    if (file.size > MAX_PORTFOLIO_VIDEO_BYTES) {
      throw new Error(
        `Portfolio video must be smaller than ${formatPortfolioLimitMegabytes(MAX_PORTFOLIO_VIDEO_BYTES)}MB.`,
      );
    }

    return 'video';
  }

  const isRasterImage = SUPPORTED_PORTFOLIO_IMAGE_TYPES.includes(
    file.type as (typeof SUPPORTED_PORTFOLIO_IMAGE_TYPES)[number],
  );
  const isGif = isPortfolioGifFile(file);

  if (!isRasterImage && !isGif) {
    throw new Error('Portfolio media must be AVIF, GIF, JPEG, PNG, WebP, MP4, or WebM.');
  }

  if (file.size > MAX_PORTFOLIO_IMAGE_BYTES) {
    throw new Error(
      `Portfolio image must be smaller than ${formatPortfolioLimitMegabytes(MAX_PORTFOLIO_IMAGE_BYTES)}MB.`,
    );
  }

  return 'image';
}

export function getPortfolioMediaValidationError(file: File): string | null {
  try {
    validatePortfolioMediaFile(file);
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : 'Invalid portfolio media file.';
  }
}

/** Maps a stored portfolio MIME type to its R2 object extension. */
export function getPortfolioMediaExtension(contentType: string): string {
  return CONTENT_TYPE_EXTENSIONS[contentType] ?? 'webp';
}

export const PORTFOLIO_IMAGE_ACCEPT =
  'image/avif,image/gif,image/jpeg,image/png,image/webp' as const;

export const PORTFOLIO_VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime,.mov' as const;

export const PORTFOLIO_MEDIA_ACCEPT =
  `${PORTFOLIO_IMAGE_ACCEPT},${PORTFOLIO_VIDEO_ACCEPT}` as const;

export const SUPPORTED_PORTFOLIO_IMAGE_TYPES = [
  'image/avif',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const SUPPORTED_PORTFOLIO_GIF_TYPES = ['image/gif'] as const;

export const MAX_PORTFOLIO_IMAGE_BYTES = 50 * 1024 * 1024;
export const MAX_PORTFOLIO_VIDEO_BYTES = 300 * 1024 * 1024;

export type PortfolioMediaKind = 'image' | 'video';

const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-quicktime': 'mov',
  'video/mov': 'mov',
};

const VIDEO_FILENAME_CONTENT_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
};

function formatPortfolioLimitMegabytes(bytes: number): number {
  return Math.round(bytes / (1024 * 1024));
}

export function getPortfolioMediaSizeLimitMessage(): string {
  const imageLimitMb = formatPortfolioLimitMegabytes(MAX_PORTFOLIO_IMAGE_BYTES);
  const videoLimitMb = formatPortfolioLimitMegabytes(MAX_PORTFOLIO_VIDEO_BYTES);

  return `Upload is too large. Images and GIFs: max ${imageLimitMb} MB. Videos: max ${videoLimitMb} MB.`;
}

export function isPortfolioUploadTransportLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const normalizedMessage = error.message.toLowerCase();

  return (
    normalizedMessage.includes('unexpected end of form') ||
    normalizedMessage.includes('body exceeded') ||
    normalizedMessage.includes('function_payload_too_large') ||
    normalizedMessage.includes('payload too large') ||
    normalizedMessage.includes('content too large') ||
    normalizedMessage.includes('413')
  );
}

export function isPortfolioVideoContentType(contentType: string): boolean {
  return contentType.startsWith('video/');
}

export function isPortfolioVideoFile(file: File): boolean {
  if (file.type.startsWith('video/')) {
    return true;
  }

  return /\.(mp4|webm|mov)$/i.test(file.name);
}

/** Canonical MIME type for a known portfolio video/GIF filename, or undefined. */
export function getPortfolioContentTypeFromFileName(fileName: string): string | undefined {
  const extensionMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);

  if (!extensionMatch) {
    return undefined;
  }

  const extension = extensionMatch[1];

  if (extension === 'gif') {
    return 'image/gif';
  }

  return VIDEO_FILENAME_CONTENT_TYPES[extension];
}

export function isPortfolioGifFile(file: File): boolean {
  return file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
}

/** Canonical MIME type for a portfolio upload, preferring the filename when the browser omits type. */
export function resolvePortfolioUploadContentType(fileName: string, contentType: string): string {
  return getPortfolioContentTypeFromFileName(fileName) ?? (contentType || 'application/octet-stream');
}

export type PortfolioMediaDescriptor = {
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

export function validatePortfolioMediaDescriptor(input: PortfolioMediaDescriptor): PortfolioMediaKind {
  const contentType = resolvePortfolioUploadContentType(input.fileName, input.contentType);
  const isVideo =
    isPortfolioVideoContentType(contentType) || /\.(mp4|webm|mov)$/i.test(input.fileName);

  if (isVideo) {
    if (input.sizeBytes > MAX_PORTFOLIO_VIDEO_BYTES) {
      throw new Error(
        `Portfolio video must be smaller than ${formatPortfolioLimitMegabytes(MAX_PORTFOLIO_VIDEO_BYTES)}MB.`,
      );
    }

    return 'video';
  }

  const isRasterImage = SUPPORTED_PORTFOLIO_IMAGE_TYPES.includes(
    contentType as (typeof SUPPORTED_PORTFOLIO_IMAGE_TYPES)[number],
  );
  const isGif = contentType === 'image/gif' || input.fileName.toLowerCase().endsWith('.gif');

  if (!isRasterImage && !isGif) {
    throw new Error('Portfolio media must be AVIF, GIF, JPEG, PNG, WebP, MP4, WebM, or MOV.');
  }

  if (input.sizeBytes > MAX_PORTFOLIO_IMAGE_BYTES) {
    throw new Error(
      `Portfolio image must be smaller than ${formatPortfolioLimitMegabytes(MAX_PORTFOLIO_IMAGE_BYTES)}MB.`,
    );
  }

  return 'image';
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
  return validatePortfolioMediaDescriptor({
    fileName: file.name,
    contentType: file.type,
    sizeBytes: file.size,
  });
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
  return CONTENT_TYPE_EXTENSIONS[contentType] ?? (contentType.startsWith('video/') ? 'mp4' : 'webp');
}

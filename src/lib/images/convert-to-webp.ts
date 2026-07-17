import sharp from 'sharp';

/** Default quality for uploaded marketing/admin images. */
export const WEBP_UPLOAD_QUALITY = 85;

const WEBP_CONTENT_TYPE = 'image/webp';

export type WebpConversionResult = {
  body: Buffer;
  contentType: typeof WEBP_CONTENT_TYPE;
  extension: 'webp';
};

/**
 * Converts any sharp-supported raster buffer to WebP (keeps alpha when present).
 */
export async function convertImageBufferToWebp(
  input: Buffer,
  quality: number = WEBP_UPLOAD_QUALITY,
): Promise<WebpConversionResult> {
  const image = sharp(input, { failOn: 'none' });
  const meta = await image.metadata();
  const pipeline = image.webp({
    quality,
    alphaQuality: 100,
    effort: 4,
  });

  const body = meta.hasAlpha
    ? await pipeline.ensureAlpha().toBuffer()
    : await pipeline.toBuffer();

  return {
    body,
    contentType: WEBP_CONTENT_TYPE,
    extension: 'webp',
  };
}

/** Replaces the file extension with `.webp` (or appends if none). */
export function replaceKeyExtensionWithWebp(key: string): string {
  if (key.toLowerCase().endsWith('.webp')) {
    return key;
  }

  const slash = key.lastIndexOf('/');
  const nameStart = slash >= 0 ? slash + 1 : 0;
  const dot = key.lastIndexOf('.');

  if (dot > nameStart) {
    return `${key.slice(0, dot)}.webp`;
  }

  return `${key}.webp`;
}

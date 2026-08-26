/** Stay under Vercel's ~4.5MB function payload limit. */
export const PORTFOLIO_UPLOAD_CHUNK_BYTES = 3 * 1024 * 1024;

export const PORTFOLIO_CHUNK_KEY_HEADER = 'x-portfolio-key';
export const PORTFOLIO_CHUNK_TOKEN_HEADER = 'x-portfolio-token';
export const PORTFOLIO_CHUNK_INDEX_HEADER = 'x-portfolio-chunk-index';

export type PortfolioUploadSession = {
  key: string;
  token: string;
  contentType: string;
  chunkSize: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function getPortfolioChunkCount(sizeBytes: number): number {
  if (sizeBytes <= 0) {
    return 0;
  }

  return Math.ceil(sizeBytes / PORTFOLIO_UPLOAD_CHUNK_BYTES);
}

export function getPortfolioPartKey(objectKey: string, chunkIndex: number): string {
  return `${objectKey}.part.${chunkIndex}`;
}

export function getExpectedPortfolioChunkBytes(sizeBytes: number, chunkIndex: number): number {
  const chunkCount = getPortfolioChunkCount(sizeBytes);

  if (chunkIndex < 0 || chunkIndex >= chunkCount) {
    throw new Error('Portfolio upload chunk index is invalid.');
  }

  if (chunkIndex === chunkCount - 1) {
    return sizeBytes - chunkIndex * PORTFOLIO_UPLOAD_CHUNK_BYTES;
  }

  return PORTFOLIO_UPLOAD_CHUNK_BYTES;
}

/** Parses the upload-url JSON. `chunkSize` is optional for older responses. */
export function parsePortfolioUploadSession(payload: unknown): PortfolioUploadSession | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (
    typeof payload.key !== 'string' ||
    payload.key.length === 0 ||
    typeof payload.token !== 'string' ||
    payload.token.length === 0 ||
    typeof payload.contentType !== 'string' ||
    payload.contentType.length === 0
  ) {
    return null;
  }

  return {
    key: payload.key,
    token: payload.token,
    contentType: payload.contentType,
    chunkSize:
      typeof payload.chunkSize === 'number' && payload.chunkSize > 0
        ? payload.chunkSize
        : PORTFOLIO_UPLOAD_CHUNK_BYTES,
  };
}

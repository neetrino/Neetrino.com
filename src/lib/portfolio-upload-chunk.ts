/** Stay under Vercel's ~4.5MB function payload limit, including multipart overhead. */
export const PORTFOLIO_UPLOAD_CHUNK_BYTES = 3 * 1024 * 1024;

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

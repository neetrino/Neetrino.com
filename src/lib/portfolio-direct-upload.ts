import 'server-only';

import { logger } from '@/lib/logger';
import {
  isPortfolioVideoContentType,
  resolvePortfolioUploadContentType,
  validatePortfolioMediaDescriptor,
} from '@/lib/portfolio-media';
import { createPortfolioObjectKey, isPortfolioObjectKey } from '@/lib/portfolio-object-key';
import {
  PORTFOLIO_UPLOAD_CHUNK_BYTES,
  getExpectedPortfolioChunkBytes,
  getPortfolioChunkCount,
  getPortfolioPartKey,
} from '@/lib/portfolio-upload-chunk';
import { createPortfolioUploadToken, verifyPortfolioUploadToken } from '@/lib/portfolio-upload-token';
import {
  deleteR2Object,
  getR2ObjectBuffer,
  getR2PublicObjectUrl,
  headR2Object,
  uploadR2ImageAsWebp,
  uploadR2Object,
} from '@/lib/r2/storage';

export type PortfolioDirectUploadSession = {
  key: string;
  token: string;
  contentType: string;
  chunkSize: number;
};

export type PortfolioDirectUploadResult = {
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

export async function createPortfolioDirectUploadSession(input: {
  fileName: string;
  contentType: string;
  sizeBytes: number;
}): Promise<PortfolioDirectUploadSession> {
  validatePortfolioMediaDescriptor(input);

  const contentType = resolvePortfolioUploadContentType(input.fileName, input.contentType);
  const key = createPortfolioObjectKey(contentType);

  return {
    key,
    contentType,
    chunkSize: PORTFOLIO_UPLOAD_CHUNK_BYTES,
    token: createPortfolioUploadToken({
      key,
      fileName: input.fileName,
      contentType,
      sizeBytes: input.sizeBytes,
    }),
  };
}

function shouldKeepOriginalObject(fileName: string, contentType: string): boolean {
  return (
    isPortfolioVideoContentType(contentType) ||
    contentType === 'image/gif' ||
    fileName.toLowerCase().endsWith('.gif')
  );
}

async function convertDirectUploadToWebp(key: string): Promise<PortfolioDirectUploadResult> {
  const original = await getR2ObjectBuffer(key);
  const uploaded = await uploadR2ImageAsWebp({ key, body: original });

  if (uploaded.key !== key) {
    try {
      await deleteR2Object({ key });
    } catch (error) {
      logger.error('Failed to delete original portfolio image after WebP conversion.', {
        error,
        key,
      });
    }
  }

  return uploaded;
}

function readVerifiedUploadClaims(key: string, token: string) {
  if (!isPortfolioObjectKey(key)) {
    throw new Error('Portfolio object key is invalid.');
  }

  const claims = verifyPortfolioUploadToken(token);

  if (claims.key !== key) {
    throw new Error('Portfolio upload token does not match the object key.');
  }

  return claims;
}

async function assemblePortfolioChunks(
  key: string,
  chunkCount: number,
  contentType: string,
): Promise<void> {
  const parts: Buffer[] = [];

  for (let index = 0; index < chunkCount; index += 1) {
    parts.push(await getR2ObjectBuffer(getPortfolioPartKey(key, index)));
  }

  await uploadR2Object({
    key,
    body: Buffer.concat(parts),
    contentType,
  });

  for (let index = 0; index < chunkCount; index += 1) {
    try {
      await deleteR2Object({ key: getPortfolioPartKey(key, index) });
    } catch (error) {
      logger.error('Failed to delete portfolio upload chunk.', { error, key, index });
    }
  }
}

export async function storePortfolioUploadChunk(input: {
  key: string;
  token: string;
  chunkIndex: number;
  body: Buffer;
}): Promise<void> {
  const claims = readVerifiedUploadClaims(input.key, input.token);
  const expectedBytes = getExpectedPortfolioChunkBytes(claims.sizeBytes, input.chunkIndex);

  if (input.body.byteLength !== expectedBytes) {
    throw new Error('Portfolio upload chunk size is invalid.');
  }

  const chunkCount = getPortfolioChunkCount(claims.sizeBytes);
  const objectKey = chunkCount === 1 ? claims.key : getPortfolioPartKey(claims.key, input.chunkIndex);

  await uploadR2Object({
    key: objectKey,
    body: input.body,
    contentType: chunkCount === 1 ? claims.contentType : 'application/octet-stream',
  });
}

export async function finalizePortfolioDirectUpload(input: {
  key: string;
  token: string;
}): Promise<PortfolioDirectUploadResult> {
  const claims = readVerifiedUploadClaims(input.key, input.token);
  const chunkCount = getPortfolioChunkCount(claims.sizeBytes);

  if (chunkCount > 1) {
    await assemblePortfolioChunks(claims.key, chunkCount, claims.contentType);
  }

  const head = await headR2Object(input.key);

  if (head.sizeBytes !== claims.sizeBytes) {
    throw new Error('Uploaded file size does not match the signed upload.');
  }

  if (shouldKeepOriginalObject(claims.fileName, claims.contentType)) {
    return {
      key: input.key,
      url: getR2PublicObjectUrl(input.key),
      contentType: claims.contentType,
      sizeBytes: head.sizeBytes,
    };
  }

  return convertDirectUploadToWebp(input.key);
}

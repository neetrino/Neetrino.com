import 'server-only';

import { logger } from '@/lib/logger';
import {
  isPortfolioVideoContentType,
  resolvePortfolioUploadContentType,
  validatePortfolioMediaDescriptor,
} from '@/lib/portfolio-media';
import { createPortfolioObjectKey, isPortfolioObjectKey } from '@/lib/portfolio-object-key';
import { createPortfolioUploadToken, verifyPortfolioUploadToken } from '@/lib/portfolio-upload-token';
import {
  createR2PresignedPutUrl,
  deleteR2Object,
  getR2ObjectBuffer,
  getR2PublicObjectUrl,
  headR2Object,
  uploadR2ImageAsWebp,
} from '@/lib/r2/storage';

export type PortfolioDirectUploadSession = {
  uploadUrl: string;
  key: string;
  token: string;
  contentType: string;
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
  const { uploadUrl } = await createR2PresignedPutUrl({ key, contentType });

  return {
    uploadUrl,
    key,
    contentType,
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

export async function finalizePortfolioDirectUpload(input: {
  key: string;
  token: string;
}): Promise<PortfolioDirectUploadResult> {
  if (!isPortfolioObjectKey(input.key)) {
    throw new Error('Portfolio object key is invalid.');
  }

  const claims = verifyPortfolioUploadToken(input.token);

  if (claims.key !== input.key) {
    throw new Error('Portfolio upload token does not match the object key.');
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

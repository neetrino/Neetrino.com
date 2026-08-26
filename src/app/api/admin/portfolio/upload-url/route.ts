import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import { createPortfolioDirectUploadSession } from '@/lib/portfolio-direct-upload';
import { getPortfolioUploadErrorMessage } from '@/lib/portfolio-upload-service';

export const runtime = 'nodejs';

type DirectUploadRequest = {
  fileName: string;
  contentType: string;
  sizeBytes: number;
};

function parseDirectUploadRequest(payload: unknown): DirectUploadRequest {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Upload request is invalid.');
  }

  const record = payload as Record<string, unknown>;

  if (typeof record.fileName !== 'string' || record.fileName.trim().length === 0) {
    throw new Error('File name is required.');
  }

  if (typeof record.contentType !== 'string') {
    throw new Error('Content type is required.');
  }

  if (typeof record.sizeBytes !== 'number' || !Number.isFinite(record.sizeBytes) || record.sizeBytes <= 0) {
    throw new Error('File size is invalid.');
  }

  return {
    fileName: record.fileName.trim(),
    contentType: record.contentType,
    sizeBytes: record.sizeBytes,
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const unauthorized = await assertAdminApiRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const session = await createPortfolioDirectUploadSession(
      parseDirectUploadRequest(await request.json()),
    );

    return NextResponse.json(session);
  } catch (error) {
    logger.error('Failed to create portfolio direct-upload session.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}

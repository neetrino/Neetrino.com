import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import { storePortfolioUploadChunk } from '@/lib/portfolio-direct-upload';
import { getPortfolioUploadErrorMessage } from '@/lib/portfolio-upload-service';

export const runtime = 'nodejs';

async function readChunkRequest(formData: FormData): Promise<{
  key: string;
  token: string;
  chunkIndex: number;
  body: Buffer;
}> {
  const key = formData.get('objectKey');
  const token = formData.get('uploadToken');
  const chunkIndexValue = formData.get('chunkIndex');
  const chunk = formData.get('chunk');

  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Portfolio object key is required.');
  }

  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Portfolio upload token is required.');
  }

  if (typeof chunkIndexValue !== 'string') {
    throw new Error('Chunk index is required.');
  }

  const chunkIndex = Number.parseInt(chunkIndexValue, 10);

  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) {
    throw new Error('Chunk index is invalid.');
  }

  if (!(chunk instanceof File) || chunk.size === 0) {
    throw new Error('Portfolio upload chunk is required.');
  }

  return {
    key,
    token,
    chunkIndex,
    body: Buffer.from(await chunk.arrayBuffer()),
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const unauthorized = await assertAdminApiRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const parsed = await readChunkRequest(await request.formData());
    await storePortfolioUploadChunk(parsed);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('Failed to store portfolio upload chunk.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}

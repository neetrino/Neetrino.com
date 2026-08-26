import { NextRequest, NextResponse } from 'next/server';
import { assertAdminApiRequest } from '@/lib/admin-api-auth';
import { logger } from '@/lib/logger';
import { storePortfolioUploadChunk } from '@/lib/portfolio-direct-upload';
import {
  PORTFOLIO_CHUNK_INDEX_HEADER,
  PORTFOLIO_CHUNK_KEY_HEADER,
  PORTFOLIO_CHUNK_TOKEN_HEADER,
} from '@/lib/portfolio-upload-chunk';
import { getPortfolioUploadErrorMessage } from '@/lib/portfolio-upload-service';

export const runtime = 'nodejs';

function readRequiredHeader(request: NextRequest, name: string, label: string): string {
  const value = request.headers.get(name)?.trim();

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

async function readChunkRequest(request: NextRequest): Promise<{
  key: string;
  token: string;
  chunkIndex: number;
  body: Buffer;
}> {
  const key = readRequiredHeader(request, PORTFOLIO_CHUNK_KEY_HEADER, 'Portfolio object key');
  const token = readRequiredHeader(request, PORTFOLIO_CHUNK_TOKEN_HEADER, 'Portfolio upload token');
  const chunkIndex = Number.parseInt(
    readRequiredHeader(request, PORTFOLIO_CHUNK_INDEX_HEADER, 'Chunk index'),
    10,
  );

  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) {
    throw new Error('Chunk index is invalid.');
  }

  const body = Buffer.from(await request.arrayBuffer());

  if (body.byteLength === 0) {
    throw new Error('Portfolio upload chunk is required.');
  }

  return { key, token, chunkIndex, body };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const unauthorized = await assertAdminApiRequest(request);

  if (unauthorized) {
    return unauthorized;
  }

  try {
    await storePortfolioUploadChunk(await readChunkRequest(request));

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    logger.error('Failed to store portfolio upload chunk.', { error });

    return NextResponse.json({ error: getPortfolioUploadErrorMessage(error) }, { status: 400 });
  }
}

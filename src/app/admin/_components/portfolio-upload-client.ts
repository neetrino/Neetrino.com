import { resolvePortfolioUploadContentType } from '@/lib/portfolio-media';
import { createPortfolioCompletePayload } from '@/lib/portfolio-complete-payload';
import {
  PORTFOLIO_CHUNK_INDEX_HEADER,
  PORTFOLIO_CHUNK_KEY_HEADER,
  PORTFOLIO_CHUNK_TOKEN_HEADER,
  PORTFOLIO_UPLOAD_CHUNK_BYTES,
  getExpectedPortfolioChunkBytes,
  getPortfolioChunkCount,
  parsePortfolioUploadSession,
  type PortfolioUploadSession,
} from '@/lib/portfolio-upload-chunk';
import { parseAdminPortfolioAsset, type AdminPortfolioAsset } from './admin-portfolio-asset';
import { resolvePortfolioUploadErrorMessage } from './portfolio-upload-validation';

type PortfolioUploadResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

type PortfolioUpdateResult =
  | { status: 'success'; asset: AdminPortfolioAsset }
  | { status: 'error'; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readApiErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  const statusError = new Error(`Request failed with status ${response.status}`);

  try {
    const payload: unknown = await response.json();

    if (
      isRecord(payload) &&
      typeof payload.error === 'string' &&
      payload.error.length > 0
    ) {
      return resolvePortfolioUploadErrorMessage(new Error(payload.error), fallbackMessage);
    }
  } catch {
    // Fall back to the HTTP status when the API body is not JSON.
  }

  return resolvePortfolioUploadErrorMessage(statusError, fallbackMessage);
}

function parseUpdatedAssetPayload(payload: unknown): AdminPortfolioAsset | null {
  if (!isRecord(payload) || !isRecord(payload.data)) {
    return null;
  }

  return parseAdminPortfolioAsset(payload.data);
}

function readSelectedMediaFile(formData: FormData): File | null {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return file;
}

async function requestDirectUploadSession(
  file: File,
  fallbackMessage: string,
): Promise<PortfolioUploadSession> {
  const response = await fetch('/api/admin/portfolio/upload-url', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      contentType: resolvePortfolioUploadContentType(file.name, file.type),
      sizeBytes: file.size,
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, fallbackMessage));
  }

  const session = parsePortfolioUploadSession(await response.json());

  if (!session) {
    throw new Error('Upload session was invalid. Refresh the page and try again.');
  }

  return session;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

async function postPortfolioChunk(
  session: PortfolioUploadSession,
  chunkIndex: number,
  chunk: Uint8Array,
  fallbackMessage: string,
): Promise<void> {
  const response = await fetch('/api/admin/portfolio/upload-chunk', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/octet-stream',
      [PORTFOLIO_CHUNK_KEY_HEADER]: session.key,
      [PORTFOLIO_CHUNK_TOKEN_HEADER]: session.token,
      [PORTFOLIO_CHUNK_INDEX_HEADER]: String(chunkIndex),
    },
    body: toArrayBuffer(chunk),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, fallbackMessage));
  }
}

async function readFileBytes(file: File): Promise<Uint8Array> {
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (bytes.byteLength !== file.size) {
    throw new Error('Could not read the selected file. Try choosing it again.');
  }

  return bytes;
}

async function uploadSelectedFile(
  file: File,
  fallbackMessage: string,
): Promise<PortfolioUploadSession> {
  const session = await requestDirectUploadSession(file, fallbackMessage);
  const bytes = await readFileBytes(file);
  const chunkCount = getPortfolioChunkCount(bytes.byteLength);

  for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex += 1) {
    const start = chunkIndex * PORTFOLIO_UPLOAD_CHUNK_BYTES;
    const chunk = bytes.slice(start, start + PORTFOLIO_UPLOAD_CHUNK_BYTES);
    const expected = getExpectedPortfolioChunkBytes(bytes.byteLength, chunkIndex);

    if (chunk.byteLength !== expected) {
      throw new Error('Portfolio upload chunk size is invalid.');
    }

    await postPortfolioChunk(session, chunkIndex, chunk, fallbackMessage);
  }

  return session;
}

export async function uploadPortfolioAssetViaApi(
  formData: FormData,
  fallbackMessage: string,
): Promise<PortfolioUploadResult> {
  try {
    const file = readSelectedMediaFile(formData);

    if (!file) {
      return { status: 'error', message: 'Portfolio media is required.' };
    }

    const session = await uploadSelectedFile(file, fallbackMessage);
    const response = await fetch('/api/admin/portfolio/upload', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        createPortfolioCompletePayload(formData, {
          key: session.key,
          token: session.token,
          fileName: file.name,
        }),
      ),
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: await readApiErrorMessage(response, fallbackMessage),
      };
    }

    return { status: 'success' };
  } catch (error) {
    return {
      status: 'error',
      message: resolvePortfolioUploadErrorMessage(error, fallbackMessage),
    };
  }
}

export async function updatePortfolioAssetViaApi(
  assetId: string,
  formData: FormData,
  fallbackMessage: string,
): Promise<PortfolioUpdateResult> {
  try {
    const file = readSelectedMediaFile(formData);
    const session = file ? await uploadSelectedFile(file, fallbackMessage) : undefined;
    const response = await fetch(`/api/admin/portfolio/${assetId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        createPortfolioCompletePayload(
          formData,
          session && file
            ? { key: session.key, token: session.token, fileName: file.name }
            : undefined,
        ),
      ),
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: await readApiErrorMessage(response, fallbackMessage),
      };
    }

    const asset = parseUpdatedAssetPayload(await response.json());

    if (!asset) {
      return { status: 'error', message: fallbackMessage };
    }

    return {
      status: 'success',
      asset,
    };
  } catch (error) {
    return {
      status: 'error',
      message: resolvePortfolioUploadErrorMessage(error, fallbackMessage),
    };
  }
}

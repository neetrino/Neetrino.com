import { resolvePortfolioUploadContentType } from '@/lib/portfolio-media';
import { createPortfolioCompletePayload } from '@/lib/portfolio-complete-payload';
import { parseAdminPortfolioAsset, type AdminPortfolioAsset } from './admin-portfolio-asset';
import { resolvePortfolioUploadErrorMessage } from './portfolio-upload-validation';

type PortfolioUploadResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

type PortfolioUpdateResult =
  | { status: 'success'; asset: AdminPortfolioAsset }
  | { status: 'error'; message: string };

type DirectUploadSession = {
  uploadUrl: string;
  key: string;
  token: string;
  contentType: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

async function readApiErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
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
    // Fall back to generic message when the API body is not JSON.
  }

  return resolvePortfolioUploadErrorMessage(
    new Error(`Request failed with status ${response.status}`),
    fallbackMessage,
  );
}

function parseUpdatedAssetPayload(payload: unknown): AdminPortfolioAsset | null {
  if (!isRecord(payload) || !isRecord(payload.data)) {
    return null;
  }

  return parseAdminPortfolioAsset(payload.data);
}

function parseDirectUploadSession(payload: unknown): DirectUploadSession | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (
    typeof payload.uploadUrl !== 'string' ||
    typeof payload.key !== 'string' ||
    typeof payload.token !== 'string' ||
    typeof payload.contentType !== 'string'
  ) {
    return null;
  }

  return {
    uploadUrl: payload.uploadUrl,
    key: payload.key,
    token: payload.token,
    contentType: payload.contentType,
  };
}

function readSelectedMediaFile(formData: FormData): File | null {
  const file = formData.get('image');

  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  return file;
}

async function requestDirectUploadSession(file: File, fallbackMessage: string): Promise<DirectUploadSession> {
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

  const session = parseDirectUploadSession(await response.json());

  if (!session) {
    throw new Error(fallbackMessage);
  }

  return session;
}

async function putFileToStorage(session: DirectUploadSession, file: File): Promise<void> {
  const response = await fetch(session.uploadUrl, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'omit',
    body: file,
    headers: { 'Content-Type': session.contentType },
  });

  if (!response.ok) {
    throw new Error(`Storage upload failed with status ${response.status}`);
  }
}

async function uploadSelectedFile(
  file: File,
  fallbackMessage: string,
): Promise<DirectUploadSession> {
  const session = await requestDirectUploadSession(file, fallbackMessage);
  await putFileToStorage(session, file);
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

import { parseAdminPortfolioAsset, type AdminPortfolioAsset } from './admin-portfolio-asset';
import { resolvePortfolioUploadErrorMessage } from './portfolio-upload-validation';

type PortfolioUploadResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

type PortfolioUpdateResult =
  | { status: 'success'; asset: AdminPortfolioAsset }
  | { status: 'error'; message: string };

async function readApiErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const payload: unknown = await response.json();

    if (
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
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

export async function uploadPortfolioAssetViaApi(
  formData: FormData,
  fallbackMessage: string,
): Promise<PortfolioUploadResult> {
  try {
    const response = await fetch('/api/admin/portfolio/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
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
    const response = await fetch(`/api/admin/portfolio/${assetId}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      return {
        status: 'error',
        message: await readApiErrorMessage(response, fallbackMessage),
      };
    }

    const payload: unknown = await response.json();

    if (
      !payload ||
      typeof payload !== 'object' ||
      !('data' in payload) ||
      !payload.data ||
      typeof payload.data !== 'object'
    ) {
      return { status: 'error', message: fallbackMessage };
    }

    const asset = parseAdminPortfolioAsset(payload.data);

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

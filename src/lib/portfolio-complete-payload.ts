const PORTFOLIO_COMPLETE_FIELD_NAMES = [
  'title',
  'alt',
  'assetType',
  'status',
  'projectUrl',
  'assetId',
] as const;

export type PortfolioCompleteDirectUpload = {
  key: string;
  token: string;
  fileName: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readFormText(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);

  return typeof value === 'string' ? value : undefined;
}

/**
 * Builds the JSON body for create/update after a direct R2 PUT.
 * File fields are never copied — the media must not go through Vercel.
 */
export function createPortfolioCompletePayload(
  formData: FormData,
  directUpload?: PortfolioCompleteDirectUpload,
): Record<string, string> {
  const payload: Record<string, string> = {};

  for (const name of PORTFOLIO_COMPLETE_FIELD_NAMES) {
    const value = readFormText(formData, name);

    if (value !== undefined) {
      payload[name] = value;
    }
  }

  if (directUpload) {
    payload.objectKey = directUpload.key;
    payload.uploadToken = directUpload.token;
    payload.fileName = directUpload.fileName;
  }

  return payload;
}

/** Converts a JSON complete/update body into the FormData shape the upload service already reads. */
export function jsonToPortfolioFormData(payload: unknown): FormData {
  if (!isPlainObject(payload)) {
    throw new Error('Upload request is invalid.');
  }

  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      formData.set(key, value);
    }
  }

  return formData;
}

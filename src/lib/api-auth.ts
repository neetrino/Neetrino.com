import { readEnvValue } from '@/lib/telegram/read-env';

const API_KEY_HEADER = 'x-api-key';
const BEARER_PREFIX = 'Bearer ';
const TOKEN_PREFIX = 'blog-api';
const HMAC_ALGORITHM = 'HMAC';
const HMAC_HASH = 'SHA-256';
const MIN_API_KEY_LENGTH = 32;
const NONCE_BYTE_LENGTH = 16;

export const BLOG_API_TOKEN_TTL_SECONDS = 60 * 60;

export class ApiAuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiAuthConfigurationError';
  }
}

export type ApiAuthFailure = {
  ok: false;
  status: 401 | 503;
  error: string;
};

export type ApiAuthSuccess = {
  ok: true;
};

export type ApiAuthResult = ApiAuthSuccess | ApiAuthFailure;

function decodeBase64(value: string): Uint8Array | null {
  try {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

function encodeBase64(bytes: Uint8Array): string {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function encodeBase64Url(bytes: Uint8Array): string {
  return encodeBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeBase64Url(value: string): Uint8Array | null {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;

  return decodeBase64(`${padded}${'='.repeat(padLength)}`);
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }

  return difference === 0;
}

export function getConfiguredApiKey(): string {
  const apiKey = readEnvValue('API_KEY');

  if (!apiKey || apiKey.length < MIN_API_KEY_LENGTH) {
    throw new ApiAuthConfigurationError(
      `API_KEY is required and must be at least ${MIN_API_KEY_LENGTH} characters.`,
    );
  }

  return apiKey;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: HMAC_ALGORITHM, hash: HMAC_HASH },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(HMAC_ALGORITHM, key, new TextEncoder().encode(payload));

  return encodeBase64Url(new Uint8Array(signature));
}

function createTokenPayload(expiresAtMs: number, nonce: string): string {
  return `${TOKEN_PREFIX}.${expiresAtMs}.${nonce}`;
}

export function readApiKeyHeader(headers: Headers): string | undefined {
  const value = headers.get(API_KEY_HEADER)?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function readBearerToken(headers: Headers): string | undefined {
  const authorization = headers.get('authorization');

  if (!authorization?.startsWith(BEARER_PREFIX)) {
    return undefined;
  }

  const token = authorization.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : undefined;
}

export async function isValidApiKey(provided: string | undefined): Promise<boolean> {
  if (!provided) {
    return false;
  }

  const expected = getConfiguredApiKey();
  const actualBytes = new TextEncoder().encode(provided);
  const expectedBytes = new TextEncoder().encode(expected);

  return timingSafeEqual(actualBytes, expectedBytes);
}

export async function createBearerToken(now = Date.now()): Promise<{
  token: string;
  expiresIn: number;
  tokenType: 'Bearer';
}> {
  const expiresAtMs = now + BLOG_API_TOKEN_TTL_SECONDS * 1000;
  const nonce = encodeBase64Url(crypto.getRandomValues(new Uint8Array(NONCE_BYTE_LENGTH)));
  const payload = createTokenPayload(expiresAtMs, nonce);
  const signature = await signPayload(payload, getConfiguredApiKey());

  return {
    token: `${payload}.${signature}`,
    expiresIn: BLOG_API_TOKEN_TTL_SECONDS,
    tokenType: 'Bearer',
  };
}

export async function verifyBearerToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token) {
    return false;
  }

  const [prefix, expiresAtValue, nonce, signature] = token.split('.');
  const expiresAtMs = Number(expiresAtValue);

  if (
    prefix !== TOKEN_PREFIX ||
    !Number.isSafeInteger(expiresAtMs) ||
    expiresAtMs <= now ||
    !nonce ||
    !signature
  ) {
    return false;
  }

  const expectedSignature = await signPayload(createTokenPayload(expiresAtMs, nonce), getConfiguredApiKey());
  const actualBytes = decodeBase64Url(signature);
  const expectedBytes = decodeBase64Url(expectedSignature);

  return Boolean(actualBytes && expectedBytes && timingSafeEqual(actualBytes, expectedBytes));
}

function toAuthFailure(error: unknown): ApiAuthFailure {
  if (error instanceof ApiAuthConfigurationError) {
    return { ok: false, status: 503, error: 'Blog API is not configured.' };
  }

  throw error;
}

export async function authenticateApiKey(headers: Headers): Promise<ApiAuthResult> {
  try {
    const isValid = await isValidApiKey(readApiKeyHeader(headers));
    return isValid ? { ok: true } : { ok: false, status: 401, error: 'Unauthorized' };
  } catch (error) {
    return toAuthFailure(error);
  }
}

export async function authenticateBlogApiRequest(headers: Headers): Promise<ApiAuthResult> {
  const apiKeyResult = await authenticateApiKey(headers);

  if (!apiKeyResult.ok) {
    return apiKeyResult;
  }

  try {
    const isValid = await verifyBearerToken(readBearerToken(headers));
    return isValid ? { ok: true } : { ok: false, status: 401, error: 'Unauthorized' };
  } catch (error) {
    return toAuthFailure(error);
  }
}

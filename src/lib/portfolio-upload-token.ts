import { createHmac, timingSafeEqual } from 'node:crypto';

const HMAC_ALGORITHM = 'sha256';
const MIN_SECRET_LENGTH = 32;
const TOKEN_PARTS = 2;

export const PORTFOLIO_DIRECT_UPLOAD_TTL_MS = 30 * 60 * 1000;

export type PortfolioUploadTokenClaims = {
  key: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  exp: number;
};

function getUploadTokenSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error('ADMIN_SESSION_SECRET is required to sign portfolio uploads.');
  }

  return secret;
}

function signPayload(payload: string): string {
  return createHmac(HMAC_ALGORITHM, getUploadTokenSecret()).update(payload).digest('base64url');
}

function readClaims(value: unknown): PortfolioUploadTokenClaims | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.key !== 'string' ||
    typeof record.fileName !== 'string' ||
    typeof record.contentType !== 'string' ||
    typeof record.sizeBytes !== 'number' ||
    typeof record.exp !== 'number'
  ) {
    return null;
  }

  return {
    key: record.key,
    fileName: record.fileName,
    contentType: record.contentType,
    sizeBytes: record.sizeBytes,
    exp: record.exp,
  };
}

export function createPortfolioUploadToken(
  claims: Omit<PortfolioUploadTokenClaims, 'exp'>,
  nowMs: number = Date.now(),
): string {
  const payload = Buffer.from(
    JSON.stringify({
      ...claims,
      exp: nowMs + PORTFOLIO_DIRECT_UPLOAD_TTL_MS,
    } satisfies PortfolioUploadTokenClaims),
  ).toString('base64url');

  return `${payload}.${signPayload(payload)}`;
}

export function verifyPortfolioUploadToken(
  token: string,
  nowMs: number = Date.now(),
): PortfolioUploadTokenClaims {
  const parts = token.split('.');

  if (parts.length !== TOKEN_PARTS || !parts[0] || !parts[1]) {
    throw new Error('Portfolio upload token is invalid.');
  }

  const [payload, signature] = parts;
  const expected = signPayload(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    throw new Error('Portfolio upload token is invalid.');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Portfolio upload token is invalid.');
  }

  const claims = readClaims(parsed);

  if (!claims) {
    throw new Error('Portfolio upload token is invalid.');
  }

  if (claims.exp <= nowMs) {
    throw new Error('Portfolio upload token has expired.');
  }

  return claims;
}

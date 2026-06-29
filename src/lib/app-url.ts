import { headers } from 'next/headers';

const LOCALHOST_FALLBACK = 'http://localhost:3000';

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, '');
}

function readPrimaryHeader(value: string | null): string | undefined {
  const primary = value?.split(',')[0]?.trim();
  return primary || undefined;
}

function readEnvAppUrl(): string | undefined {
  const fromEnv = process.env.APP_URL ?? process.env.NEXT_PUBLIC_API_URL;
  return fromEnv ? normalizeOrigin(fromEnv) : undefined;
}

function resolveOriginFromHeaders(headerList: Headers): string | undefined {
  const host = readPrimaryHeader(headerList.get('x-forwarded-host') ?? headerList.get('host'));

  if (!host) {
    return undefined;
  }

  const protocol =
    readPrimaryHeader(headerList.get('x-forwarded-proto')) ??
    (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');

  return normalizeOrigin(`${protocol}://${host}`);
}

/**
 * Resolves the public app origin for shareable URLs.
 * Prefers the incoming request host so admin links match the domain being used.
 */
export async function resolveAppUrl(): Promise<string> {
  const requestOrigin = resolveOriginFromHeaders(await headers());

  if (requestOrigin) {
    return requestOrigin;
  }

  return readEnvAppUrl() ?? LOCALHOST_FALLBACK;
}

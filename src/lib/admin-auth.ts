const ADMIN_SESSION_PAYLOAD_PREFIX = 'admin-session';
const HASH_BYTE_LENGTH = 32;
const HMAC_ALGORITHM = 'HMAC';
const MIN_PASSWORD_LENGTH = 12;
const MIN_PASSWORD_HASH_ITERATIONS = 600_000;
const MIN_SESSION_SECRET_LENGTH = 32;
const PBKDF2_ALGORITHM = 'pbkdf2-sha256';
const PBKDF2_HASH_ALGORITHM = 'SHA-256';
const SESSION_TTL_HOURS = 8;
const SECONDS_PER_HOUR = 60 * 60;
const BITS_PER_BYTE = 8;

export const ADMIN_LOGIN_PATH = '/admin-login';
export const ADMIN_DEFAULT_PATH = '/admin/blog';
export const ADMIN_SESSION_COOKIE_NAME = 'neetrino_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = SESSION_TTL_HOURS * SECONDS_PER_HOUR;

export class AdminAuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminAuthConfigurationError';
  }
}

type PasswordHashParts = {
  iterations: number;
  salt: Uint8Array;
  hash: Uint8Array;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new AdminAuthConfigurationError(`${name} is required for admin authentication.`);
  }

  return value.trim();
}

function getSessionSecret(): string {
  const secret = getRequiredEnv('ADMIN_SESSION_SECRET');

  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new AdminAuthConfigurationError('ADMIN_SESSION_SECRET must be at least 32 characters.');
  }

  return secret;
}

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

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function parsePasswordHash(value: string): PasswordHashParts {
  const [algorithm, iterationsValue, saltValue, hashValue] = value.split(':');
  const iterations = Number(iterationsValue);
  const salt = saltValue ? decodeBase64(saltValue) : null;
  const hash = hashValue ? decodeBase64(hashValue) : null;

  if (
    algorithm !== PBKDF2_ALGORITHM ||
    !Number.isSafeInteger(iterations) ||
    iterations < MIN_PASSWORD_HASH_ITERATIONS ||
    !salt ||
    !hash ||
    hash.length !== HASH_BYTE_LENGTH
  ) {
    throw new AdminAuthConfigurationError('ADMIN_PASSWORD_HASH has an invalid format.');
  }

  return { iterations, salt, hash };
}

async function derivePasswordHash(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: PBKDF2_HASH_ALGORITHM,
      salt: toArrayBuffer(salt),
      iterations,
    },
    key,
    HASH_BYTE_LENGTH * BITS_PER_BYTE,
  );

  return new Uint8Array(derived);
}

async function signSessionPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: HMAC_ALGORITHM, hash: PBKDF2_HASH_ALGORITHM },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(HMAC_ALGORITHM, key, new TextEncoder().encode(payload));

  return encodeBase64(new Uint8Array(signature));
}

function createSessionPayload(expiresAtMs: number): string {
  return `${ADMIN_SESSION_PAYLOAD_PREFIX}.${expiresAtMs}`;
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = getRequiredEnv('ADMIN_USERNAME');
  const passwordHash = parsePasswordHash(getRequiredEnv('ADMIN_PASSWORD_HASH'));

  if (username !== expectedUsername || password.length < MIN_PASSWORD_LENGTH) {
    return false;
  }

  const actualHash = await derivePasswordHash(password, passwordHash.salt, passwordHash.iterations);

  return timingSafeEqual(actualHash, passwordHash.hash);
}

export async function createAdminSessionCookieValue(now = Date.now()): Promise<string> {
  const expiresAtMs = now + ADMIN_SESSION_TTL_SECONDS * 1000;
  const payload = createSessionPayload(expiresAtMs);
  const signature = await signSessionPayload(payload, getSessionSecret());

  return `${expiresAtMs}.${signature}`;
}

export async function verifyAdminSessionCookie(value: string | undefined): Promise<boolean> {
  if (!value) {
    return false;
  }

  const [expiresAtValue, signature] = value.split('.');
  const expiresAtMs = Number(expiresAtValue);

  if (!Number.isSafeInteger(expiresAtMs) || expiresAtMs <= Date.now() || !signature) {
    return false;
  }

  try {
    const expectedSignature = await signSessionPayload(createSessionPayload(expiresAtMs), getSessionSecret());
    const actualBytes = decodeBase64(signature);
    const expectedBytes = decodeBase64(expectedSignature);

    return Boolean(actualBytes && expectedBytes && timingSafeEqual(actualBytes, expectedBytes));
  } catch (error) {
    if (error instanceof AdminAuthConfigurationError) {
      return false;
    }

    throw error;
  }
}

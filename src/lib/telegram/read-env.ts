/**
 * Reads and normalizes a process env value for runtime config.
 * Strips accidental wrapping quotes that often appear when pasting into Vercel.
 */
export function readEnvValue(name: string): string | undefined {
  const raw = process.env[name];
  if (raw == null) {
    return undefined;
  }

  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }

  return value.length > 0 ? value : undefined;
}

/** True for common truthy flags used in hosting dashboards. */
export function readEnvFlag(name: string): boolean {
  const value = readEnvValue(name)?.toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
}

/** Returns a public http(s) URL suitable for Telegram inline buttons, or null. */
export function toTelegramButtonUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

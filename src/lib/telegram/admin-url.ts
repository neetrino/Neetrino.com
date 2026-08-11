import { readEnvValue } from './read-env';

/**
 * Builds the Admin Panel deep link for a contact message.
 * `adminAppUrl` is the admin base (for example https://example.com/admin).
 */
export function buildAdminMessageUrl(adminAppUrl: string, messageId: string): string {
  const base = adminAppUrl.replace(/\/+$/, '');
  return `${base}/messages?messageId=${encodeURIComponent(messageId)}`;
}

/**
 * Builds the Admin Panel deep link for a payment order (PaymentAttempt id).
 */
export function buildAdminOrderUrl(adminAppUrl: string, orderId: string): string {
  const base = adminAppUrl.replace(/\/+$/, '');
  return `${base}/orders?orderId=${encodeURIComponent(orderId)}`;
}

export function resolveAdminAppUrl(): string | null {
  const fromAdminAppUrl = readEnvValue('ADMIN_APP_URL');
  if (fromAdminAppUrl) {
    return fromAdminAppUrl.replace(/\/+$/, '');
  }

  const fromLegacyAdminUrl = readEnvValue('ADMIN_URL');
  if (fromLegacyAdminUrl) {
    return fromLegacyAdminUrl.replace(/\/+$/, '');
  }

  const fromAppUrl = readEnvValue('APP_URL');
  if (fromAppUrl) {
    return `${fromAppUrl.replace(/\/+$/, '')}/admin`;
  }

  return null;
}

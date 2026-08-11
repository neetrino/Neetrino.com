import { logger } from '../logger';

import { buildAdminMessageUrl, buildAdminOrderUrl } from './admin-url';
import { getTelegramConfig } from './config';
import { buildNewMessageNotification } from './format-notification';
import { buildOrderPaidNotification } from './format-order-paid';
import { toTelegramButtonUrl } from './read-env';
import {
  fanOutTelegramNotification,
  getRecipients,
  type TelegramTransportDeps,
} from './transport';
import type {
  NewMessageNotificationPayload,
  OrderPaidNotificationPayload,
  TelegramDeliverySummary,
} from './types';

export type TelegramServiceDeps = TelegramTransportDeps;

export { getRecipients };

function resolveSafeAdminButtonUrl(
  adminAppUrl: string | null,
  buildUrl: (adminAppUrl: string) => string,
  subjectKey: 'messageId' | 'orderId',
  subjectId: string,
): string | null {
  if (!adminAppUrl) {
    return null;
  }

  const candidate = buildUrl(adminAppUrl);
  const safeUrl = toTelegramButtonUrl(candidate);
  if (!safeUrl) {
    logger.warn('Telegram Open button omitted: ADMIN_APP_URL is not a valid http(s) URL', {
      [subjectKey]: subjectId,
    });
  }

  return safeUrl;
}

/**
 * Fans out one new-message notification to all configured Telegram recipients.
 */
export async function notifyNewMessage(
  payload: NewMessageNotificationPayload,
  deps?: TelegramServiceDeps,
): Promise<TelegramDeliverySummary> {
  const config = (deps?.getConfig ?? getTelegramConfig)();
  const openMessageUrl = resolveSafeAdminButtonUrl(
    config.adminAppUrl,
    (adminAppUrl) => buildAdminMessageUrl(adminAppUrl, payload.id),
    'messageId',
    payload.id,
  );

  const notification = buildNewMessageNotification(payload, openMessageUrl);
  return fanOutTelegramNotification(
    {
      event: 'new_message',
      subjectId: payload.id,
      subjectKey: 'messageId',
    },
    notification,
    deps,
  );
}

/**
 * Fans out one order-paid notification to all configured Telegram recipients.
 */
export async function notifyOrderPaid(
  payload: OrderPaidNotificationPayload,
  deps?: TelegramServiceDeps,
): Promise<TelegramDeliverySummary> {
  const config = (deps?.getConfig ?? getTelegramConfig)();
  const openOrderUrl = resolveSafeAdminButtonUrl(
    config.adminAppUrl,
    (adminAppUrl) => buildAdminOrderUrl(adminAppUrl, payload.orderId),
    'orderId',
    payload.orderId,
  );

  const notification = buildOrderPaidNotification(payload, openOrderUrl);
  return fanOutTelegramNotification(
    {
      event: 'order_paid',
      subjectId: payload.orderId,
      subjectKey: 'orderId',
    },
    notification,
    deps,
  );
}

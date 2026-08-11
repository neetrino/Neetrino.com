import { buildAdminMessageUrl, buildAdminOrderUrl } from './admin-url';
import { getTelegramConfig } from './config';
import { buildNewMessageNotification } from './format-notification';
import { buildOrderPaidNotification } from './format-order-paid';
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

/**
 * Fans out one new-message notification to all configured Telegram recipients.
 */
export async function notifyNewMessage(
  payload: NewMessageNotificationPayload,
  deps?: TelegramServiceDeps,
): Promise<TelegramDeliverySummary> {
  const config = (deps?.getConfig ?? getTelegramConfig)();
  const openMessageUrl = config.adminAppUrl
    ? buildAdminMessageUrl(config.adminAppUrl, payload.id)
    : null;

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
  const openOrderUrl = config.adminAppUrl
    ? buildAdminOrderUrl(config.adminAppUrl, payload.orderId)
    : null;

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

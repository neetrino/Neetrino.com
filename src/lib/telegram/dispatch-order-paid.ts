import { logger } from '../logger';

import { notifyOrderPaid } from './telegram-service';
import type { OrderPaidNotificationPayload } from './types';

/**
 * Fire-and-isolate Telegram notifications after an order payment becomes PAID.
 * Never throws — payment must remain PAID even when Telegram fails.
 */
export async function dispatchOrderPaidNotification(
  payload: OrderPaidNotificationPayload,
): Promise<void> {
  try {
    await notifyOrderPaid(payload);
  } catch (error) {
    logger.error('Telegram order-paid notification unexpected failure', {
      orderId: payload.orderId,
      error,
    });
  }
}

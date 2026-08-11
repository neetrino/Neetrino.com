import { logger } from '../logger';

import { notifyNewMessage } from './telegram-service';
import type { NewMessageNotificationPayload } from './types';

/**
 * Fire-and-isolate Telegram notifications after a contact message is persisted.
 * Never throws — message creation must remain successful even when Telegram fails.
 */
export async function dispatchMessageCreatedNotification(
  payload: NewMessageNotificationPayload,
): Promise<void> {
  try {
    await notifyNewMessage(payload);
  } catch (error) {
    logger.error('Telegram notification unexpected failure', {
      messageId: payload.id,
      error,
    });
  }
}

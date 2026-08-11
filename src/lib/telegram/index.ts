export { getTelegramConfig } from './config';
export { dispatchMessageCreatedNotification } from './dispatch-message-created';
export { dispatchOrderPaidNotification } from './dispatch-order-paid';
export { getRecipients, notifyNewMessage, notifyOrderPaid } from './telegram-service';
export type {
  NewMessageNotificationPayload,
  OrderPaidNotificationPayload,
  TelegramDeliverySummary,
} from './types';

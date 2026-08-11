import { formatAmdAmount } from '@/lib/payments/format-money';

import { escapeTelegramHtml } from './html-escape';
import type { BuiltTelegramNotification, OrderPaidNotificationPayload, TelegramInlineKeyboard } from './types';

export const ORDER_PAID_MAX_VISIBLE_ITEMS = 10;

function formatPaidAt(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
}

function formatPaymentMethod(provider: string): string {
  const normalized = provider.trim().toUpperCase();
  if (normalized === 'ARCA') {
    return 'Card (Arca)';
  }

  return provider.trim() || 'Unknown';
}

function formatOrderItems(payload: OrderPaidNotificationPayload): string[] {
  const visible = payload.items.slice(0, ORDER_PAID_MAX_VISIBLE_ITEMS);
  const hiddenCount = Math.max(0, payload.items.length - visible.length);

  const lines = visible.map((item) => {
    const quantity = item.quantity > 0 ? item.quantity : 1;
    const price = item.unitAmountAmd != null
      ? ` — ${formatAmdAmount(item.unitAmountAmd, payload.currency)}`
      : '';
    return `• ${quantity} × ${escapeTelegramHtml(item.name)}${escapeTelegramHtml(price)}`;
  });

  if (hiddenCount > 0) {
    lines.push(`…and ${hiddenCount} more item${hiddenCount === 1 ? '' : 's'}`);
  }

  return lines.length > 0 ? lines : ['• (No products)'];
}

/** Builds the HTML body and Open Order button for a paid payment attempt. */
export function buildOrderPaidNotification(
  payload: OrderPaidNotificationPayload,
  openOrderUrl: string | null,
): BuiltTelegramNotification {
  const divider = '──────────────';
  const text = [
    '✅ <b>PAYMENT RECEIVED</b>',
    '',
    `🧾 <b>Order</b> ${escapeTelegramHtml(payload.orderNumber)}`,
    '',
    divider,
    '',
    '🛒 <b>Products</b>',
    ...formatOrderItems(payload),
    '',
    divider,
    '',
    `💰 <b>Total</b>`,
    escapeTelegramHtml(formatAmdAmount(payload.amountAmd, payload.currency)),
    '',
    `💳 <b>Payment</b>`,
    `Paid — ${escapeTelegramHtml(formatPaymentMethod(payload.provider))}`,
    '',
    `📅 <b>Paid</b>`,
    escapeTelegramHtml(formatPaidAt(payload.paidAt)),
  ].join('\n');

  const replyMarkup: TelegramInlineKeyboard | null = openOrderUrl
    ? {
        inline_keyboard: [[{ text: 'Open Order', url: openOrderUrl }]],
      }
    : null;

  return { text, replyMarkup };
}

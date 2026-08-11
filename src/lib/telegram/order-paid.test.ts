import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTelegramChatIds } from './parse-chat-ids';
import { buildOrderPaidNotification, ORDER_PAID_MAX_VISIBLE_ITEMS } from './format-order-paid';
import { notifyOrderPaid } from './telegram-service';
import type { TelegramConfig } from './config';
import type { OrderPaidNotificationPayload, TelegramSendResult } from './types';

function basePayload(
  overrides: Partial<OrderPaidNotificationPayload> = {},
): OrderPaidNotificationPayload {
  return {
    orderId: 'ord_abc123',
    orderNumber: 'NTR-123-ABC123',
    amountAmd: 58900,
    currency: 'AMD',
    provider: 'ARCA',
    paidAt: new Date('2026-08-11T10:32:00.000Z'),
    items: [{ name: 'Website package', quantity: 1, unitAmountAmd: 58900 }],
    ...overrides,
  };
}

function config(overrides: Partial<TelegramConfig> = {}): TelegramConfig {
  return {
    enabled: true,
    botToken: 'test-bot-token',
    chatIds: ['7910562238'],
    adminAppUrl: 'https://example.com/admin',
    ...overrides,
  };
}

test('PENDING → PAID style notifyOrderPaid sends once per recipient', async () => {
  const calls: string[] = [];
  const summary = await notifyOrderPaid(basePayload(), {
    getConfig: () => config({ chatIds: ['7910562238', '-1001'] }),
    sendMessage: async ({ chatId }) => {
      calls.push(chatId);
      return { ok: true, chatId };
    },
  });

  assert.deepEqual(calls, ['7910562238', '-1001']);
  assert.deepEqual(summary, { messageId: 'ord_abc123', total: 2, sent: 2, failed: 0 });
});

test('Telegram failure still returns summary and does not throw', async () => {
  const summary = await notifyOrderPaid(basePayload(), {
    getConfig: () => config(),
    sendMessage: async ({ chatId }): Promise<TelegramSendResult> => ({
      ok: false,
      chatId,
      statusCode: 500,
      errorMessage: 'Telegram down',
    }),
  });

  assert.equal(summary.sent, 0);
  assert.equal(summary.failed, 1);
});

test('multiple recipients receive the same order notification', async () => {
  const calls: string[] = [];
  const recipients = ['7910562238', '123456', '-1009876543210'];

  await notifyOrderPaid(basePayload(), {
    getConfig: () => config({ chatIds: recipients }),
    sendMessage: async ({ chatId, text, replyMarkup }) => {
      calls.push(chatId);
      assert.match(text, /PAYMENT RECEIVED/);
      assert.match(text, /NTR-123-ABC123/);
      assert.equal(replyMarkup?.inline_keyboard[0]?.[0]?.text, 'Open Order');
      assert.match(
        replyMarkup?.inline_keyboard[0]?.[0]?.url ?? '',
        /\/orders\?orderId=ord_abc123$/,
      );
      return { ok: true, chatId };
    },
  });

  assert.deepEqual(calls, recipients);
});

test('one recipient failure does not block others for order-paid', async () => {
  const calls: string[] = [];
  const summary = await notifyOrderPaid(basePayload(), {
    getConfig: () => config({ chatIds: ['A', 'B', 'C'] }),
    sendMessage: async ({ chatId }): Promise<TelegramSendResult> => {
      calls.push(chatId);
      if (chatId === 'B') {
        return { ok: false, chatId, statusCode: 403, errorMessage: 'Forbidden' };
      }
      return { ok: true, chatId };
    },
  });

  assert.deepEqual(calls, ['A', 'B', 'C']);
  assert.deepEqual(summary, { messageId: 'ord_abc123', total: 3, sent: 2, failed: 1 });
});

test('duplicate chat IDs resolve to one order-paid send', async () => {
  const calls: string[] = [];

  await notifyOrderPaid(basePayload(), {
    getConfig: () =>
      config({
        chatIds: parseTelegramChatIds('7910562238,7910562238'),
      }),
    sendMessage: async ({ chatId }) => {
      calls.push(chatId);
      return { ok: true, chatId };
    },
  });

  assert.deepEqual(calls, ['7910562238']);
});

test('large order items are truncated within Telegram limits', () => {
  const items = Array.from({ length: 50 }, (_, index) => ({
    name: `Product ${index + 1}`,
    quantity: 1,
    unitAmountAmd: 1000,
  }));

  const notification = buildOrderPaidNotification(
    basePayload({ items, amountAmd: 50_000 }),
    'https://example.com/admin/orders?orderId=ord_abc123',
  );

  assert.ok(notification.text.length < 4096);
  assert.match(notification.text, new RegExp(`Product ${ORDER_PAID_MAX_VISIBLE_ITEMS}`));
  assert.doesNotMatch(notification.text, /Product 11/);
  assert.match(notification.text, /…and 40 more items/);
  assert.equal(notification.replyMarkup?.inline_keyboard[0]?.[0]?.text, 'Open Order');
});

test('disabled notifications skip order-paid Telegram API calls', async () => {
  let sendCalls = 0;
  const summary = await notifyOrderPaid(basePayload(), {
    getConfig: () => config({ enabled: false }),
    sendMessage: async ({ chatId }) => {
      sendCalls += 1;
      return { ok: true, chatId };
    },
  });

  assert.equal(sendCalls, 0);
  assert.equal(summary.total, 0);
});

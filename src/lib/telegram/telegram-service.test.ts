import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTelegramChatIds } from './parse-chat-ids';
import { notifyNewMessage } from './telegram-service';
import type { TelegramConfig } from './config';
import type { NewMessageNotificationPayload, TelegramSendResult } from './types';

function basePayload(): NewMessageNotificationPayload {
  return {
    id: 'msg_abc123',
    name: 'Arman Petrosyan',
    phone: '+374 XX XX XX XX',
    email: '',
    message: 'Hello, I would like to discuss a new project.',
    projectType: 'website',
    projectGoal: 'leads',
    budget: '10to25k',
    timeline: '1to3months',
    createdAt: new Date('2026-08-11T10:15:00.000Z'),
    source: 'Website',
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

test('parseTelegramChatIds trims, drops empties, and deduplicates', () => {
  assert.deepEqual(parseTelegramChatIds('7910562238, 7910562238, -100123'), [
    '7910562238',
    '-100123',
  ]);
  assert.deepEqual(parseTelegramChatIds(''), []);
  assert.deepEqual(parseTelegramChatIds(undefined), []);
});

test('single recipient triggers one Telegram send', async () => {
  const calls: string[] = [];

  const summary = await notifyNewMessage(basePayload(), {
    getConfig: () => config({ chatIds: ['7910562238'] }),
    sendMessage: async ({ chatId }) => {
      calls.push(chatId);
      return { ok: true, chatId };
    },
  });

  assert.equal(calls.length, 1);
  assert.deepEqual(calls, ['7910562238']);
  assert.deepEqual(summary, { messageId: 'msg_abc123', total: 1, sent: 1, failed: 0 });
});

test('multiple recipients trigger one send each (private + group)', async () => {
  const calls: string[] = [];
  const recipients = ['7910562238', '123456', '-1009876543210'];

  const summary = await notifyNewMessage(basePayload(), {
    getConfig: () => config({ chatIds: recipients }),
    sendMessage: async ({ chatId }) => {
      calls.push(chatId);
      return { ok: true, chatId };
    },
  });

  assert.equal(calls.length, 3);
  assert.deepEqual(calls, recipients);
  assert.equal(summary.sent, 3);
  assert.equal(summary.failed, 0);
});

test('duplicate chat IDs in config resolve to one API call', async () => {
  const calls: string[] = [];

  await notifyNewMessage(basePayload(), {
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

test('one recipient failure does not block other recipients', async () => {
  const calls: string[] = [];

  const summary = await notifyNewMessage(basePayload(), {
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
  assert.deepEqual(summary, { messageId: 'msg_abc123', total: 3, sent: 2, failed: 1 });
});

test('empty recipient list skips Telegram without throwing', async () => {
  let sendCalls = 0;

  const summary = await notifyNewMessage(basePayload(), {
    getConfig: () => config({ chatIds: [] }),
    sendMessage: async ({ chatId }) => {
      sendCalls += 1;
      return { ok: true, chatId };
    },
  });

  assert.equal(sendCalls, 0);
  assert.deepEqual(summary, { messageId: 'msg_abc123', total: 0, sent: 0, failed: 0 });
});

test('disabled notifications make no Telegram API calls', async () => {
  let sendCalls = 0;

  const summary = await notifyNewMessage(basePayload(), {
    getConfig: () => config({ enabled: false, chatIds: ['7910562238', '-1001'] }),
    sendMessage: async ({ chatId }) => {
      sendCalls += 1;
      return { ok: true, chatId };
    },
  });

  assert.equal(sendCalls, 0);
  assert.equal(summary.total, 0);
});

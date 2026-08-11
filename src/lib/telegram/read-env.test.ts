import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTelegramChatIds } from './parse-chat-ids';
import { readEnvFlag, readEnvValue, toTelegramButtonUrl } from './read-env';

test('readEnvValue strips wrapping quotes from Vercel-style values', () => {
  process.env.TELEGRAM_BOT_TOKEN_TEST = '"abc:token"';
  assert.equal(readEnvValue('TELEGRAM_BOT_TOKEN_TEST'), 'abc:token');
  delete process.env.TELEGRAM_BOT_TOKEN_TEST;
});

test('readEnvFlag accepts true/1/yes and quoted true', () => {
  process.env.TELEGRAM_FLAG_TEST = '"true"';
  assert.equal(readEnvFlag('TELEGRAM_FLAG_TEST'), true);
  process.env.TELEGRAM_FLAG_TEST = '1';
  assert.equal(readEnvFlag('TELEGRAM_FLAG_TEST'), true);
  process.env.TELEGRAM_FLAG_TEST = 'false';
  assert.equal(readEnvFlag('TELEGRAM_FLAG_TEST'), false);
  delete process.env.TELEGRAM_FLAG_TEST;
});

test('parseTelegramChatIds strips quoted list and quoted members', () => {
  assert.deepEqual(parseTelegramChatIds('"7910562238,622331404"'), [
    '7910562238',
    '622331404',
  ]);
  assert.deepEqual(parseTelegramChatIds('"7910562238","622331404"'), [
    '7910562238',
    '622331404',
  ]);
});

test('toTelegramButtonUrl rejects quoted/invalid URLs that break Telegram sendMessage', () => {
  assert.equal(toTelegramButtonUrl('"https://neetrino.com/admin/messages?messageId=1"'), null);
  assert.equal(
    toTelegramButtonUrl('https://neetrino.com/admin/messages?messageId=1'),
    'https://neetrino.com/admin/messages?messageId=1',
  );
  assert.equal(toTelegramButtonUrl('neetrino.com/admin'), null);
});

import { logger } from '../logger';

import { resolveAdminAppUrl } from './admin-url';
import { parseTelegramChatIds } from './parse-chat-ids';
import { readEnvFlag, readEnvValue } from './read-env';

export type TelegramConfig = {
  enabled: boolean;
  botToken: string | null;
  chatIds: string[];
  adminAppUrl: string | null;
};

/**
 * Loads Telegram notification settings from environment variables.
 * Never logs the bot token.
 */
export function getTelegramConfig(): TelegramConfig {
  const enabled = readEnvFlag('TELEGRAM_NOTIFICATIONS_ENABLED');
  const botToken = readEnvValue('TELEGRAM_BOT_TOKEN') ?? null;
  const chatIds = parseTelegramChatIds(readEnvValue('TELEGRAM_CHAT_IDS'));
  const adminAppUrl = resolveAdminAppUrl();

  if (enabled && !botToken) {
    logger.error('Telegram notifications enabled but TELEGRAM_BOT_TOKEN is missing.');
  }

  if (enabled && chatIds.length === 0) {
    logger.warn('Telegram notifications enabled but TELEGRAM_CHAT_IDS is empty.');
  }

  if (enabled && !adminAppUrl) {
    logger.warn('Telegram notifications enabled but ADMIN_APP_URL is missing.');
  }

  return {
    enabled,
    botToken,
    chatIds,
    adminAppUrl,
  };
}

import { logger } from '../logger';

import { getTelegramConfig, type TelegramConfig } from './config';
import { sendTelegramMessage } from './send-message';
import type {
  BuiltTelegramNotification,
  TelegramDeliverySummary,
  TelegramSendResult,
} from './types';

export type TelegramTransportDeps = {
  getConfig?: () => TelegramConfig;
  sendMessage?: typeof sendTelegramMessage;
};

export type TelegramFanOutContext = {
  event: 'new_message' | 'order_paid';
  /** Correlation id used in logs (message id or order/attempt id). */
  subjectId: string;
  subjectKey: 'messageId' | 'orderId';
};

function resolveDeps(deps?: TelegramTransportDeps): Required<TelegramTransportDeps> {
  return {
    getConfig: deps?.getConfig ?? getTelegramConfig,
    sendMessage: deps?.sendMessage ?? sendTelegramMessage,
  };
}

/**
 * Resolves active Telegram recipients.
 * Currently ENV-based; swap this method later for a DB-backed recipient store.
 */
export function getRecipients(config: TelegramConfig = getTelegramConfig()): string[] {
  return config.chatIds;
}

function emptySummary(subjectId: string): TelegramDeliverySummary {
  return {
    messageId: subjectId,
    total: 0,
    sent: 0,
    failed: 0,
  };
}

function logDeliveryResult(context: TelegramFanOutContext, result: TelegramSendResult): void {
  const base = {
    [context.subjectKey]: context.subjectId,
    chatId: result.chatId,
    event: context.event,
  };

  if (result.ok) {
    logger.info(`Telegram ${context.event} notification sent`, base);
    return;
  }

  logger.error(`Telegram ${context.event} notification failed`, {
    ...base,
    statusCode: result.statusCode,
    errorMessage: result.errorMessage,
  });
}

function logDeliverySummary(context: TelegramFanOutContext, summary: TelegramDeliverySummary): void {
  logger.info(`Telegram ${context.event} notification completed`, {
    [context.subjectKey]: context.subjectId,
    event: context.event,
    total: summary.total,
    sent: summary.sent,
    failed: summary.failed,
  });
}

/**
 * Fans out one built notification to all configured Telegram recipients.
 * Uses Promise.allSettled so one recipient failure cannot block the others.
 */
export async function fanOutTelegramNotification(
  context: TelegramFanOutContext,
  notification: BuiltTelegramNotification,
  deps?: TelegramTransportDeps,
): Promise<TelegramDeliverySummary> {
  const { getConfig, sendMessage } = resolveDeps(deps);
  const config = getConfig();
  const summaryBase = emptySummary(context.subjectId);

  if (!config.enabled) {
    logger.info(`Telegram ${context.event} notification skipped: notifications disabled`, {
      [context.subjectKey]: context.subjectId,
    });
    return summaryBase;
  }

  if (!config.botToken) {
    logger.warn(`Telegram ${context.event} notification skipped: bot token missing`, {
      [context.subjectKey]: context.subjectId,
    });
    return summaryBase;
  }

  const recipients = getRecipients(config);
  if (recipients.length === 0) {
    logger.warn(`Telegram ${context.event} notification skipped: no recipients configured`, {
      [context.subjectKey]: context.subjectId,
    });
    return summaryBase;
  }

  const botToken = config.botToken;
  const settled = await Promise.allSettled(
    recipients.map((chatId) =>
      sendMessage({
        botToken,
        chatId,
        text: notification.text,
        replyMarkup: notification.replyMarkup,
      }),
    ),
  );

  let sent = 0;
  let failed = 0;

  for (let index = 0; index < settled.length; index += 1) {
    const outcome = settled[index];
    const chatId = recipients[index] ?? 'unknown';

    if (outcome.status === 'fulfilled') {
      logDeliveryResult(context, outcome.value);
      if (outcome.value.ok) {
        sent += 1;
      } else {
        failed += 1;
      }
      continue;
    }

    failed += 1;
    logger.error(`Telegram ${context.event} notification failed`, {
      [context.subjectKey]: context.subjectId,
      chatId,
      event: context.event,
      errorMessage:
        outcome.reason instanceof Error ? outcome.reason.message : 'Unexpected send rejection',
    });
  }

  const summary: TelegramDeliverySummary = {
    messageId: context.subjectId,
    total: recipients.length,
    sent,
    failed,
  };

  logDeliverySummary(context, summary);
  return summary;
}

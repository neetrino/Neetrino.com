import { contactMessages } from '@/app/_components/contact-messages';

import { escapeTelegramHtml } from './html-escape';
import type { BuiltTelegramNotification, NewMessageNotificationPayload, TelegramInlineKeyboard } from './types';

const quoteOptions = contactMessages.quote.questions;

function formatReceivedAt(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(value);
}

function resolveOptionLabel(
  question: 'projectType' | 'projectGoal' | 'budget' | 'timeline',
  optionId: string,
): string {
  if (!optionId) {
    return '';
  }

  const options = quoteOptions[question].options as Record<string, string>;
  return options[optionId] ?? optionId;
}

function buildQuoteDetails(payload: NewMessageNotificationPayload): string[] {
  const freeText = payload.message.trim();
  if (freeText) {
    return ['💬 <b>Message</b>', escapeTelegramHtml(freeText)];
  }

  const rows: Array<{ emoji: string; label: string; value: string }> = [
    {
      emoji: '🧩',
      label: 'Project',
      value: resolveOptionLabel('projectType', payload.projectType),
    },
    {
      emoji: '🎯',
      label: 'Goal',
      value: resolveOptionLabel('projectGoal', payload.projectGoal),
    },
    {
      emoji: '💰',
      label: 'Budget',
      value: resolveOptionLabel('budget', payload.budget),
    },
    {
      emoji: '⏱',
      label: 'Timeline',
      value: resolveOptionLabel('timeline', payload.timeline),
    },
  ];

  const filled = rows.filter((row) => row.value);
  if (filled.length === 0) {
    return ['💬 <b>Message</b>', '<i>No details provided</i>'];
  }

  return filled.flatMap((row, index) => {
    const block = [`${row.emoji} <b>${row.label}</b>`, escapeTelegramHtml(row.value)];
    return index < filled.length - 1 ? [...block, ''] : block;
  });
}

/** Builds the HTML notification body and optional Open Message button. */
export function buildNewMessageNotification(
  payload: NewMessageNotificationPayload,
  openMessageUrl: string | null,
): BuiltTelegramNotification {
  const source = payload.source?.trim() || 'Website';
  const phone = payload.phone.trim() || 'N/A';
  const divider = '──────────────';

  const text = [
    '✨ <b>Get a Quote</b>',
    '',
    `👤 <b>${escapeTelegramHtml(payload.name)}</b>`,
    `📞 ${escapeTelegramHtml(phone)}`,
    `🌐 ${escapeTelegramHtml(source)}`,
    '',
    divider,
    '',
    ...buildQuoteDetails(payload),
    '',
    divider,
    '',
    `📅 ${escapeTelegramHtml(formatReceivedAt(payload.createdAt))}`,
  ].join('\n');

  const replyMarkup: TelegramInlineKeyboard | null = openMessageUrl
    ? {
        inline_keyboard: [[{ text: 'Open Quote', url: openMessageUrl }]],
      }
    : null;

  return { text, replyMarkup };
}

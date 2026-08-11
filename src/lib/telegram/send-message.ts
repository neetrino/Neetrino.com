import type { TelegramInlineKeyboard, TelegramSendResult } from './types';

const TELEGRAM_API_TIMEOUT_MS = 10_000;

type SendTelegramMessageInput = {
  botToken: string;
  chatId: string;
  text: string;
  replyMarkup: TelegramInlineKeyboard | null;
  fetchImpl?: typeof fetch;
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
};

/**
 * Sends one Telegram message to a single chat ID.
 * Chat IDs stay strings (private users and groups/supergroups).
 */
export async function sendTelegramMessage(input: SendTelegramMessageInput): Promise<TelegramSendResult> {
  const { botToken, chatId, text, replyMarkup } = input;
  const fetchImpl = input.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TELEGRAM_API_TIMEOUT_MS);

  try {
    const response = await fetchImpl(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      }),
    });

    let description = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as TelegramApiResponse;
      if (typeof body.description === 'string' && body.description.trim()) {
        description = body.description;
      }
      if (response.ok && body.ok === true) {
        return { ok: true, chatId };
      }
    } catch {
      if (response.ok) {
        return { ok: true, chatId };
      }
    }

    return {
      ok: false,
      chatId,
      statusCode: response.status,
      errorMessage: description,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Telegram request timed out'
          : error.message
        : 'Unknown Telegram send failure';

    return {
      ok: false,
      chatId,
      errorMessage,
    };
  } finally {
    clearTimeout(timeout);
  }
}

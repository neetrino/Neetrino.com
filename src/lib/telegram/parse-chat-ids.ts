/**
 * Parses a comma-separated Telegram chat ID list into unique trimmed strings.
 * Keeps IDs as strings so private chats and groups/supergroups both work.
 */
export function parseTelegramChatIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  const uniqueIds: string[] = [];
  const seen = new Set<string>();

  for (const part of raw.split(',')) {
    const chatId = part.trim();
    if (!chatId || seen.has(chatId)) {
      continue;
    }

    seen.add(chatId);
    uniqueIds.push(chatId);
  }

  return uniqueIds;
}

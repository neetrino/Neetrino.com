/**
 * Parses a comma-separated Telegram chat ID list into unique trimmed strings.
 * Keeps IDs as strings so private chats and groups/supergroups both work.
 */
export function parseTelegramChatIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  let normalized = raw.trim();
  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  const uniqueIds: string[] = [];
  const seen = new Set<string>();

  for (const part of normalized.split(',')) {
    const chatId = part.trim().replace(/^['"]+|['"]+$/g, '').trim();

    if (!chatId || seen.has(chatId)) {
      continue;
    }

    seen.add(chatId);
    uniqueIds.push(chatId);
  }

  return uniqueIds;
}

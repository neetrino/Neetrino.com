export type BlogContentHeadingLevel = 2 | 3;

export type BlogContentBlock =
  | { type: 'heading'; level: BlogContentHeadingLevel; text: string }
  | { type: 'paragraph'; text: string };

const HTML_BLOCK_PATTERN = /<(h[1-6]|p)(?:\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi;
const LOOKS_LIKE_HTML_PATTERN = /<\/?(?:h[1-6]|p|ul|ol|li|br|strong|em|b|i)\b/i;

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    );
}

/** Removes markup so stored HTML is not counted as visible words. */
export function stripBlogMarkup(value: string): string {
  return decodeHtmlEntities(
    value
      .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function headingLevelForTag(tag: string): BlogContentHeadingLevel {
  return tag === 'h1' || tag === 'h2' ? 2 : 3;
}

function pushTextBlock(
  blocks: BlogContentBlock[],
  type: BlogContentBlock['type'],
  rawText: string,
  level?: BlogContentHeadingLevel,
): void {
  const text = stripBlogMarkup(rawText);
  if (!text) {
    return;
  }

  if (type === 'heading' && level) {
    blocks.push({ type, level, text });
    return;
  }

  blocks.push({ type: 'paragraph', text });
}

function parsePlainTextBlocks(content: string): BlogContentBlock[] {
  return content
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => ({ type: 'paragraph' as const, text }));
}

function parseHtmlBlocks(content: string): BlogContentBlock[] {
  const blocks: BlogContentBlock[] = [];
  let cursor = 0;

  for (const match of content.matchAll(new RegExp(HTML_BLOCK_PATTERN))) {
    const fullMatch = match[0];
    const tag = match[1];
    const inner = match[2];
    if (!tag || inner === undefined) {
      continue;
    }

    const index = match.index ?? 0;
    const normalizedTag = tag.toLowerCase();

    pushTextBlock(blocks, 'paragraph', content.slice(cursor, index));

    if (normalizedTag === 'p') {
      pushTextBlock(blocks, 'paragraph', inner);
    } else {
      pushTextBlock(blocks, 'heading', inner, headingLevelForTag(normalizedTag));
    }

    cursor = index + fullMatch.length;
  }

  pushTextBlock(blocks, 'paragraph', content.slice(cursor));
  return blocks;
}

export type BlogContentSection = {
  heading: Extract<BlogContentBlock, { type: 'heading' }> | null;
  paragraphs: Array<Extract<BlogContentBlock, { type: 'paragraph' }>>;
};

/** Groups heading + following paragraphs so the article can render as paired columns. */
export function groupBlogContentSections(blocks: BlogContentBlock[]): BlogContentSection[] {
  const sections: BlogContentSection[] = [];
  let current: BlogContentSection = { heading: null, paragraphs: [] };

  for (const block of blocks) {
    if (block.type === 'heading') {
      if (current.heading || current.paragraphs.length > 0) {
        sections.push(current);
      }
      current = { heading: block, paragraphs: [] };
      continue;
    }

    current.paragraphs.push(block);
  }

  if (current.heading || current.paragraphs.length > 0) {
    sections.push(current);
  }

  return sections;
}

/** Turns stored blog HTML or plain text into safe heading and paragraph blocks. */
export function parseBlogContent(content: string): BlogContentBlock[] {
  const trimmed = content.trim();
  if (!trimmed) {
    return [];
  }

  if (!LOOKS_LIKE_HTML_PATTERN.test(trimmed)) {
    return parsePlainTextBlocks(trimmed);
  }

  return parseHtmlBlocks(trimmed);
}

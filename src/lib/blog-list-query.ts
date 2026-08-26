export const BLOG_PAGE_SIZE = 8;

const BLOG_LIST_MAX_OFFSET = 10_000;

export type BlogListQuery = {
  offset: number;
  limit: number;
};

/** Parses and caps public blog listing pagination query params. */
export function parseBlogListQuery(searchParams: URLSearchParams): BlogListQuery | { error: string } {
  const offset = parseCount(searchParams.get('offset'), 0);
  const limit = parseCount(searchParams.get('limit'), BLOG_PAGE_SIZE);

  if (offset === null || offset > BLOG_LIST_MAX_OFFSET) {
    return { error: 'Invalid offset' };
  }

  if (limit === null || limit < 1 || limit > BLOG_PAGE_SIZE) {
    return { error: 'Invalid limit' };
  }

  return { offset, limit };
}

function parseCount(value: string | null, fallback: number): number | null {
  if (value === null || value === '') {
    return fallback;
  }

  if (!/^\d+$/.test(value)) {
    return null;
  }

  return Number.parseInt(value, 10);
}

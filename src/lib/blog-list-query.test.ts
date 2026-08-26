import assert from 'node:assert/strict';
import test from 'node:test';

import { parseBlogListQuery } from './blog-list-query';

test('parseBlogListQuery defaults offset to 0 and limit to page size', () => {
  const parsed = parseBlogListQuery(new URLSearchParams());

  assert.deepEqual(parsed, { offset: 0, limit: 8 });
});

test('parseBlogListQuery accepts a valid page window', () => {
  const parsed = parseBlogListQuery(new URLSearchParams('offset=8&limit=8'));

  assert.deepEqual(parsed, { offset: 8, limit: 8 });
});

test('parseBlogListQuery rejects oversized or non-numeric values', () => {
  assert.deepEqual(parseBlogListQuery(new URLSearchParams('offset=-1')), { error: 'Invalid offset' });
  assert.deepEqual(parseBlogListQuery(new URLSearchParams('limit=9')), { error: 'Invalid limit' });
  assert.deepEqual(parseBlogListQuery(new URLSearchParams('offset=abc')), { error: 'Invalid offset' });
});

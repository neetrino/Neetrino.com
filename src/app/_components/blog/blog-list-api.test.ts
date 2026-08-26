import assert from 'node:assert/strict';
import test from 'node:test';

import { mergeBlogListItems, parseBlogListPage } from './blog-list-api';
import type { BlogArticleListItem } from './blog-types';

function listItem(id: string): BlogArticleListItem {
  return {
    id,
    coverImageUrl: null,
    publishedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    categoryId: 'insights',
    contentTypeId: 'article',
    translations: {
      en: {
        title: id,
        slug: id,
        excerpt: id,
        imageAlt: null,
      },
    },
  };
}

test('parseBlogListPage accepts a valid listing envelope', () => {
  const item = listItem('post-1');
  const parsed = parseBlogListPage({
    data: [item],
    meta: { offset: 8, limit: 8, total: 16, hasMore: false },
  });

  assert.deepEqual(parsed, {
    data: [item],
    meta: { offset: 8, limit: 8, total: 16, hasMore: false },
  });
});

test('parseBlogListPage rejects malformed payloads', () => {
  assert.equal(parseBlogListPage({ data: [], meta: { offset: -1, limit: 8, total: 0, hasMore: false } }), null);
  assert.equal(parseBlogListPage({ data: [{ id: 'x' }], meta: { offset: 0, limit: 8, total: 1, hasMore: false } }), null);
});

test('mergeBlogListItems appends unseen ids only', () => {
  const first = listItem('a');
  const second = listItem('b');
  const current = [first];

  assert.deepEqual(mergeBlogListItems(current, [first, second]), [first, second]);
  assert.equal(mergeBlogListItems(current, [first]), current);
});

import assert from 'node:assert/strict';
import test from 'node:test';

import { pickRelatedArticles } from './blog-resolve';
import type { BlogArticleListItem } from './blog-types';

function listItem(
  id: string,
  categoryId: BlogArticleListItem['categoryId'],
): BlogArticleListItem {
  return {
    id,
    coverImageUrl: null,
    publishedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    categoryId,
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

test('pickRelatedArticles prefers the same category and excludes the current post', () => {
  const current = listItem('current', 'product');
  const related = pickRelatedArticles(
    [
      current,
      listItem('design-a', 'design'),
      listItem('product-a', 'product'),
      listItem('product-b', 'product'),
      listItem('engineering-a', 'engineering'),
    ],
    current.id,
    current.categoryId,
    3,
  );

  assert.deepEqual(
    related.map((item) => item.id),
    ['product-a', 'product-b', 'design-a'],
  );
});

test('pickRelatedArticles fills from other categories when needed', () => {
  const current = listItem('current', 'company');
  const related = pickRelatedArticles(
    [current, listItem('insights-a', 'insights')],
    current.id,
    current.categoryId,
  );

  assert.deepEqual(
    related.map((item) => item.id),
    ['insights-a'],
  );
});

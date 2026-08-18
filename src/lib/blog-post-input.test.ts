import assert from 'node:assert/strict';
import test from 'node:test';

import { createBlogSlug, parseBlogPostInput } from './blog-post-input';

const validTranslation = {
  locale: 'en',
  title: 'How we ship websites',
  excerpt: 'A short summary.',
  content: 'Full article body.',
};

test('parseBlogPostInput accepts a valid English draft', () => {
  const parsed = parseBlogPostInput({
    translations: [validTranslation],
  });

  assert.ok(!('error' in parsed));
  if ('error' in parsed) {
    return;
  }

  assert.equal(parsed.status, 'DRAFT');
  assert.equal(parsed.translations[0]?.slug, 'how-we-ship-websites');
  assert.equal(parsed.translations[0]?.title, validTranslation.title);
});

test('parseBlogPostInput requires English and complete optional locales', () => {
  const missingEnglish = parseBlogPostInput({
    translations: [{ locale: 'hy', title: 'Վերնագիր', excerpt: 'Հատված', content: 'Բովանդակություն' }],
  });
  const incompleteHy = parseBlogPostInput({
    translations: [validTranslation, { locale: 'hy', title: 'Վերնագիր' }],
  });

  assert.deepEqual(missingEnglish, { error: 'English title, excerpt, and content are required.' });
  assert.deepEqual(incompleteHy, {
    error: 'Հայերեն translation requires title, excerpt, and content.',
  });
});

test('parseBlogPostInput rejects invalid status, date, and cover URL', () => {
  assert.deepEqual(parseBlogPostInput({ status: 'LIVE', translations: [validTranslation] }), {
    error: 'status must be DRAFT or PUBLISHED.',
  });
  assert.deepEqual(
    parseBlogPostInput({ publishedAt: 'not-a-date', translations: [validTranslation] }),
    { error: 'publishedAt must be a valid ISO date.' },
  );
  assert.deepEqual(
    parseBlogPostInput({ coverImageUrl: 'ftp://files.example/cover.jpg', translations: [validTranslation] }),
    { error: 'coverImageUrl must be an http(s) URL.' },
  );
});

test('createBlogSlug falls back when the title has no latin characters', () => {
  const slug = createBlogSlug('Վերնագիր', 'hy');

  assert.match(slug, /^post-hy-\d+$/);
});

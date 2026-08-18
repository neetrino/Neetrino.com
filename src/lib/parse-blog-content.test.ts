import assert from 'node:assert/strict';
import test from 'node:test';

import { groupBlogContentSections, parseBlogContent, stripBlogMarkup } from './parse-blog-content';

test('parseBlogContent keeps plain-text paragraphs split by blank lines', () => {
  const blocks = parseBlogContent(
    'Smaller releases reduce risk.\n\nStart with one user outcome.',
  );

  assert.deepEqual(blocks, [
    { type: 'paragraph', text: 'Smaller releases reduce risk.' },
    { type: 'paragraph', text: 'Start with one user outcome.' },
  ]);
});

test('parseBlogContent renders stored heading and paragraph tags as blocks', () => {
  const blocks = parseBlogContent(
    '<h2>Why businesses need CRM</h2><p>Without a shared system, context stays scattered.</p>',
  );

  assert.deepEqual(blocks, [
    { type: 'heading', level: 2, text: 'Why businesses need CRM' },
    { type: 'paragraph', text: 'Without a shared system, context stays scattered.' },
  ]);
});

test('parseBlogContent strips disallowed markup and keeps visible text', () => {
  const blocks = parseBlogContent(
    '<h2>Business impact</h2><p>CRM clarifies ownership <script>alert(1)</script>and forecasts.</p>',
  );

  assert.deepEqual(blocks, [
    { type: 'heading', level: 2, text: 'Business impact' },
    { type: 'paragraph', text: 'CRM clarifies ownership and forecasts.' },
  ]);
});

test('groupBlogContentSections pairs each heading with the paragraphs that follow it', () => {
  const sections = groupBlogContentSections([
    { type: 'heading', level: 2, text: 'Why CRM' },
    { type: 'paragraph', text: 'It keeps context in one place.' },
    { type: 'heading', level: 2, text: 'How to begin' },
    { type: 'paragraph', text: 'Start with process.' },
  ]);

  assert.deepEqual(sections, [
    {
      heading: { type: 'heading', level: 2, text: 'Why CRM' },
      paragraphs: [{ type: 'paragraph', text: 'It keeps context in one place.' }],
    },
    {
      heading: { type: 'heading', level: 2, text: 'How to begin' },
      paragraphs: [{ type: 'paragraph', text: 'Start with process.' }],
    },
  ]);
});

test('stripBlogMarkup removes tags so reading time uses visible words only', () => {
  assert.equal(stripBlogMarkup('<h2>How to begin</h2><p>Start with process.</p>'), 'How to begin Start with process.');
});

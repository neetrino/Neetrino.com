import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_PORTFOLIO_VIDEO_BYTES,
  resolvePortfolioUploadContentType,
  validatePortfolioMediaDescriptor,
} from './portfolio-media';

test('portfolio videos may be up to 300MB', () => {
  assert.equal(MAX_PORTFOLIO_VIDEO_BYTES, 300 * 1024 * 1024);
  assert.equal(
    validatePortfolioMediaDescriptor({
      fileName: 'showreel.mp4',
      contentType: 'video/mp4',
      sizeBytes: 300 * 1024 * 1024,
    }),
    'video',
  );
});

test('portfolio videos over 300MB are rejected', () => {
  assert.throws(
    () =>
      validatePortfolioMediaDescriptor({
        fileName: 'showreel.mp4',
        contentType: 'video/mp4',
        sizeBytes: 300 * 1024 * 1024 + 1,
      }),
    /must be smaller/,
  );
});

test('empty browser video type is recovered from the filename', () => {
  assert.equal(resolvePortfolioUploadContentType('clip.mov', ''), 'video/quicktime');
  assert.equal(
    validatePortfolioMediaDescriptor({
      fileName: 'clip.mov',
      contentType: '',
      sizeBytes: 12 * 1024 * 1024,
    }),
    'video',
  );
});

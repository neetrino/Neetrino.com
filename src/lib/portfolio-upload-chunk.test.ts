import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PORTFOLIO_UPLOAD_CHUNK_BYTES,
  getExpectedPortfolioChunkBytes,
  getPortfolioChunkCount,
  getPortfolioPartKey,
} from './portfolio-upload-chunk';

test('portfolio chunking stays under the Vercel payload limit', () => {
  assert.equal(PORTFOLIO_UPLOAD_CHUNK_BYTES, 3 * 1024 * 1024);
  assert.equal(getPortfolioChunkCount(6_510_002), 3);
  assert.equal(getExpectedPortfolioChunkBytes(6_510_002, 0), PORTFOLIO_UPLOAD_CHUNK_BYTES);
  assert.equal(getExpectedPortfolioChunkBytes(6_510_002, 2), 6_510_002 - 2 * PORTFOLIO_UPLOAD_CHUNK_BYTES);
  assert.equal(
    getPortfolioPartKey('portfolio/2026/08/11111111-1111-1111-1111-111111111111.webm', 1),
    'portfolio/2026/08/11111111-1111-1111-1111-111111111111.webm.part.1',
  );
});

import assert from 'node:assert/strict';
import test from 'node:test';

import { createPortfolioObjectKey, isPortfolioObjectKey } from './portfolio-object-key';
import { createPortfolioUploadToken, verifyPortfolioUploadToken } from './portfolio-upload-token';

const SECRET = 'n'.repeat(32);

function withSessionSecret(run: () => void): void {
  const previous = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = SECRET;

  try {
    run();
  } finally {
    if (previous === undefined) {
      delete process.env.ADMIN_SESSION_SECRET;
      return;
    }

    process.env.ADMIN_SESSION_SECRET = previous;
  }
}

test('portfolio object keys match the expected prefix and uuid shape', () => {
  const key = createPortfolioObjectKey('video/mp4');

  assert.equal(isPortfolioObjectKey(key), true);
  assert.match(key, /^portfolio\/\d{4}\/\d{2}\/.+\.mp4$/);
  assert.match(createPortfolioObjectKey('image/jpeg'), /\.jpg$/);
  assert.equal(isPortfolioObjectKey('etc/passwd'), false);
  assert.equal(isPortfolioObjectKey(`../${key}`), false);
});

test('portfolio upload tokens round-trip and reject tampering', () => {
  withSessionSecret(() => {
    const claims = {
      key: 'portfolio/2026/08/11111111-1111-1111-1111-111111111111.mp4',
      fileName: 'showreel.mp4',
      contentType: 'video/mp4',
      sizeBytes: 24_000_000,
    };
    const now = Date.now();
    const token = createPortfolioUploadToken(claims, now);

    assert.deepEqual(verifyPortfolioUploadToken(token, now), {
      ...claims,
      exp: now + 30 * 60 * 1000,
    });
    assert.throws(() => verifyPortfolioUploadToken(`${token}x`, now), /invalid/);
    assert.throws(() => verifyPortfolioUploadToken(token, now + 31 * 60 * 1000), /expired/);
  });
});

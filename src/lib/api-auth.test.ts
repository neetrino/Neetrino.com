import assert from 'node:assert/strict';
import test from 'node:test';

import {
  authenticateApiKey,
  authenticateBlogApiRequest,
  createBearerToken,
  isValidApiKey,
  verifyBearerToken,
} from './api-auth';

const VALID_API_KEY = 'n'.repeat(32);

function withApiKey(run: () => Promise<void>): Promise<void> {
  const previous = process.env.API_KEY;
  process.env.API_KEY = VALID_API_KEY;

  return run().finally(() => {
    if (previous === undefined) {
      delete process.env.API_KEY;
      return;
    }

    process.env.API_KEY = previous;
  });
}

test('isValidApiKey accepts the configured key and rejects others', async () => {
  await withApiKey(async () => {
    assert.equal(await isValidApiKey(VALID_API_KEY), true);
    assert.equal(await isValidApiKey('wrong-key-that-is-also-long-enough'), false);
    assert.equal(await isValidApiKey(undefined), false);
  });
});

test('createBearerToken issues a token that verifyBearerToken accepts', async () => {
  await withApiKey(async () => {
    const issued = await createBearerToken();

    assert.equal(issued.tokenType, 'Bearer');
    assert.equal(issued.expiresIn, 3600);
    assert.equal(await verifyBearerToken(issued.token), true);
  });
});

test('verifyBearerToken rejects expired and tampered tokens', async () => {
  await withApiKey(async () => {
    const issued = await createBearerToken(Date.now() - 2 * 60 * 60 * 1000);
    const tampered = `${issued.token.slice(0, -1)}x`;

    assert.equal(await verifyBearerToken(issued.token), false);
    assert.equal(await verifyBearerToken(tampered), false);
    assert.equal(await verifyBearerToken(undefined), false);
  });
});

test('authenticateApiKey and authenticateBlogApiRequest enforce both credentials', async () => {
  await withApiKey(async () => {
    const issued = await createBearerToken();
    const headers = new Headers({
      'x-api-key': VALID_API_KEY,
      authorization: `Bearer ${issued.token}`,
    });

    assert.equal((await authenticateApiKey(headers)).ok, true);
    assert.equal((await authenticateBlogApiRequest(headers)).ok, true);
    assert.equal((await authenticateBlogApiRequest(new Headers({ 'x-api-key': VALID_API_KEY }))).ok, false);
    assert.equal(
      (await authenticateBlogApiRequest(new Headers({ authorization: `Bearer ${issued.token}` }))).ok,
      false,
    );
  });
});

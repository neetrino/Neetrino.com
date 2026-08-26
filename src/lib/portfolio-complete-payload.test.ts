import assert from 'node:assert/strict';
import test from 'node:test';

import { createPortfolioCompletePayload, jsonToPortfolioFormData } from './portfolio-complete-payload';

test('complete payload never includes the media file', () => {
  const formData = new FormData();
  formData.set('title', 'Showreel');
  formData.set('alt', 'Hero video');
  formData.set('assetType', 'ANIMATION_IMAGE');
  formData.set('status', 'ACTIVE');
  formData.set('projectUrl', '');
  formData.set('image', new File([new Uint8Array(8)], 'showreel.mp4', { type: 'video/mp4' }));

  const payload = createPortfolioCompletePayload(formData, {
    key: 'portfolio/2026/08/11111111-1111-1111-1111-111111111111.mp4',
    token: 'signed-token',
    fileName: 'showreel.mp4',
  });

  assert.equal(payload.title, 'Showreel');
  assert.equal(payload.objectKey, 'portfolio/2026/08/11111111-1111-1111-1111-111111111111.mp4');
  assert.equal(payload.fileName, 'showreel.mp4');
  assert.equal('image' in payload, false);
  assert.equal(Object.values(payload).every((value) => typeof value === 'string'), true);
});

test('JSON complete bodies round-trip into FormData without files', () => {
  const formData = jsonToPortfolioFormData({
    title: 'Showreel',
    objectKey: 'portfolio/2026/08/11111111-1111-1111-1111-111111111111.mp4',
    uploadToken: 'signed-token',
    fileName: 'showreel.mp4',
  });

  assert.equal(formData.get('title'), 'Showreel');
  assert.equal(formData.get('objectKey'), 'portfolio/2026/08/11111111-1111-1111-1111-111111111111.mp4');
  assert.equal(formData.get('image'), null);
  assert.throws(() => jsonToPortfolioFormData(['nope']));
});

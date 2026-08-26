import assert from 'node:assert/strict';
import test from 'node:test';

import { PORTFOLIO_DVBS_BANNER_SRC } from '../app/_components/portfolio-constants';
import { resolvePublicPortfolioMedia } from './public-portfolio-media';

test('ANRA uses the uploaded video instead of a static mockup', () => {
  assert.deepEqual(
    resolvePublicPortfolioMedia({
      title: 'ANRA',
      alt: 'Nuclear Regulatory Authority',
      url: 'https://cdn.example.com/anra.mp4',
      contentType: 'video/mp4',
    }),
    {
      image: 'https://cdn.example.com/anra.mp4',
      contentType: 'video/mp4',
    },
  );
});

test('DVBS still uses the designed banner', () => {
  assert.deepEqual(
    resolvePublicPortfolioMedia({
      title: 'Borbor',
      alt: 'DVBS',
      url: 'https://cdn.example.com/borbor.mp4',
      contentType: 'video/mp4',
    }),
    { image: PORTFOLIO_DVBS_BANNER_SRC },
  );
});

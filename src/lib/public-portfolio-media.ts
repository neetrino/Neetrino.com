import { PORTFOLIO_DVBS_BANNER_SRC } from '@/app/_components/portfolio-constants';
import { resolvePortfolioVariant } from '@/app/_components/portfolio-data';

type PublicPortfolioMediaInput = {
  title: string;
  alt: string;
  url: string;
  contentType: string;
};

type PublicPortfolioMedia = {
  image: string;
  contentType?: string;
};

/**
 * Maps a CMS portfolio asset to public card media.
 * DVBS keeps the designed banner; other items use the uploaded file, including video.
 */
export function resolvePublicPortfolioMedia(asset: PublicPortfolioMediaInput): PublicPortfolioMedia {
  if (resolvePortfolioVariant(asset.title, asset.alt) === 'dvbs') {
    return { image: PORTFOLIO_DVBS_BANNER_SRC };
  }

  return { image: asset.url, contentType: asset.contentType };
}

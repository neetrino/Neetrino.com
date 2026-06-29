import { CdnImage as Image } from '@/lib/cdn-image';

import {
  PORTFOLIO_DECOR_BAKE_HEIGHT,
  PORTFOLIO_DECOR_BAKE_SRC,
  PORTFOLIO_DECOR_BAKE_WIDTH,
} from './portfolio-constants';

/** Pre-composited portfolio background — same pixels, no runtime blend modes. */
export function PortfolioBakedBackground(): React.JSX.Element {
  return (
    <div className="portfolio-baked-bg" aria-hidden>
      <Image
        src={PORTFOLIO_DECOR_BAKE_SRC}
        alt=""
        width={PORTFOLIO_DECOR_BAKE_WIDTH}
        height={PORTFOLIO_DECOR_BAKE_HEIGHT}
        priority
        unoptimized
        sizes={`${PORTFOLIO_DECOR_BAKE_WIDTH}px`}
        className="portfolio-baked-bg-image"
      />
    </div>
  );
}

import type { Metadata } from 'next';

import { PortfolioDecorLayers } from '../_components/portfolio-decor-layers';
import {
  PORTFOLIO_BODY_HEIGHT,
  PORTFOLIO_CANVAS_HEIGHT,
  PORTFOLIO_DECOR_BAKE_WIDTH,
} from '../_components/portfolio-constants';
import '../_components/portfolio.css';
import './portfolio-decor-bake.css';

export const metadata: Metadata = {
  title: 'Portfolio decor bake',
  robots: { index: false, follow: false },
};

export const revalidate = 300;

/** Internal route — Playwright captures this tree to build decor-stack.webp. */
export default function PortfolioDecorBakePage(): React.JSX.Element {
  return (
    <div
      className="portfolio-decor-bake-root"
      style={{ width: PORTFOLIO_DECOR_BAKE_WIDTH, height: PORTFOLIO_CANVAS_HEIGHT }}
    >
      <section
        className="portfolio-body portfolio-body--decor-bake"
        style={{ height: PORTFOLIO_BODY_HEIGHT }}
      >
        <div className="portfolio-decor portfolio-decor--decor-bake">
          <PortfolioDecorLayers />
        </div>
      </section>
      <div className="portfolio-footer-ray-wrap portfolio-footer-ray-wrap--decor-bake" aria-hidden>
        <span className="portfolio-ray portfolio-ray--footer" />
      </div>
    </div>
  );
}

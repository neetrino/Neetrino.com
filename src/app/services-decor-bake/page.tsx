import type { Metadata } from 'next';

import { ServicesDecorLayers } from '../_components/services-decor-layers';
import {
  SERVICES_DECOR_BAKE_HEIGHT,
  SERVICES_DECOR_BAKE_WIDTH,
  SERVICES_HERO_HEIGHT,
} from '../_components/services-constants';
import '../_components/services-background.css';
import './services-decor-bake.css';

export const metadata: Metadata = {
  title: 'Services decor bake',
  robots: { index: false, follow: false },
};

/** Internal route — Playwright captures this tree to build decor-stack.webp. */
export default function ServicesDecorBakePage(): React.JSX.Element {
  return (
    <div
      className="services-decor-bake-root"
      style={{ width: SERVICES_DECOR_BAKE_WIDTH, height: SERVICES_DECOR_BAKE_HEIGHT }}
    >
      <section className="svc-hero svc-hero--decor-bake" style={{ height: SERVICES_HERO_HEIGHT }}>
        <div className="svc-decor svc-decor--decor-bake">
          <ServicesDecorLayers />
        </div>
      </section>
      <div className="svc-footer-ray-wrap svc-footer-ray-wrap--decor-bake" aria-hidden>
        <span className="svc-ray svc-ray--footer" />
      </div>
    </div>
  );
}

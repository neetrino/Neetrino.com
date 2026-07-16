'use client';

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import { useHomeI18n } from './home-i18n-provider';
import { ServiceCardGrid } from './services-cards';

export function ServicesHero(): React.JSX.Element {
  const { servicesCopy } = useHomeI18n();

  return (
    <section className="svc-hero svc-hero--baked">
      <div className="svc-title-wrap">
        <CdnImage
          src={staticAsset("/services/services-title.webp")}
          alt={servicesCopy.hero.title}
          width={597}
          height={64}
          sizes="(max-width: 767px) 90vw, 597px"
          priority
          fetchPriority="high"
          className="svc-title"
        />
      </div>
      <ServiceCardGrid />
    </section>
  );
}

'use client';

import { useHomeI18n } from './home-i18n-provider';
import { ServiceCardGrid } from './services-cards';

export function ServicesHero(): React.JSX.Element {
  const { servicesCopy } = useHomeI18n();

  return (
    <section className="svc-hero svc-hero--baked" aria-labelledby="services-heading">
      <div className="svc-title-wrap">
        <h1 id="services-heading" className="portfolio-title">
          {servicesCopy.hero.title}
        </h1>
      </div>
      <ServiceCardGrid />
    </section>
  );
}

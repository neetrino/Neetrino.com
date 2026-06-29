'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';

import { HOME_IMAGE_QUALITY } from './home-constants';
import { serviceIllustrations } from './home-data';
import { useHomeI18n } from './home-i18n-provider';
import { ContinueButton, SectionHeading, ServiceToneClass } from './home-ui';

export function HomeMobileServices(): React.JSX.Element {
  const { homeCopy, services } = useHomeI18n();

  return (
    <section id="services" className="home-mobile-services" aria-labelledby="home-mobile-services-title">
      <div className="home-mobile-services-heading-glow" aria-hidden>
        <Image src={staticAsset("/figma-home/rectangle17417.svg")} alt="" fill sizes="448px" />
      </div>

      <SectionHeading
        eyebrow={homeCopy.sections.services.eyebrow}
        title={homeCopy.sections.services.title}
        highlight={homeCopy.sections.services.highlight}
      />

      <div className="home-mobile-services-list">
        {services.map((service, index) => {
          const illustration = serviceIllustrations[index];
          if (!illustration) {
            return null;
          }

          return (
            <article
              key={service.id}
              className={`home-mobile-service-card ${ServiceToneClass(service.tone)}`}
            >
              <div className="home-mobile-service-card-glow" aria-hidden>
                <Image src={staticAsset("/figma-home/rectangle17418.svg")} alt="" fill sizes="448px" />
              </div>

              <div className={`home-mobile-service-card-art ${illustration.className}`}>
                <Image
                  src={illustration.src}
                  alt=""
                  fill
                  sizes="194px"
                  quality={HOME_IMAGE_QUALITY}
                  loading="lazy"
                  unoptimized={'unoptimized' in illustration && illustration.unoptimized}
                />
              </div>

              <div className="home-mobile-service-card-body">
                <h3 id={index === 0 ? 'home-mobile-services-title' : undefined}>{service.title}</h3>
                <p>{service.subtitle}</p>
                <ContinueButton href="/services" label={homeCopy.actions.continue} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

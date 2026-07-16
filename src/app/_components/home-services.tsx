'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import { HOME_IMAGE_QUALITY } from './home-constants';
import { serviceIllustrations } from './home-data';
import { useHomeI18n } from './home-i18n-provider';
import { ContinueButton, ExploreButton, HomeContainer, SectionHeading, ServiceToneClass } from './home-ui';

export function HomeServices(): React.JSX.Element {
  const { homeCopy, services } = useHomeI18n();

  return (
    <section id="services" className="home-section home-services">
      <div className="home-services-bg" aria-hidden>
        <Image
          src={staticAsset("/figma-home/rectangle17411.svg")}
          alt=""
          fill
          sizes="100vw"
          className="home-services-bg-image"
        />
      </div>
      <HomeContainer>
        <SectionHeading
          eyebrow={homeCopy.sections.services.eyebrow}
          title={homeCopy.sections.services.title}
          highlight={homeCopy.sections.services.highlight}
        />
        <div className="home-services-stage">
          <div className="home-services-grid">
            {services.map((service, index) => {
              const illustration = serviceIllustrations[index];

              return (
                <article key={service.id} className={`home-service-card ${ServiceToneClass(service.tone)}`}>
                  <h3>{service.title}</h3>
                  {illustration ? (
                    <div className={`home-service-card-art ${illustration.className}`} aria-hidden>
                      <Image
                        src={illustration.src}
                        alt=""
                        fill
                        sizes="220px"
                        quality={HOME_IMAGE_QUALITY}
                        loading="lazy"
                        unoptimized={'unoptimized' in illustration && illustration.unoptimized}
                      />
                    </div>
                  ) : null}
                  <div className="home-service-spacer" aria-hidden />
                  <p>{service.subtitle}</p>
                  <ContinueButton href="/services" label={homeCopy.actions.continue} />
                </article>
              );
            })}
          </div>
        </div>
        <div className="home-section-cta">
          <ExploreButton href="/services" label={homeCopy.actions.explore} />
        </div>
      </HomeContainer>
    </section>
  );
}

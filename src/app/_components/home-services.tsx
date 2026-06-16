import Image from 'next/image';
import { HOME_IMAGE_QUALITY } from './home-constants';
import { serviceIllustrations, services } from './home-data';
import { ContinueButton, ExploreButton, HomeContainer, SectionHeading, ServiceToneClass } from './home-ui';

export function HomeServices(): React.JSX.Element {
  return (
    <section id="services" className="home-section home-services">
      <div className="home-services-bg" aria-hidden>
        <Image
          src="/figma-home/rectangle17411.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-services-bg-image"
        />
      </div>
      <HomeContainer>
        <SectionHeading eyebrow="SERVICES" title="WHAT WE" highlight="DO" />
        <div className="home-services-stage">
          <div className="home-services-illustrations" aria-hidden>
            {serviceIllustrations.map((illustration) => (
              <div key={illustration.className} className={`home-services-deco ${illustration.className}`}>
                <Image
                  src={illustration.src}
                  alt=""
                  fill
                  sizes="260px"
                  quality={HOME_IMAGE_QUALITY}
                  loading="lazy"
                  unoptimized={'unoptimized' in illustration && illustration.unoptimized}
                />
              </div>
            ))}
          </div>
          <div className="home-services-grid">
            {services.map((service) => (
              <article key={service.title} className={`home-service-card ${ServiceToneClass(service.tone)}`}>
                <h3>{service.title}</h3>
                <div className="home-service-spacer" aria-hidden />
                <p>{service.subtitle}</p>
                <ContinueButton href="#contact" label="Continue" />
              </article>
            ))}
          </div>
        </div>
        <div className="home-section-cta">
          <ExploreButton href="#portfolio" label="Explore" />
        </div>
      </HomeContainer>
    </section>
  );
}

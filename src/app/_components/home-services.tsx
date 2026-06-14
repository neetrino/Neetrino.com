import Image from 'next/image';
import { services } from './home-data';
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
          <div className="home-services-deco home-services-deco-laptop" aria-hidden>
            <Image src="/figma-home/5391.png" alt="" fill sizes="251px" />
          </div>
          <div className="home-services-deco home-services-deco-phone" aria-hidden>
            <Image src="/figma-home/2.png" alt="" fill sizes="260px" />
          </div>
        <div className="home-services-grid">
          {services.map((service) => (
            <article key={service.title} className={`home-service-card ${ServiceToneClass(service.tone)}`}>
              <h3>{service.title}</h3>
              {service.image ? (
                <div className={`home-service-image ${service.imageClassName ?? ''}`}>
                  <Image src={service.image} alt="" fill sizes="258px" />
                </div>
              ) : (
                <div className="home-service-image home-service-image-empty" aria-hidden />
              )}
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

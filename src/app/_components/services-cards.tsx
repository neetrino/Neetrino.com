import Image from 'next/image';
import { serviceCards, type ServiceDetailCard } from './services-data';
import { ServiceIcon } from './services-icons';

function ServiceDetailCardView({ card }: { card: ServiceDetailCard }): React.JSX.Element {
  return (
    <article className={`svc-card svc-card--${card.id}`}>
      <span className="svc-card-fill" aria-hidden />
      <span className="svc-card-corner-glow" aria-hidden />
      <span className="svc-card-icon" aria-hidden>
        <ServiceIcon icon={card.icon} className="svc-card-icon-svg" />
      </span>
      <div className="svc-card-text">
        <h2 className="svc-card-title">
          {card.title.map((line) => (
            <span key={line} className="svc-card-title-line">
              {line}
            </span>
          ))}
        </h2>
        <p className="svc-card-desc">
          {card.description.map((line) => (
            <span key={line} className="svc-card-desc-line">
              {line}
            </span>
          ))}
        </p>
      </div>
      <a className="svc-card-cta" href="#contact">
        <span>Continue</span>
        <Image src="/figma-home/safearea.svg" alt="" width={20} height={20} aria-hidden />
      </a>
      <span className="svc-card-edge-glow" aria-hidden />
    </article>
  );
}

export function ServiceCardGrid(): React.JSX.Element {
  return (
    <div className="svc-grid">
      {serviceCards.map((card) => (
        <ServiceDetailCardView key={card.id} card={card} />
      ))}
    </div>
  );
}

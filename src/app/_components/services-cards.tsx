'use client';

import { useHomeI18n } from './home-i18n-provider';
import type { ServiceDetailCard } from './services-data';
import { ServiceIcon } from './services-icons';

function ServiceDetailCardView({
  card,
  continueLabel,
}: {
  card: ServiceDetailCard;
  continueLabel: string;
}): React.JSX.Element {
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
        <span>{continueLabel}</span>
        <svg className="svc-card-cta-icon" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <path
            d="M10.83 2.5 15.83 8.33 10.83 14.17M15.83 8.33H.83"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <span className="svc-card-edge-glow" aria-hidden />
    </article>
  );
}

export function ServiceCardGrid(): React.JSX.Element {
  const { serviceDetailCards, servicesCopy } = useHomeI18n();

  return (
    <div className="svc-grid">
      {serviceDetailCards.map((card) => (
        <ServiceDetailCardView
          key={card.id}
          card={card}
          continueLabel={servicesCopy.actions.continue}
        />
      ))}
    </div>
  );
}

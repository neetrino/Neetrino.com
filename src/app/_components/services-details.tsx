'use client';

import Link from 'next/link';
import { CdnImage as Image } from '@/lib/cdn-image';
import { useHomeI18n } from './home-i18n-provider';
import { SERVICE_DETAIL_IMAGES } from './services-detail-images';
import type { ServiceDetailCard } from './services-data';
import { ServiceIcon } from './services-icons';

function ServiceDetailPanel({
  card,
  index,
  talkToUsLabel,
}: {
  card: ServiceDetailCard;
  index: number;
  talkToUsLabel: string;
}): React.JSX.Element {
  const isReversed = index % 2 === 1;
  const title = card.title.join(' ');
  const imageSrc = SERVICE_DETAIL_IMAGES[card.id];

  return (
    <section
      id={`service-${card.id}`}
      className={
        isReversed
          ? `svc-detail svc-detail--${card.id} svc-detail--reversed`
          : `svc-detail svc-detail--${card.id}`
      }
      aria-labelledby={`service-${card.id}-title`}
    >
      <div className="svc-detail-copy">
        <span className="svc-detail-icon" aria-hidden>
          <ServiceIcon icon={card.icon} className="svc-detail-icon-svg" />
        </span>
        <p className="svc-detail-eyebrow">{title}</p>
        <h2 id={`service-${card.id}-title`} className="svc-detail-headline">
          {card.detailHeadline}
        </h2>
        <div className="svc-detail-body">
          {card.detailBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="svc-detail-points">
          {card.detailPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <Link className="svc-detail-cta" href="/contact">
          <span>{talkToUsLabel}</span>
          <svg className="svc-detail-cta-icon" viewBox="0 0 17 17" fill="none" aria-hidden="true">
            <path
              d="M10.83 2.5 15.83 8.33 10.83 14.17M15.83 8.33H.83"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
      <div className="svc-detail-visual" aria-hidden>
        <span className="svc-detail-visual-glow" />
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 767px) 100vw, 520px"
          className="svc-detail-visual-image"
        />
        <span className="svc-detail-visual-veil" />
      </div>
    </section>
  );
}

export function ServicesDetails(): React.JSX.Element {
  const { serviceDetailCards, servicesCopy } = useHomeI18n();

  return (
    <div className="svc-details" aria-label={servicesCopy.details.sectionAria}>
      {serviceDetailCards.map((card, index) => (
        <ServiceDetailPanel
          key={card.id}
          card={card}
          index={index}
          talkToUsLabel={servicesCopy.actions.talkToUs}
        />
      ))}
    </div>
  );
}

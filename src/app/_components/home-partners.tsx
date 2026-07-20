'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { partnerLogos } from './home-data';
import { useHomeI18n } from './home-i18n-provider';

const PARTNER_SEQUENCE = [...partnerLogos, ...partnerLogos] as const;

export function HomePartners(): React.JSX.Element {
  const { homeCopy } = useHomeI18n();

  return (
    <section className="home-section home-partners" aria-label={homeCopy.partners.ariaLabel}>
      <div className="home-partners-viewport">
        <div className="home-partners-track">
          {PARTNER_SEQUENCE.map((logo, index) => (
            <div
              key={`${logo.src}-${index}`}
              className="home-partner-logo"
              style={{ width: `calc(${logo.width}px * var(--home-ui-scale))` }}
            >
              <Image
                src={logo.src}
                alt={index < partnerLogos.length ? logo.alt : ''}
                width={logo.width}
                height={logo.height}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

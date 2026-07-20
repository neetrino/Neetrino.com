'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { partnerLogos } from './home-data';
import { useHomeI18n } from './home-i18n-provider';

/** Enough copies so one track half stays wider than large viewports. */
const SETS_PER_GROUP = 4;

function PartnerLogoGroup({ ariaHidden }: { ariaHidden?: boolean }): React.JSX.Element {
  const logos = Array.from({ length: SETS_PER_GROUP }, () => partnerLogos).flat();

  return (
    <div className="home-partners-group" aria-hidden={ariaHidden ? true : undefined}>
      {logos.map((logo, index) => (
        <div
          key={`${logo.src}-${index}`}
          className="home-partner-logo"
          style={{ width: `calc(${logo.width}px * var(--home-ui-scale))` }}
        >
          <Image
            src={logo.src}
            alt={ariaHidden || index >= partnerLogos.length ? '' : logo.alt}
            width={logo.width}
            height={logo.height}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

export function HomePartners(): React.JSX.Element {
  const { homeCopy } = useHomeI18n();

  return (
    <section className="home-section home-partners" aria-label={homeCopy.partners.ariaLabel}>
      <div className="home-partners-viewport">
        <div className="home-partners-track">
          <PartnerLogoGroup />
          <PartnerLogoGroup ariaHidden />
        </div>
      </div>
    </section>
  );
}

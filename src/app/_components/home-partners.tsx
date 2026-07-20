'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import type { PublicPartnerLogo } from '@/lib/public-partner-logos';
import { useHomeI18n } from './home-i18n-provider';

/** Enough copies so one track half stays wider than large viewports. */
const SETS_PER_GROUP = 4;

type HomePartnersProps = {
  logos: readonly PublicPartnerLogo[];
};

function PartnerLogoGroup({
  logos,
  ariaHidden,
}: {
  logos: readonly PublicPartnerLogo[];
  ariaHidden?: boolean;
}): React.JSX.Element {
  const sequence = Array.from({ length: SETS_PER_GROUP }, () => logos).flat();

  return (
    <div className="home-partners-group" aria-hidden={ariaHidden ? true : undefined}>
      {sequence.map((logo, index) => (
        <div
          key={`${logo.src}-${index}`}
          className="home-partner-logo"
          style={{ width: `calc(${logo.width}px * var(--home-ui-scale))` }}
        >
          <Image
            src={logo.src}
            alt={ariaHidden || index >= logos.length ? '' : logo.alt}
            width={logo.width}
            height={logo.height}
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

export function HomePartners({ logos }: HomePartnersProps): React.JSX.Element | null {
  const { homeCopy } = useHomeI18n();

  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="home-section home-partners" aria-label={homeCopy.partners.ariaLabel}>
      <div className="home-partners-viewport">
        <div className="home-partners-track">
          <PartnerLogoGroup logos={logos} />
          <PartnerLogoGroup logos={logos} ariaHidden />
        </div>
      </div>
    </section>
  );
}

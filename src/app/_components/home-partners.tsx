'use client';

import { useEffect, useRef } from 'react';
import { CdnImage as Image } from '@/lib/cdn-image';
import type { PublicPartnerLogo } from '@/lib/public-partner-logos';
import { useHomeI18n } from './home-i18n-provider';

/** Enough copies so one track half stays wider than large viewports. */
const SETS_PER_GROUP = 4;
const PLAY_STATE_VAR = '--home-partners-play-state';
const INTERSECTION_ROOT_MARGIN = '240px 0px';

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
            loading="lazy"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Partners marquee keeps moving while visible (including during page scroll).
 * Pauses only when the section is off-screen.
 */
export function HomePartners({ logos }: HomePartnersProps): React.JSX.Element | null {
  const { homeCopy } = useHomeI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry?.isIntersecting ?? false;
        section.style.setProperty(PLAY_STATE_VAR, isVisible ? 'running' : 'paused');
      },
      { rootMargin: INTERSECTION_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(section);
    section.style.setProperty(PLAY_STATE_VAR, 'running');

    return () => observer.disconnect();
  }, []);

  if (logos.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="home-section home-partners"
      aria-label={homeCopy.partners.ariaLabel}
    >
      <div className="home-partners-viewport">
        <div className="home-partners-track">
          <PartnerLogoGroup logos={logos} />
          <PartnerLogoGroup logos={logos} ariaHidden />
        </div>
      </div>
    </section>
  );
}

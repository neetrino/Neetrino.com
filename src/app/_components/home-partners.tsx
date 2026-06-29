'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { partnerLogos } from './home-data';
import { useHomeI18n } from './home-i18n-provider';
import { HomeContainer } from './home-ui';

export function HomePartners(): React.JSX.Element {
  const { homeCopy } = useHomeI18n();

  return (
    <section className="home-section home-partners" aria-label={homeCopy.partners.ariaLabel}>
      <HomeContainer>
        <div className="home-partners-track">
          {partnerLogos.map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="home-partner-logo">
              <Image src={logo.src} alt="" width={logo.width} height={logo.height} />
            </div>
          ))}
        </div>
      </HomeContainer>
    </section>
  );
}

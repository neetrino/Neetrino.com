import { AboutDeferredDecor } from './about-deferred-decor';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesDetails } from './services-details';
import { ServicesHero } from './services-hero';
import { ServicesMobileBackground } from './services-mobile-background';
import { servicesMessages } from './services-messages';
import './about-decor.css';
import './services-background.css';
import './services-mobile-background.css';
import './services.css';

export function ServicesPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="services-top" srOnlyTitle={servicesMessages.hero.srOnlyTitle}>
      <div className="svc-page-main">
        <div className="svc-about-bg" aria-hidden>
          <AboutDeferredDecor />
          <span className="about-ray about-ray-6" />
          <span className="about-ray about-ray-7" />
        </div>
        <div className="svc-mobile-bg-shell">
          <ServicesMobileBackground />
          <ServicesHero />
          <ServicesDetails />
        </div>
      </div>
    </NeetrinoPageShell>
  );
}

import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesBakedBackground } from './services-baked-background';
import { ServicesHero } from './services-hero';
import { servicesMessages } from './services-messages';
import './services-background.css';
import './services.css';

export function ServicesPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="services-top" srOnlyTitle={servicesMessages.hero.srOnlyTitle}>
      <ServicesBakedBackground />
      <ServicesHero />
      <div className="svc-footer-ray-wrap svc-footer-ray-wrap--baked" aria-hidden />
    </NeetrinoPageShell>
  );
}

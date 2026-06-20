import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesBakedBackground } from './services-baked-background';
import { ServicesHero } from './services-hero';
import './services-background.css';
import './services.css';

export function ServicesPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="services-top" srOnlyTitle="Neetrino Services">
      <ServicesBakedBackground />
      <ServicesHero />
      <div className="svc-footer-ray-wrap svc-footer-ray-wrap--baked" aria-hidden />
    </NeetrinoPageShell>
  );
}

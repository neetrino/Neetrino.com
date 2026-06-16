import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesHero } from './services-hero';
import './services.css';

export function ServicesPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="services-top" srOnlyTitle="Neetrino Services">
      <ServicesHero />
    </NeetrinoPageShell>
  );
}

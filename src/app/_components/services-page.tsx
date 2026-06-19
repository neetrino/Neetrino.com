import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesHero } from './services-hero';
import './services.css';

export function ServicesPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="services-top" srOnlyTitle="Neetrino Services">
      <div className="home-page-glow svc-page-glow" aria-hidden />
      <ServicesHero />
      <div className="svc-footer-ray-wrap" aria-hidden>
        <span className="svc-ray svc-ray--footer" />
      </div>
    </NeetrinoPageShell>
  );
}

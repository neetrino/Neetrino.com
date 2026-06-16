import { ServiceCardGrid } from './services-cards';

const DECORATIONS = [
  'svc-deco-glow-1',
  'svc-deco-glow-2',
  'svc-deco-beam-l',
  'svc-deco-beam-r',
  'svc-deco-beam-center',
  'svc-deco-arc-1',
  'svc-deco-arc-2',
  'svc-deco-grid-far',
  'svc-deco-grid-near',
] as const;

export function ServicesHero(): React.JSX.Element {
  return (
    <section className="svc-hero">
      <div className="svc-bg" aria-hidden>
        {DECORATIONS.map((name) => (
          <span key={name} className={`svc-deco ${name}`} />
        ))}
      </div>
      <p className="svc-title">SERVICES</p>
      <ServiceCardGrid />
    </section>
  );
}

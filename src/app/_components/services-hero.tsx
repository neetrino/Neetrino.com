import Image from 'next/image';
import { ServiceCardGrid } from './services-cards';

const SERVICES_BACKGROUND_DECORATIONS = [
  'svc-deco-glow-1',
  'svc-deco-glow-2',
  'svc-deco-beam-l',
  'svc-deco-beam-r',
  'svc-deco-beam-center',
  'svc-deco-arc-1',
  'svc-deco-arc-2',
  'svc-deco-grid-far',
] as const;

export function ServicesHero(): React.JSX.Element {
  return (
    <section className="svc-hero">
      <div className="svc-bg" aria-hidden>
        {SERVICES_BACKGROUND_DECORATIONS.map((name) => (
          <span key={name} className={`svc-deco ${name}`} />
        ))}
      </div>
      <Image
        src="/services/services-title.webp"
        alt="SERVICES"
        width={597}
        height={64}
        sizes="(max-width: 900px) 90vw, 597px"
        priority
        fetchPriority="high"
        className="svc-title"
      />
      <ServiceCardGrid />
    </section>
  );
}

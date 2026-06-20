import Image from 'next/image';
import { ServiceCardGrid } from './services-cards';

export function ServicesHero(): React.JSX.Element {
  return (
    <section className="svc-hero svc-hero--baked">
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

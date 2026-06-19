import Image from 'next/image';

/** Static glass beam spanning the capsule track; only the cube animates on scroll. */
export function AboutMobileCapsule(): React.JSX.Element {
  return (
    <div className="about-mobile-capsule" aria-hidden>
      <span className="about-mobile-beam" />
      <div className="about-mobile-cube">
        <Image
          src="/about/cube-transparent-v2.webp"
          alt=""
          fill
          sizes="131px"
          loading="lazy"
          fetchPriority="low"
          className="about-mobile-cube-img"
        />
      </div>
    </div>
  );
}

import Image from 'next/image';

const BG_IMG_CLASS = 'home-mobile-bg-img';

/** Page-level glow accents below the hero (services + stats). */
export function HomeMobileBackground(): React.JSX.Element {
  return (
    <div className="home-mobile-bg" aria-hidden>
      <div className="home-mobile-bg-glow home-mobile-bg-glow--stats-a">
        <Image src="/figma-home/rectangle17415.svg" alt="" fill sizes="448px" className={BG_IMG_CLASS} />
      </div>

      <div className="home-mobile-bg-glow home-mobile-bg-glow--stats-b">
        <Image src="/figma-home/rectangle17415.svg" alt="" fill sizes="448px" className={BG_IMG_CLASS} />
      </div>
    </div>
  );
}

import Image from 'next/image';
import { showcaseDevices } from './home-data';
import { HomeContainer } from './home-ui';

export function HomeShowcase(): React.JSX.Element {
  return (
    <section className="home-section home-showcase">
      <div className="home-showcase-bg" aria-hidden>
        <Image
          src="/figma-home/rectangle17415.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-showcase-bg-image"
        />
      </div>
      <HomeContainer>
        <div className="home-showcase-stage">
          <div className="home-showcase-ring" aria-hidden>
            <Image src="/figma-home/ellipse3459.svg" alt="" fill className="home-showcase-ring-image" />
          </div>
          <div className="home-showcase-devices">
            {showcaseDevices.map((device) => (
              <div key={device.src} className={device.className}>
                <Image src={device.src} alt={device.alt} fill sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            ))}
          </div>
          <div className="home-showcase-nav">
            <button type="button" className="home-arrow-btn home-arrow-btn-prev" aria-label="Previous project">
              <Image src="/figma-home/safearea.svg" alt="" width={20} height={20} aria-hidden />
            </button>
            <button type="button" className="home-arrow-btn home-arrow-btn-next" aria-label="Next project">
              <Image src="/figma-home/safearea.svg" alt="" width={20} height={20} aria-hidden />
            </button>
          </div>
        </div>
      </HomeContainer>
    </section>
  );
}

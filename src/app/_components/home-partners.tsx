import Image from 'next/image';
import { partnerLogos } from './home-data';
import { HomeContainer } from './home-ui';

export function HomePartners(): React.JSX.Element {
  return (
    <section className="home-section home-partners" aria-label="Partner logos">
      <HomeContainer>
        <div className="home-partners-track">
          {partnerLogos.map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="home-partner-logo">
              <Image src={logo.src} alt="" width={logo.width} height={logo.height} />
            </div>
          ))}
        </div>
      </HomeContainer>
    </section>
  );
}

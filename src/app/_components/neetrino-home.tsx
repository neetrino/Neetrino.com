import Image from 'next/image';
import { HomeAbout } from './home-about';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { HomeHero } from './home-hero';
import { HomePartners } from './home-partners';
import { HomePortfolio } from './home-portfolio';
import { HomeServices } from './home-services';
import { HomeShowcase } from './home-showcase';

export function NeetrinoHome(): React.JSX.Element {
  return (
    <main className="home-page">
      <div className="home-page-glow" aria-hidden>
        <Image
          src="/figma-home/vector1.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-page-glow-image"
        />
      </div>
      <h1 className="sr-only">Neetrino IT Company</h1>
      <HomeHeader />
      <HomeHero />
      <HomeServices />
      <HomePortfolio />
      <HomeAbout />
      <HomeShowcase />
      <HomePartners />
      <HomeFooter />
    </main>
  );
}

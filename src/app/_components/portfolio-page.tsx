import Image from 'next/image';
import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { portfolioProjects, type PortfolioProject } from './portfolio-data';
import './portfolio.css';

const SERVICE_BACKGROUND_DECORATIONS = [
  'svc-deco-glow-1',
  'svc-deco-glow-2',
  'svc-deco-beam-l',
  'svc-deco-beam-r',
  'svc-deco-beam-center',
  'svc-deco-arc-1',
  'svc-deco-arc-2',
  'svc-deco-grid-far',
] as const;

const PORTFOLIO_RAYS = ['portfolio-ray--mid', 'portfolio-ray--end'] as const;

function PortfolioCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}): React.JSX.Element {
  const isLcpCard = index === 0;

  return (
    <article className="portfolio-card" aria-label={project.title}>
      <div className="portfolio-card-media">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 899px) 50vw, (max-width: 1440px) 44vw, 631px"
          quality={HOME_PORTFOLIO_IMAGE_QUALITY}
          priority={isLcpCard}
          loading={isLcpCard ? 'eager' : 'lazy'}
          fetchPriority={isLcpCard ? 'high' : 'low'}
          decoding="async"
          className="portfolio-card-image"
        />
      </div>
    </article>
  );
}

export function PortfolioPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="portfolio-top" srOnlyTitle="Neetrino Portfolio">
      <div className="home-page-glow portfolio-page-glow" aria-hidden />
      <section className="portfolio-body" aria-labelledby="portfolio-heading">
        <div className="svc-bg" aria-hidden>
          {SERVICE_BACKGROUND_DECORATIONS.map((name) => (
            <span key={name} className={`svc-deco ${name}`} />
          ))}
        </div>
        <div className="portfolio-rays" aria-hidden>
          {PORTFOLIO_RAYS.map((name) => (
            <span key={name} className={`portfolio-ray ${name}`} />
          ))}
        </div>
        <header className="portfolio-intro">
          <h2 id="portfolio-heading" className="portfolio-heading">
            Portfolio
          </h2>
          <p className="portfolio-description">
            A curated selection of digital products and interfaces delivered for growing businesses
            across different industries.
          </p>
        </header>
        <div className="portfolio-list">
          {portfolioProjects.map((project, index) => (
            <PortfolioCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>
    </NeetrinoPageShell>
  );
}

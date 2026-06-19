import Image from 'next/image';
import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { PORTFOLIO_CANVAS_HEIGHT } from './portfolio-constants';
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
  'svc-deco-grid-near',
] as const;

const PORTFOLIO_RAYS = ['portfolio-ray--mid', 'portfolio-ray--end'] as const;

const PORTFOLIO_PAGES = [1, 2, 3, 4, 5] as const;
const ACTIVE_PORTFOLIO_PAGE = 3;

function PortfolioCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}): React.JSX.Element {
  const isLcpCard = index === 0;

  return (
    <article className={`portfolio-card portfolio-card--${project.variant ?? 'default'}`} aria-label={project.title}>
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
        {project.variant === 'zeppelin' ? (
          <>
            <Image
              src="/portfolio/cat-logo.png"
              alt=""
              width={114}
              height={61}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              className="portfolio-card-logo portfolio-card-logo--cat"
            />
            <span className="portfolio-card-title portfolio-card-title--zeppelin">ZEPPELIN</span>
          </>
        ) : null}
        <span className="portfolio-card-action" aria-hidden>
          <span className="portfolio-card-action-arrow" />
        </span>
      </div>
    </article>
  );
}

function PortfolioPagination(): React.JSX.Element {
  return (
    <nav className="portfolio-pagination" aria-label="Portfolio pagination">
      <span className="portfolio-pagination-item portfolio-pagination-arrow" aria-hidden>
        ‹
      </span>
      {PORTFOLIO_PAGES.map((page) => (
        <span
          key={page}
          className={
            page === ACTIVE_PORTFOLIO_PAGE
              ? 'portfolio-pagination-item portfolio-pagination-item--active'
              : 'portfolio-pagination-item'
          }
          aria-current={page === ACTIVE_PORTFOLIO_PAGE ? 'page' : undefined}
        >
          {page}
        </span>
      ))}
      <span className="portfolio-pagination-item portfolio-pagination-arrow" aria-hidden>
        ›
      </span>
    </nav>
  );
}

export function PortfolioPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell
      mainId="portfolio-top"
      srOnlyTitle="Neetrino Portfolio"
      canvasHeight={PORTFOLIO_CANVAS_HEIGHT}
    >
      <section className="portfolio-body" aria-labelledby="portfolio-heading">
        <div className="portfolio-decor" aria-hidden>
          <div className="home-page-glow portfolio-page-glow" />
          <div className="svc-bg">
            {SERVICE_BACKGROUND_DECORATIONS.map((name) => (
              <span key={name} className={`svc-deco ${name}`} />
            ))}
          </div>
          <div className="portfolio-rays">
            {PORTFOLIO_RAYS.map((name) => (
              <span key={name} className={`portfolio-ray ${name}`} />
            ))}
          </div>
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
        <PortfolioPagination />
      </section>
      <div className="portfolio-footer-ray-wrap" aria-hidden>
        <span className="portfolio-ray portfolio-ray--footer" />
      </div>
    </NeetrinoPageShell>
  );
}

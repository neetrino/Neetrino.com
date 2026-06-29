'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';
import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { PortfolioBakedBackground } from './portfolio-baked-background';
import {
  PORTFOLIO_CANVAS_HEIGHT,
  PORTFOLIO_LCP_CARD_COUNT,
  PORTFOLIO_TITLE_HEIGHT,
  PORTFOLIO_TITLE_SRC,
  PORTFOLIO_TITLE_WIDTH,
} from './portfolio-constants';
import type { PortfolioProject } from './portfolio-data';
import { portfolioMessages } from './portfolio-messages';
import { isRemoteImageUrl } from '@/lib/image-url';
import './portfolio.css';
import './services.css';

const PORTFOLIO_PAGES = [1, 2, 3, 4, 5] as const;
const ACTIVE_PORTFOLIO_PAGE = 3;

function PortfolioCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}): React.JSX.Element {
  const isAboveFold = index < PORTFOLIO_LCP_CARD_COUNT;

  return (
    <article className={`portfolio-card portfolio-card--${project.variant ?? 'default'}`} aria-label={project.title}>
      <div className="portfolio-card-media">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 899px) 50vw, (max-width: 1440px) 44vw, 631px"
          quality={HOME_PORTFOLIO_IMAGE_QUALITY}
          priority={isAboveFold}
          loading={isAboveFold ? 'eager' : 'lazy'}
          fetchPriority={isAboveFold ? 'high' : 'low'}
          decoding="async"
          unoptimized={isRemoteImageUrl(project.image)}
          className="portfolio-card-image"
        />
        {project.variant === 'zeppelin' ? (
          <>
            <Image
              src={staticAsset("/portfolio/cat-logo.webp")}
              alt=""
              width={114}
              height={61}
              loading="lazy"
              fetchPriority="low"
              decoding="async"
              className="portfolio-card-logo portfolio-card-logo--cat"
            />
            <span className="portfolio-card-title portfolio-card-title--zeppelin">{project.overlayTitle}</span>
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
  const { portfolioCopy } = useHomeI18n();

  return (
    <nav className="portfolio-pagination" aria-label={portfolioCopy.pagination.ariaLabel}>
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

function PortfolioBody({ projects }: { projects: PortfolioProject[] }): React.JSX.Element {
  const { portfolioCopy } = useHomeI18n();

  return (
    <section className="portfolio-body portfolio-body--baked" aria-labelledby="portfolio-heading">
      <header className="portfolio-intro">
        <div className="svc-title-wrap">
          <Image
            id="portfolio-heading"
            src={PORTFOLIO_TITLE_SRC}
            alt={portfolioCopy.hero.title}
            width={PORTFOLIO_TITLE_WIDTH}
            height={PORTFOLIO_TITLE_HEIGHT}
            sizes="(max-width: 900px) 90vw, 597px"
            priority
            fetchPriority="high"
            className="svc-title"
          />
        </div>
      </header>
      <div className="portfolio-list">
        {projects.map((project, index) => (
          <PortfolioCard key={`${project.title}-${project.image}`} project={project} index={index} />
        ))}
      </div>
      <PortfolioPagination />
    </section>
  );
}

export function PortfolioPage({ projects }: { projects: PortfolioProject[] }): React.JSX.Element {
  return (
    <NeetrinoPageShell
      mainId="portfolio-top"
      srOnlyTitle={portfolioMessages.hero.srOnlyTitle}
      canvasHeight={PORTFOLIO_CANVAS_HEIGHT}
    >
      <PortfolioBakedBackground />
      <PortfolioBody projects={projects} />
      <div className="portfolio-footer-ray-wrap portfolio-footer-ray-wrap--baked" aria-hidden />
    </NeetrinoPageShell>
  );
}

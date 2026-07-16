'use client';

import { useState } from 'react';
import { CdnImage as Image } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { PortfolioBakedBackground } from './portfolio-baked-background';
import {
  PORTFOLIO_ANRA_SCREEN_SRC,
  PORTFOLIO_CANVAS_HEIGHT,
  PORTFOLIO_ITEMS_PER_PAGE,
  PORTFOLIO_LCP_CARD_COUNT,
} from './portfolio-constants';
import type { PortfolioProject } from './portfolio-data';
import { portfolioMessages } from './portfolio-messages';
import { isRemoteImageUrl } from '@/lib/image-url';
import './portfolio.css';
import './services.css';

type PortfolioPaginationState = {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  visibleProjects: PortfolioProject[];
  goToPage: (page: number) => void;
};

function formatPortfolioPageLabel(template: string, page: number): string {
  return template.replace('{page}', String(page));
}

function usePortfolioPagination(projects: PortfolioProject[]): PortfolioPaginationState {
  const [page, setPage] = useState(1);
  const itemsPerPage = PORTFOLIO_ITEMS_PER_PAGE;

  const totalPages = Math.max(1, Math.ceil(projects.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const visibleStart = (currentPage - 1) * itemsPerPage;
  const visibleProjects = projects.slice(visibleStart, visibleStart + itemsPerPage);

  const goToPage = (nextPage: number): void => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    visibleProjects,
    goToPage,
  };
}

function PortfolioCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}): React.JSX.Element {
  const { portfolioCopy } = useHomeI18n();
  const isAboveFold = index < PORTFOLIO_LCP_CARD_COUNT;

  return (
    <article className={`portfolio-card portfolio-card--${project.variant ?? 'default'}`} aria-label={project.title}>
      <div className="portfolio-card-media">
        {project.variant === 'anra' ? (
          <>
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1440px) 44vw, 631px"
              quality={HOME_PORTFOLIO_IMAGE_QUALITY}
              priority={isAboveFold}
              loading={isAboveFold ? 'eager' : 'lazy'}
              fetchPriority={isAboveFold ? 'high' : 'low'}
              decoding="async"
              unoptimized={isRemoteImageUrl(project.image)}
              className="portfolio-card-image portfolio-card-image--anra-mockup"
            />
            <div className="portfolio-card-screen portfolio-card-screen--anra">
              <Image
                src={PORTFOLIO_ANRA_SCREEN_SRC}
                alt=""
                fill
                sizes="(max-width: 767px) 21vw, 133px"
                quality={HOME_PORTFOLIO_IMAGE_QUALITY}
                loading="lazy"
                fetchPriority="low"
                decoding="async"
                className="portfolio-card-screen-image"
              />
            </div>
          </>
        ) : (
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1440px) 44vw, 631px"
            quality={HOME_PORTFOLIO_IMAGE_QUALITY}
            priority={isAboveFold}
            loading={isAboveFold ? 'eager' : 'lazy'}
            fetchPriority={isAboveFold ? 'high' : 'low'}
            decoding="async"
            unoptimized={isRemoteImageUrl(project.image)}
            className="portfolio-card-image"
          />
        )}
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
        {project.href ? (
          <a
            href={project.href}
            className="portfolio-card-action"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${portfolioCopy.card.openProject}: ${project.title}`}
          >
            <span className="portfolio-card-action-arrow" aria-hidden />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function PortfolioPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}): React.JSX.Element | null {
  const { portfolioCopy } = useHomeI18n();

  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="portfolio-pagination" aria-label={portfolioCopy.pagination.ariaLabel}>
      <button
        type="button"
        className="portfolio-pagination-item portfolio-pagination-arrow"
        aria-label={portfolioCopy.pagination.previousPage}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹
      </button>
      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            className={
              isActive
                ? 'portfolio-pagination-item portfolio-pagination-item--active'
                : 'portfolio-pagination-item'
            }
            aria-label={formatPortfolioPageLabel(portfolioCopy.pagination.goToPage, page)}
            aria-current={isActive ? 'page' : undefined}
            disabled={isActive}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        className="portfolio-pagination-item portfolio-pagination-arrow"
        aria-label={portfolioCopy.pagination.nextPage}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ›
      </button>
    </nav>
  );
}

function PortfolioBody({ projects }: { projects: PortfolioProject[] }): React.JSX.Element {
  const { portfolioCopy } = useHomeI18n();
  const { currentPage, totalPages, visibleProjects, goToPage } = usePortfolioPagination(projects);

  return (
    <section className="portfolio-body portfolio-body--baked" aria-labelledby="portfolio-heading">
      <header className="portfolio-intro">
        <div className="portfolio-title-wrap">
          <h1 id="portfolio-heading" className="portfolio-title">
            {portfolioCopy.hero.title}
          </h1>
        </div>
      </header>
      <div className="portfolio-list">
        {visibleProjects.map((project, index) => (
          <PortfolioCard key={project.id} project={project} index={index} />
        ))}
      </div>
      <PortfolioPagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
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

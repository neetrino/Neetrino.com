'use client';

import { useEffect, useState } from 'react';
import { CdnImage as Image } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { PortfolioBakedBackground } from './portfolio-baked-background';
import {
  PORTFOLIO_ANRA_SCREEN_SRC,
  PORTFOLIO_INITIAL_VISIBLE,
  PORTFOLIO_LCP_CARD_COUNT,
  PORTFOLIO_LOAD_MORE_COUNT,
} from './portfolio-constants';
import type { PortfolioProject } from './portfolio-data';
import { portfolioMessages } from './portfolio-messages';
import { isRemoteImageUrl } from '@/lib/image-url';
import './portfolio.css';
import './services.css';

const LOAD_MORE_ROOT_MARGIN = '280px 0px';

type PortfolioInfiniteScrollState = {
  hasMore: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  visibleProjects: PortfolioProject[];
};

function usePortfolioInfiniteScroll(projects: PortfolioProject[]): PortfolioInfiniteScrollState {
  const projectCount = projects.length;
  const [visibleCount, setVisibleCount] = useState(() =>
    Math.min(PORTFOLIO_INITIAL_VISIBLE, projectCount),
  );
  const [trackedProjectCount, setTrackedProjectCount] = useState(projectCount);
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  if (projectCount !== trackedProjectCount) {
    setTrackedProjectCount(projectCount);
    setVisibleCount(Math.min(PORTFOLIO_INITIAL_VISIBLE, projectCount));
  }

  const hasMore = visibleCount < projectCount;

  useEffect(() => {
    if (!sentinelNode || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) =>
          Math.min(current + PORTFOLIO_LOAD_MORE_COUNT, projectCount),
        );
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(sentinelNode);
    return () => observer.disconnect();
  }, [hasMore, projectCount, sentinelNode, visibleCount]);

  return {
    hasMore,
    sentinelRef: setSentinelNode,
    visibleProjects: projects.slice(0, visibleCount),
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
            <svg className="portfolio-card-action-arrow" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M7 17L17 7M10 7h7v7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function PortfolioBody({ projects }: { projects: PortfolioProject[] }): React.JSX.Element {
  const { portfolioCopy } = useHomeI18n();
  const { hasMore, sentinelRef, visibleProjects } = usePortfolioInfiniteScroll(projects);

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
      {hasMore ? <div ref={sentinelRef} className="portfolio-load-sentinel" aria-hidden /> : null}
    </section>
  );
}

export function PortfolioPage({ projects }: { projects: PortfolioProject[] }): React.JSX.Element {
  return (
    <NeetrinoPageShell
      mainId="portfolio-top"
      srOnlyTitle={portfolioMessages.hero.srOnlyTitle}
    >
      <PortfolioBakedBackground />
      <PortfolioBody projects={projects} />
      <div className="portfolio-footer-ray-wrap portfolio-footer-ray-wrap--baked" aria-hidden />
    </NeetrinoPageShell>
  );
}

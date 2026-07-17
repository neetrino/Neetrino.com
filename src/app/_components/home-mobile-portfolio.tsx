'use client';

import { CdnImage as Image } from '@/lib/cdn-image';
import { isRemoteImageUrl } from '@/lib/image-url';
import { staticAsset } from '@/lib/static-asset';
import { useEffect, useState } from 'react';

import { HOME_PORTFOLIO_IMAGE_QUALITY } from './home-constants';
import type { ProjectCard } from './home-data';
import { useHomeI18n } from './home-i18n-provider';
import { ExploreButton, SectionHeading } from './home-ui';
import './home-mobile-portfolio.css';

type HomeMobilePortfolioProps = {
  projects: ProjectCard[];
};

function useActiveSlideIndex(projectCount: number): {
  activeIndex: number;
  setTrackNode: (node: HTMLDivElement | null) => void;
} {
  const [activeIndex, setActiveIndex] = useState(0);
  const [trackNode, setTrackNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackNode || projectCount === 0) {
      return;
    }

    const slides = Array.from(trackNode.querySelectorAll<HTMLElement>('[data-portfolio-slide]'));
    if (slides.length === 0) {
      return;
    }

    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.getAttribute('data-portfolio-slide'));
          if (!Number.isFinite(index)) {
            continue;
          }
          ratios.set(index, entry.intersectionRatio);
        }

        let bestIndex = 0;
        let bestRatio = -1;
        for (const [index, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        }

        setActiveIndex(bestIndex);
      },
      { root: trackNode, threshold: [0.35, 0.5, 0.65, 0.8, 0.95] },
    );

    for (const slide of slides) {
      observer.observe(slide);
    }

    return () => observer.disconnect();
  }, [projectCount, trackNode]);

  return { activeIndex, setTrackNode };
}

export function HomeMobilePortfolio({ projects }: HomeMobilePortfolioProps): React.JSX.Element | null {
  const { homeCopy } = useHomeI18n();
  const { activeIndex, setTrackNode } = useActiveSlideIndex(projects.length);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="portfolio"
      className="home-mobile-portfolio"
      aria-label={homeCopy.sections.portfolio.eyebrow}
    >
      <div className="home-mobile-portfolio-heading-glow" aria-hidden>
        <Image src={staticAsset('/figma-home/rectangle17417.svg')} alt="" fill sizes="448px" />
      </div>

      <SectionHeading
        eyebrow={homeCopy.sections.portfolio.eyebrow}
        title={homeCopy.sections.portfolio.title}
        highlight={homeCopy.sections.portfolio.highlight}
      />

      <div
        ref={setTrackNode}
        className="home-mobile-portfolio-track"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={homeCopy.sections.portfolio.title}
      >
        {projects.map((project, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={`${project.title}-${index}`}
              className={
                isActive
                  ? 'home-mobile-portfolio-card is-active'
                  : 'home-mobile-portfolio-card'
              }
              data-portfolio-slide={index}
              aria-label={project.title}
              aria-current={isActive ? 'true' : undefined}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 767px) 78vw, 320px"
                quality={HOME_PORTFOLIO_IMAGE_QUALITY}
                loading={index === 0 ? 'eager' : 'lazy'}
                unoptimized={isRemoteImageUrl(project.image)}
                className="home-mobile-portfolio-image"
              />
            </article>
          );
        })}
      </div>

      <div className="home-mobile-portfolio-dots" aria-hidden>
        {projects.map((project, index) => (
          <span
            key={`${project.title}-dot-${index}`}
            className={
              index === activeIndex
                ? 'home-mobile-portfolio-dot is-active'
                : 'home-mobile-portfolio-dot'
            }
          />
        ))}
      </div>

      <div className="home-mobile-portfolio-cta">
        <ExploreButton href="/portfolio" label={homeCopy.actions.explore} />
      </div>
    </section>
  );
}

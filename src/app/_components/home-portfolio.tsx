'use client';

import Image from 'next/image';
import { HOME_IMAGE_QUALITY } from './home-constants';
import type { ProjectCard } from './home-data';
import { useHomeI18n } from './home-i18n-provider';
import { HomePortfolioCarousel } from './home-portfolio-carousel';
import { ExploreButton, HomeContainer, SectionHeading } from './home-ui';

type PortfolioCardProps = ProjectCard;

type PortfolioCarouselRowProps = {
  projects: ProjectCard[];
  direction: 'left' | 'right';
  rowKey: string;
};
type HomePortfolioProps = {
  bottomRow: ProjectCard[];
  topRow: ProjectCard[];
};

function PortfolioCard({
  title,
  image,
  imageClassName,
  width,
  height,
  radius,
}: PortfolioCardProps): React.JSX.Element {
  const cardStyle = {
    width: `calc(${width}px * var(--home-ui-scale))`,
    height: `calc(${height}px * var(--home-ui-scale))`,
    borderRadius: `calc(${radius}px * var(--home-ui-scale))`,
  };

  return (
    <article className="home-project-card" style={cardStyle}>
      <Image
        src={image}
        alt={title}
        fill
        sizes={`${width}px`}
        quality={HOME_IMAGE_QUALITY}
        loading="lazy"
        className={imageClassName ? `home-project-image ${imageClassName}` : 'home-project-image'}
      />
    </article>
  );
}

function PortfolioCarouselRow({
  projects,
  direction,
  rowKey,
}: PortfolioCarouselRowProps): React.JSX.Element {
  if (projects.length === 0) {
    return <div className={`home-portfolio-row home-portfolio-row--${direction}`} />;
  }

  const loopedProjects = [...projects, ...projects];

  return (
    <div className={`home-portfolio-row home-portfolio-row--${direction}`}>
      <div className="home-portfolio-track">
        {loopedProjects.map((project, index) => (
          <PortfolioCard
            key={`${rowKey}-${project.title}-${index}`}
            {...project}
          />
        ))}
      </div>
    </div>
  );
}

export function HomePortfolio({ bottomRow, topRow }: HomePortfolioProps): React.JSX.Element {
  const { homeCopy } = useHomeI18n();

  return (
    <section id="portfolio" className="home-section home-portfolio">
      <div className="home-portfolio-bg home-portfolio-bg-top" aria-hidden>
        <Image
          src="/figma-home/rectangle17411.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-portfolio-bg-top-image"
        />
      </div>
      <div className="home-portfolio-bg home-portfolio-bg-bottom" aria-hidden>
        <Image
          src="/figma-home/rectangle17411.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-portfolio-bg-bottom-image"
        />
      </div>
      <HomeContainer>
        <SectionHeading
          eyebrow={homeCopy.sections.portfolio.eyebrow}
          title={homeCopy.sections.portfolio.title}
          highlight={homeCopy.sections.portfolio.highlight}
        />
      </HomeContainer>
      <HomePortfolioCarousel>
        <PortfolioCarouselRow projects={topRow} direction="left" rowKey="top" />
        <PortfolioCarouselRow projects={bottomRow} direction="right" rowKey="bottom" />
      </HomePortfolioCarousel>
      <HomeContainer>
        <div className="home-section-cta">
          <ExploreButton href="/portfolio" label={homeCopy.actions.explore} />
        </div>
      </HomeContainer>
    </section>
  );
}

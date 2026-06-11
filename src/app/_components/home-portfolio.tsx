import Image from 'next/image';
import { portfolioBottomRow, portfolioTopRow } from './home-data';
import { ExploreButton, HomeContainer, SectionHeading } from './home-ui';

type PortfolioCardProps = {
  title: string;
  image: string;
  imageClassName?: string;
  width: number;
  height: number;
  radius: number;
  top: number;
  left: number;
};

function PortfolioCard({
  title,
  image,
  imageClassName,
  width,
  height,
  radius,
  top,
  left,
}: PortfolioCardProps): React.JSX.Element {
  const cardStyle = {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${radius}px`,
  };

  return (
    <article className="home-project-card" style={cardStyle}>
      <Image
        src={image}
        alt={title}
        fill
        sizes={`${width}px`}
        className={imageClassName ? `home-project-image ${imageClassName}` : 'home-project-image'}
      />
    </article>
  );
}

export function HomePortfolio(): React.JSX.Element {
  return (
    <section id="portfolio" className="home-section home-portfolio">
      <div className="home-portfolio-bg" aria-hidden>
        <Image
          src="/figma-home/rectangle17414.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-portfolio-bg-image"
        />
      </div>
      <HomeContainer>
        <SectionHeading eyebrow="PORTFOLIO" title="OUR" highlight=" PROJECTS" />
        <div className="home-portfolio-stage">
          {portfolioTopRow.map((project) => (
            <PortfolioCard key={`top-${project.title}-${project.left}`} {...project} />
          ))}
          {portfolioBottomRow.map((project) => (
            <PortfolioCard key={`bottom-${project.title}-${project.left}`} {...project} />
          ))}
        </div>
        <div className="home-section-cta">
          <ExploreButton href="#about" label="Explore" />
        </div>
      </HomeContainer>
    </section>
  );
}

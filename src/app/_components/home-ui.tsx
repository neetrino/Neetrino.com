import Image from 'next/image';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  align?: 'left' | 'center';
};

type ActionButtonProps = {
  href: string;
  label: string;
};

const serviceToneClasses = {
  light: 'home-service-card-light',
  orange: 'home-service-card-orange',
  dark: 'home-service-card-dark',
  blue: 'home-service-card-blue',
  ice: 'home-service-card-ice',
} as const;

const heroStatToneClasses = {
  orange: 'home-hero-stat-orange',
  light: 'home-hero-stat-light',
  purple: 'home-hero-stat-purple',
} as const;

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  align = 'left',
}: SectionHeadingProps): React.JSX.Element {
  const alignClass = align === 'center' ? 'home-section-heading-center' : 'home-section-heading-left';

  return (
    <div className={`home-section-heading ${alignClass}`}>
      <p className="home-eyebrow">{eyebrow}</p>
      <h2 className="home-section-title">
        {title} <span className="home-accent">{highlight}</span>
      </h2>
    </div>
  );
}

export function ContinueButton({ href, label }: ActionButtonProps): React.JSX.Element {
  return (
    <a href={href} className="home-btn home-btn-continue">
      <span>{label}</span>
      <Image src="/figma-home/safearea.svg" alt="" width={20} height={20} aria-hidden />
    </a>
  );
}

export function ExploreButton({ href, label }: ActionButtonProps): React.JSX.Element {
  return (
    <span className="home-btn-explore-wrap">
      <span className="home-btn-explore-flare" aria-hidden />
      <a href={href} className="home-btn home-btn-explore">
        <span className="home-btn-explore-glow" aria-hidden />
        <span className="home-btn-explore-label">{label}</span>
        <Image src="/figma-home/safearea1.svg" alt="" width={20} height={20} aria-hidden />
      </a>
    </span>
  );
}

export function ServiceToneClass(tone: keyof typeof serviceToneClasses): string {
  return serviceToneClasses[tone];
}

export function HeroStatToneClass(tone: keyof typeof heroStatToneClasses): string {
  return heroStatToneClasses[tone];
}

type FooterLinkColumnProps = {
  title: string;
  links: readonly string[];
};

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps): React.JSX.Element {
  return (
    <div>
      <h3 className="home-footer-column-title">{title}</h3>
      <ul className="home-footer-links">
        {links.map((link) => (
          <li key={link}>
            <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeContainer({ children }: { children: ReactNode }): React.JSX.Element {
  return <div className="home-container">{children}</div>;
}

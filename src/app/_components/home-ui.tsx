import { CdnImage as Image } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { FooterLink } from './home-data';

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
    <Link href={href} className="home-btn home-btn-continue">
      <span>{label}</span>
      <Image src={staticAsset("/figma-home/safearea.svg")} alt="" width={20} height={20} aria-hidden />
    </Link>
  );
}

export function ExploreButton({ href, label }: ActionButtonProps): React.JSX.Element {
  return (
    <span className="home-btn-explore-wrap">
      <span className="home-btn-explore-flare" aria-hidden />
      <Link href={href} className="home-btn home-btn-explore">
        <span className="home-btn-explore-label">{label}</span>
        <Image src={staticAsset("/figma-home/safearea1.svg")} alt="" width={20} height={20} aria-hidden />
      </Link>
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
  links: readonly FooterLink[];
};

export function FooterLinkColumn({ title, links }: FooterLinkColumnProps): React.JSX.Element {
  return (
    <div>
      <h3 className="home-footer-column-title">{title}</h3>
      <ul className="home-footer-links">
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeContainer({ children }: { children: ReactNode }): React.JSX.Element {
  return <div className="home-container">{children}</div>;
}

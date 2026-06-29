'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';

import type { GradientTone } from './about-data';
import { useHomeI18n } from './home-i18n-provider';
import { ExploreButton } from './home-ui';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { ServicesBakedBackground } from './services-baked-background';
import './services-background.css';
import './team.css';

const TEAM_IMAGE_SRC = staticAsset('/about/team-live.webp');

const statToneClass: Record<GradientTone, string> = {
  purple: 'team-stat-value--purple',
  orange: 'team-stat-value--orange',
  green: 'team-stat-value--green',
  peach: 'team-stat-value--peach',
  cyan: 'team-stat-value--cyan',
};

type TeamTitleProps = {
  plain: string;
  accent: string;
};

function TeamTitle({ plain, accent }: TeamTitleProps): React.JSX.Element {
  return (
    <h2 className="team-title" id="team-heading">
      <span className="team-title-main">
        {plain}
        <span className="team-title-accent">{accent}</span>
      </span>
      <span className="team-title-reflection" aria-hidden>
        {plain}
        <span className="team-title-accent">{accent}</span>
      </span>
    </h2>
  );
}

export function TeamPage(): React.JSX.Element {
  const { teamCopy } = useHomeI18n();
  const { hero, stats, showcase, values, cta } = teamCopy;

  return (
    <NeetrinoPageShell mainId="team-top" srOnlyTitle={hero.srOnlyTitle}>
      <ServicesBakedBackground />
      <section className="team-page svc-hero svc-hero--baked" aria-labelledby="team-heading">
        <div className="team-page-inner">
          <header className="team-hero">
            <p className="team-hero-kicker">{hero.kicker}</p>
            <TeamTitle plain={hero.title.plain} accent={hero.title.accent} />
            <p className="team-hero-intro">{hero.intro}</p>
          </header>

          <div className="team-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="team-stat">
                <span className={`team-stat-value ${statToneClass[stat.tone as GradientTone]}`}>
                  {stat.value}
                </span>
                <span className="team-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="team-showcase">
            <div className="team-showcase-copy">
              <h3 className="team-showcase-heading">{showcase.heading}</h3>
              <p className="team-showcase-text">{showcase.text}</p>
            </div>
            <div className="team-showcase-media">
              <div className="team-showcase-glow" aria-hidden />
              <div className="team-showcase-frame">
                <Image
                  src={TEAM_IMAGE_SRC}
                  alt={teamCopy.imageAlt}
                  fill
                  sizes="(max-width: 900px) 90vw, 520px"
                  priority
                  fetchPriority="high"
                  className="team-showcase-image"
                />
              </div>
            </div>
          </div>

          <div className="team-values" aria-label={values.ariaLabel}>
            {values.items.map((item) => (
              <article key={item.title} className="team-value-card">
                <h3 className="team-value-title">{item.title}</h3>
                <p className="team-value-text">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="team-cta">
            <ExploreButton href="/contact" label={cta.label} />
          </div>
        </div>
      </section>
      <div className="svc-footer-ray-wrap svc-footer-ray-wrap--baked" aria-hidden />
    </NeetrinoPageShell>
  );
}

'use client';

import { useHomeI18n } from '../home-i18n-provider';

export function BlogHero(): React.JSX.Element {
  const { blogCopy } = useHomeI18n();
  const { hero } = blogCopy;

  return (
    <header className="blog-hero">
      <p className="blog-hero-eyebrow">{hero.eyebrow}</p>
      <h1 className="blog-hero-title">{hero.title}</h1>
      <p className="blog-hero-subtitle">{hero.subtitle}</p>
    </header>
  );
}

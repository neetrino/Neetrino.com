'use client';

import { ExploreButton } from '../home-ui';
import { useHomeI18n } from '../home-i18n-provider';

export function BlogFooterCTA(): React.JSX.Element {
  const { blogCopy } = useHomeI18n();
  const { footerCta } = blogCopy;

  return (
    <section className="blog-footer-cta" aria-labelledby="blog-footer-cta-heading">
      <h2 id="blog-footer-cta-heading" className="blog-footer-cta-title">
        {footerCta.title}
      </h2>
      <p className="blog-footer-cta-subtitle">{footerCta.subtitle}</p>
      <ExploreButton href="/contact" label={footerCta.cta} />
    </section>
  );
}

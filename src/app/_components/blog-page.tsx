'use client';

import { ComingSoonPanel } from './coming-soon-panel';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import './blog.css';

export function BlogPage(): React.JSX.Element {
  const { blogCopy } = useHomeI18n();
  const label = `${blogCopy.comingSoon.line1} ${blogCopy.comingSoon.line2}`;

  return (
    <NeetrinoPageShell mainId="blog-top" srOnlyTitle={blogCopy.srOnlyTitle}>
      <section className="blog-page" aria-label={label}>
        <div className="blog-page-inner">
          <ComingSoonPanel label={blogCopy.comingSoon} />
        </div>
      </section>
    </NeetrinoPageShell>
  );
}

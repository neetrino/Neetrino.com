'use client';

import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import type { RefundMessages } from './refund-messages';
import './legal-pages.css';
import './refund.css';

type RefundSection = RefundMessages['sections'][number];

function RefundSectionBlock({ section }: { section: RefundSection }): React.JSX.Element {
  return (
    <section className="refund-section" id={section.id} aria-labelledby={`refund-${section.id}-title`}>
      <h2 id={`refund-${section.id}-title`} className="refund-section-title">
        {section.title}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="refund-paragraph">
          {paragraph}
        </p>
      ))}
      {section.subsections.map((subsection) => (
        <div key={subsection.title} className="refund-subsection">
          <h3 className="refund-subsection-title">{subsection.title}</h3>
          <ul className="refund-list">
            {subsection.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function RefundPage(): React.JSX.Element {
  const { refundCopy } = useHomeI18n();
  const { hero, sections, contact, closing, updatedLabel, updatedAt } = refundCopy;

  return (
    <NeetrinoPageShell mainId="refund-top" srOnlyTitle={hero.srOnlyTitle}>
      <article className="refund-page" aria-labelledby="refund-heading">
        <div className="home-page-glow" aria-hidden />
        <div className="refund-page-inner">
          <header className="refund-hero">
            <p className="refund-hero-kicker">{hero.kicker}</p>
            <h1 id="refund-heading" className="refund-hero-title">
              {hero.title}
            </h1>
            <p className="refund-updated">
              <span>{updatedLabel}</span>
              <time dateTime="2023-11-28">{updatedAt}</time>
            </p>
          </header>

          <div className="refund-sections">
            {sections.map((section) => (
              <RefundSectionBlock key={section.id} section={section} />
            ))}
          </div>

          <section className="refund-contact" aria-labelledby="refund-contact-title">
            <h2 id="refund-contact-title" className="refund-section-title">
              {contact.title}
            </h2>
            <p className="refund-paragraph">{contact.text}</p>
            <div className="refund-contact-actions">
              <a className="refund-contact-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <a className="refund-contact-link" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                {contact.phone}
              </a>
            </div>
          </section>

          <p className="refund-closing">{closing}</p>
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

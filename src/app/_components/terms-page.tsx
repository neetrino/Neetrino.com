'use client';

import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import type { TermsMessages } from './terms-messages';
import './legal-pages.css';
import './terms.css';

type TermsSection = TermsMessages['sections'][number];

function TermsSectionBlock({ section }: { section: TermsSection }): React.JSX.Element {
  return (
    <section className="terms-section" id={section.id} aria-labelledby={`terms-${section.id}-title`}>
      <h2 id={`terms-${section.id}-title`} className="terms-section-title">
        {section.title}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="terms-paragraph">
          {paragraph}
        </p>
      ))}
      {section.subsections.map((subsection) => (
        <div key={subsection.title} className="terms-subsection">
          <h3 className="terms-subsection-title">{subsection.title}</h3>
          <ul className="terms-list">
            {subsection.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function TermsPage(): React.JSX.Element {
  const { termsCopy } = useHomeI18n();
  const { hero, legal, sections, contact, updatedLabel, updatedAt } = termsCopy;

  return (
    <NeetrinoPageShell mainId="terms-top" srOnlyTitle={hero.srOnlyTitle}>
      <article className="terms-page" aria-labelledby="terms-heading">
        <div className="home-page-glow" aria-hidden />
        <div className="terms-page-inner">
          <header className="terms-hero">
            <p className="terms-hero-kicker">{hero.kicker}</p>
            <h1 id="terms-heading" className="terms-hero-title">
              {hero.title}
            </h1>
            <p className="terms-updated">
              <span>{updatedLabel}</span>
              <time dateTime="2023-11-28">{updatedAt}</time>
            </p>
          </header>

          <div className="terms-sections">
            {sections.map((section) => (
              <TermsSectionBlock key={section.id} section={section} />
            ))}
          </div>

          <section className="terms-contact" aria-labelledby="terms-contact-title">
            <h2 id="terms-contact-title" className="terms-section-title">
              {contact.title}
            </h2>
            <p className="terms-paragraph">{contact.text}</p>
            <div className="terms-contact-actions">
              <a className="terms-contact-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <a className="terms-contact-link" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                {contact.phone}
              </a>
            </div>
          </section>

          <aside className="terms-legal" aria-labelledby="terms-legal-title">
            <h2 id="terms-legal-title" className="terms-legal-title">
              {legal.title}
            </h2>
            <p className="terms-paragraph">{legal.lead}</p>
            <dl className="terms-legal-list">
              {legal.items.map((item) => (
                <div key={item.label} className="terms-legal-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="terms-legal-note">{legal.note}</p>
          </aside>
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

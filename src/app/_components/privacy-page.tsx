'use client';

import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import type { PrivacyMessages } from './privacy-messages';
import './legal-pages.css';
import './privacy.css';

type PrivacySection = PrivacyMessages['sections'][number];

function PrivacySectionBlock({ section }: { section: PrivacySection }): React.JSX.Element {
  return (
    <section className="privacy-section" id={section.id} aria-labelledby={`privacy-${section.id}-title`}>
      <h2 id={`privacy-${section.id}-title`} className="privacy-section-title">
        {section.title}
      </h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="privacy-paragraph">
          {paragraph}
        </p>
      ))}
      {section.subsections.map((subsection) => (
        <div key={subsection.title} className="privacy-subsection">
          <h3 className="privacy-subsection-title">{subsection.title}</h3>
          <ul className="privacy-list">
            {subsection.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function PrivacyPage(): React.JSX.Element {
  const { privacyCopy } = useHomeI18n();
  const { hero, legal, sections, contact, updatedLabel, updatedAt } = privacyCopy;

  return (
    <NeetrinoPageShell mainId="privacy-top" srOnlyTitle={hero.srOnlyTitle}>
      <article className="privacy-page" aria-labelledby="privacy-heading">
        <div className="home-page-glow" aria-hidden />
        <div className="privacy-page-inner">
          <header className="privacy-hero">
            <p className="privacy-hero-kicker">{hero.kicker}</p>
            <h1 id="privacy-heading" className="privacy-hero-title">
              {hero.title}
            </h1>
            <p className="privacy-updated">
              <span>{updatedLabel}</span>
              <time dateTime="2024-08-28">{updatedAt}</time>
            </p>
          </header>

          <aside className="privacy-legal" aria-labelledby="privacy-legal-title">
            <h2 id="privacy-legal-title" className="privacy-legal-title">
              {legal.title}
            </h2>
            <p className="privacy-paragraph">{legal.lead}</p>
            <dl className="privacy-legal-list">
              {legal.items.map((item) => (
                <div key={item.label} className="privacy-legal-item">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="privacy-legal-note">{legal.note}</p>
          </aside>

          <div className="privacy-sections">
            {sections.map((section) => (
              <PrivacySectionBlock key={section.id} section={section} />
            ))}
          </div>

          <section className="privacy-contact" aria-labelledby="privacy-contact-title">
            <h2 id="privacy-contact-title" className="privacy-section-title">
              {contact.title}
            </h2>
            <p className="privacy-paragraph">{contact.text}</p>
            <div className="privacy-contact-actions">
              <a className="privacy-contact-link" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <a className="privacy-contact-link" href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
                {contact.phone}
              </a>
            </div>
          </section>
        </div>
      </article>
    </NeetrinoPageShell>
  );
}

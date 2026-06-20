'use client';

import { useHomeI18n } from './home-i18n-provider';

export function AboutMobileLead(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-mobile-lead-section" aria-label={aboutData.ariaLead}>
      <p className="about-mobile-lead-copy">
        {aboutData.heroParagraph.map((part, index) =>
          part.bold ? (
            <strong key={index}>{part.text}</strong>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </p>
    </section>
  );
}

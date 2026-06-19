import { heroParagraph } from './about-data';

export function AboutMobileLead(): React.JSX.Element {
  return (
    <section className="about-mobile-lead-section" aria-label="About Neetrino platform">
      <p className="about-mobile-lead-copy">
        {heroParagraph.map((part, index) =>
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

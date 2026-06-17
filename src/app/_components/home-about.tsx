import { aboutParagraphs } from './home-data';
import { HomeAboutVisual } from './home-about-visual';
import { ExploreButton, HomeContainer } from './home-ui';

export function HomeAbout(): React.JSX.Element {
  return (
    <section id="about" className="home-section home-about">
      <HomeContainer>
        <div className="home-about-stage">
          <div className="home-about-copy">
            <div className="home-section-heading home-section-heading-left">
              <p className="home-eyebrow">BUILD WITH PURPOSE</p>
              <h2 className="home-section-title">
                WHO <span className="home-accent">WE</span> ARE
              </h2>
            </div>
            <div className="home-about-text">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph.parts.map((part) => part.text).join('')}>
                  {paragraph.parts.map((part) => {
                    if (part.bold === true) {
                      return (
                        <strong key={part.text} className="home-about-strong">
                          {part.text}
                        </strong>
                      );
                    }

                    if (part.bold === 'extrabold') {
                      return (
                        <strong key={part.text} className="home-about-extrabold">
                          {part.text}
                        </strong>
                      );
                    }

                    return <span key={part.text}>{part.text}</span>;
                  })}
                </p>
              ))}
            </div>
            <ExploreButton href="/contact" label="Explore" />
          </div>
          <HomeAboutVisual />
        </div>
      </HomeContainer>
    </section>
  );
}

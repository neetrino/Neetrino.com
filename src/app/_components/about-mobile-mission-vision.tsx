import { missionTextMobile, visionTextMobile } from './about-data';
import { MobileReflectTitle } from './about-mobile-ui';

export function AboutMobileMissionVision(): React.JSX.Element {
  return (
    <section className="about-mobile-mv-section" aria-label="Mission and vision">
      <article className="about-mobile-mv-article about-mobile-mv-article--mission">
        <MobileReflectTitle
          align="left"
          lines={[
            { text: 'THE ' },
            { text: 'MISSION', accent: true },
          ]}
        />
        <p className="about-mobile-mv-copy about-mobile-mv-copy--mission">{missionTextMobile}</p>
      </article>

      <article className="about-mobile-mv-article about-mobile-mv-article--vision">
        <MobileReflectTitle
          align="right"
          lines={[
            { text: 'THE ' },
            { text: 'VISION', accent: true },
          ]}
        />
        <p className="about-mobile-mv-copy about-mobile-mv-copy--vision">{visionTextMobile}</p>
      </article>
    </section>
  );
}

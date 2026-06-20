'use client';

import { useHomeI18n } from './home-i18n-provider';
import { MobileReflectTitle } from './about-mobile-ui';

export function AboutMobileMissionVision(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-mobile-mv-section" aria-label={aboutData.ariaMissionVision}>
      <article className="about-mobile-mv-article about-mobile-mv-article--mission">
        <MobileReflectTitle
          align="left"
          lines={[
            { text: aboutData.missionTitle.plain },
            { text: aboutData.missionTitle.accent, accent: true },
          ]}
        />
        <p className="about-mobile-mv-copy about-mobile-mv-copy--mission">{aboutData.missionTextMobile}</p>
      </article>

      <article className="about-mobile-mv-article about-mobile-mv-article--vision">
        <MobileReflectTitle
          align="right"
          lines={[
            { text: aboutData.visionTitle.plain },
            { text: aboutData.visionTitle.accent, accent: true },
          ]}
        />
        <p className="about-mobile-mv-copy about-mobile-mv-copy--vision">{aboutData.visionTextMobile}</p>
      </article>
    </section>
  );
}

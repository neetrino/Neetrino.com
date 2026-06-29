'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';

import { useHomeI18n } from './home-i18n-provider';
import { MobileReflectTitle } from './about-mobile-ui';

type WhyRowProps = {
  illustrationClass: string;
  imageSrc: string;
  imageSizes: string;
  align: 'left' | 'right';
  lead: string;
  rest: string;
  restLines?: string[];
};

const WHY_ROW_LAYOUT = [
  {
    illustrationClass: 'about-mobile-why-illustration--rocket',
    imageSizes: '292px',
    align: 'left' as const,
  },
  {
    illustrationClass: 'about-mobile-why-illustration--palette',
    imageSizes: '240px',
    align: 'right' as const,
  },
  {
    illustrationClass: 'about-mobile-why-illustration--lightning',
    imageSizes: '300px',
    align: 'left' as const,
  },
  {
    illustrationClass: 'about-mobile-why-illustration--helmet',
    imageSizes: '240px',
    align: 'right' as const,
  },
];

function AboutMobileWhyRow({
  illustrationClass,
  imageSrc,
  imageSizes,
  align,
  lead,
  rest,
  restLines,
}: WhyRowProps): React.JSX.Element {
  const rowClass =
    align === 'left' ? 'about-mobile-why-row about-mobile-why-row--left' : 'about-mobile-why-row about-mobile-why-row--right';

  return (
    <div className={rowClass}>
      <div className={`about-mobile-why-illustration ${illustrationClass}`}>
        <Image src={imageSrc} alt="" fill sizes={imageSizes} className="about-mobile-why-img" />
      </div>
      <div className="about-mobile-why-copy">
        <p>{lead}</p>
        {restLines ? (
          <p className="about-mobile-why-copy-rest">{restLines.join('\n')}</p>
        ) : (
          <p>{rest}</p>
        )}
      </div>
    </div>
  );
}

export function AboutMobileWhy(): React.JSX.Element {
  const { aboutData } = useHomeI18n();

  return (
    <section className="about-mobile-why-section" aria-labelledby="about-mobile-why-title">
      <div className="about-mobile-why-panel" aria-hidden>
        <Image
          src={staticAsset("/about/why-panel-mobile.svg")}
          alt=""
          fill
          sizes="417px"
          loading="lazy"
          fetchPriority="low"
          className="about-mobile-why-panel-img"
        />
      </div>

      <MobileReflectTitle
        className="about-mobile-why-title"
        align="left"
        lines={[
          { text: aboutData.whyTitle.plain },
          { text: aboutData.whyTitle.accent, accent: true },
          { text: aboutData.whyTitle.trailing ?? '' },
        ]}
      />

      <div className="about-mobile-why-list">
        {aboutData.whyMobileRows.map((row, index) => {
          const layout = WHY_ROW_LAYOUT[index];
          const illustration = aboutData.whyIllustrations[index];

          if (!layout || !illustration) {
            return null;
          }

          return (
            <AboutMobileWhyRow
              key={row.lead}
              illustrationClass={layout.illustrationClass}
              imageSrc={illustration.src}
              imageSizes={layout.imageSizes}
              align={layout.align}
              lead={row.lead}
              rest={row.rest}
              restLines={row.restLines}
            />
          );
        })}
      </div>
    </section>
  );
}

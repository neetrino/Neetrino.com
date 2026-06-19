import Image from 'next/image';

import { whyFeatures, whyIllustrations } from './about-data';
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
  return (
    <section className="about-mobile-why-section" aria-labelledby="about-mobile-why-title">
      <div className="about-mobile-why-panel" aria-hidden>
        <Image
          src="/about/why-panel-mobile.svg"
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
          { text: 'WHY ' },
          { text: 'CHOOSE', accent: true },
          { text: ' US?' },
        ]}
      />

      <div className="about-mobile-why-list">
        <AboutMobileWhyRow
          illustrationClass="about-mobile-why-illustration--rocket"
          imageSrc={whyIllustrations[0].src}
          imageSizes="292px"
          align="left"
          lead={whyFeatures[0].lead}
          rest={whyFeatures[0].rest}
          restLines={['execution delivered in', 'record time']}
        />
        <AboutMobileWhyRow
          illustrationClass="about-mobile-why-illustration--palette"
          imageSrc={whyIllustrations[1].src}
          imageSizes="240px"
          align="right"
          lead={whyFeatures[1].lead}
          rest={whyFeatures[1].rest}
        />
        <AboutMobileWhyRow
          illustrationClass="about-mobile-why-illustration--lightning"
          imageSrc={whyIllustrations[2].src}
          imageSizes="300px"
          align="left"
          lead="Websites created"
          rest=""
          restLines={['10 times faster than', 'traditional methods']}
        />
        <AboutMobileWhyRow
          illustrationClass="about-mobile-why-illustration--helmet"
          imageSrc={whyIllustrations[3].src}
          imageSizes="240px"
          align="right"
          lead={whyFeatures[3].lead}
          rest={whyFeatures[3].rest}
        />
      </div>
    </section>
  );
}

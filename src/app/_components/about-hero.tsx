'use client';

import Image from 'next/image';
import { staticAsset } from '@/lib/static-asset';
import { useHomeI18n } from './home-i18n-provider';
import { GradientStat } from './about-ui';

export function AboutHero(): React.JSX.Element {
  const { aboutData } = useHomeI18n();
  const { heroHeadline, heroIntroLeft, heroIntroRight, heroParagraph, heroStats } = aboutData;

  return (
    <section className="about-hero" aria-labelledby="about-title">
      <div className="about-robot" aria-hidden>
        <Image
          src={staticAsset("/about/robot.webp")}
          alt=""
          fill
          sizes="620px"
          priority
          fetchPriority="high"
          className="about-robot-img"
        />
      </div>

      <div className="about-frost" aria-hidden />

      <h1 id="about-title" className="about-headline">
        <span className="about-headline-line about-headline-1">
          {heroHeadline.line1Plain} <em>{heroHeadline.line1Accent}</em>
        </span>
        <span className="about-headline-line about-headline-2">{heroHeadline.line2}</span>
        <span className="about-headline-line about-headline-3">{heroHeadline.line3}</span>
        <span className="about-headline-line about-headline-4">
          <em>{heroHeadline.line4}</em>
        </span>
      </h1>

      <p className="about-intro about-intro-right">{heroIntroRight}</p>
      <p className="about-intro about-intro-left">{heroIntroLeft}</p>

      <Image
        src={staticAsset("/about/hero-line.svg")}
        alt=""
        width={1352}
        height={23}
        loading="lazy"
        fetchPriority="low"
        className="about-hero-line"
        aria-hidden
      />

      <div className="about-hero-stats">
        {heroStats.map((stat) => (
          <GradientStat key={stat.label} {...stat} />
        ))}
      </div>

      <p className="about-lead">
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

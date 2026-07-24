import type { AboutStat, GradientTone } from './about-data';
import { isBrandAccentText } from './about-ui';

type MobileReflectTitleProps = {
  className?: string;
  align?: 'left' | 'center' | 'right';
  stacked?: boolean;
  showMirror?: boolean;
  titleId?: string;
  lines: Array<{ text: string; accent?: boolean }>;
};

const heroStatToneClass: Record<GradientTone, string> = {
  purple: 'about-mobile-hero-stat-value--purple',
  orange: 'about-mobile-hero-stat-value--orange',
  green: 'about-mobile-hero-stat-value--green',
  peach: 'about-mobile-hero-stat-value--peach',
  cyan: 'about-mobile-hero-stat-value--cyan',
};

const impactStatToneClass: Record<GradientTone, string> = {
  purple: 'about-mobile-impact-stat-value--purple',
  orange: 'about-mobile-impact-stat-value--orange',
  green: 'about-mobile-impact-stat-value--green',
  peach: 'about-mobile-impact-stat-value--peach',
  cyan: 'about-mobile-impact-stat-value--cyan',
};

/** Section title with blurred mirror reflection (production mobile pattern). */
export function MobileReflectTitle({
  className = '',
  align = 'left',
  stacked = false,
  showMirror = true,
  titleId,
  lines,
}: MobileReflectTitleProps): React.JSX.Element {
  const alignClass = `about-mobile-reflect-title--${align}`;
  const lineClass = stacked
    ? 'about-mobile-reflect-title-line about-mobile-reflect-title-line--stacked'
    : 'about-mobile-reflect-title-line';

  const renderLines = (): React.ReactNode =>
    lines.map((line) => {
      const accentClass = line.accent
        ? isBrandAccentText(line.text)
          ? ' about-mobile-reflect-title-accent about-mobile-reflect-title-accent--brand'
          : ' about-mobile-reflect-title-accent'
        : '';

      return (
        <span key={line.text} className={`${lineClass}${accentClass}`}>
          {line.text}
        </span>
      );
    });

  return (
    <div className={`about-mobile-reflect-title ${alignClass} ${className}`.trim()}>
      <h2 id={titleId} className="about-mobile-reflect-title-main">{renderLines()}</h2>
      {showMirror ? (
        <div className="about-mobile-reflect-title-mirror" aria-hidden>
          <div className="about-mobile-reflect-title-mirror-inner">{renderLines()}</div>
        </div>
      ) : null}
    </div>
  );
}

/** Hero stats row inside the frosted panel. */
export function MobileHeroStat({ value, label, tone }: AboutStat): React.JSX.Element {
  return (
    <div className={`about-mobile-hero-stat about-mobile-hero-stat--${tone}`}>
      <div className="about-mobile-hero-stat-value-wrap">
        <span className="about-mobile-hero-stat-glow" aria-hidden />
        <p className={`about-mobile-hero-stat-value ${heroStatToneClass[tone]}`}>{value}</p>
      </div>
      <p className="about-mobile-hero-stat-label">{label}</p>
    </div>
  );
}

/** Impact stats below the world map. */
export function MobileImpactStat({ value, label, tone }: AboutStat): React.JSX.Element {
  return (
    <div className="about-mobile-impact-stat">
      <div className="about-mobile-impact-stat-value-wrap">
        <span
          className={`about-mobile-impact-stat-blur ${impactStatToneClass[tone]}`}
          aria-hidden
        >
          {value}
        </span>
        <p className={`about-mobile-impact-stat-value ${impactStatToneClass[tone]}`}>{value}</p>
      </div>
      <p className="about-mobile-impact-stat-label">{label}</p>
    </div>
  );
}

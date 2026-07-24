import type { AboutStat, GradientTone } from './about-data';

const toneClass: Record<GradientTone, string> = {
  purple: 'about-grad-purple',
  orange: 'about-grad-orange',
  green: 'about-grad-green',
  peach: 'about-grad-peach',
  cyan: 'about-grad-cyan',
};

/** Latin brand wordmark — keep Megatrox styling in every locale. */
export function isBrandAccentText(text: string): boolean {
  return /^NEETRINO$/i.test(text.trim());
}

export function GradientStat({ value, label, tone }: AboutStat): React.JSX.Element {
  return (
    <div className="about-stat">
      <span className={`about-stat-value ${toneClass[tone]}`}>{value}</span>
      <span className="about-stat-label">{label}</span>
    </div>
  );
}

type ReflectTitleProps = {
  className: string;
  plain: string;
  accent: string;
  trailing?: string;
};

/** Italic section title with the blurred mirror reflection used across the design. */
export function ReflectTitle({
  className,
  plain,
  accent,
  trailing,
}: ReflectTitleProps): React.JSX.Element {
  const accentClass = isBrandAccentText(accent)
    ? 'about-accent about-accent--brand'
    : 'about-accent';

  return (
    <h2 className={`about-title ${className}`}>
      <span className="about-title-main">
        {plain}
        <span className={accentClass}>{accent}</span>
        {trailing}
      </span>
      <span className="about-title-reflection" aria-hidden>
        {plain}
        <span className={accentClass}>{accent}</span>
        {trailing}
      </span>
    </h2>
  );
}

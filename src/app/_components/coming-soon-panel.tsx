import './coming-soon.css';

type ComingSoonLabel = {
  line1: string;
  line2: string;
};

type ComingSoonPanelProps = {
  label: ComingSoonLabel;
};

/** Centered under-construction mark for paused marketing pages. */
export function ComingSoonPanel({ label }: ComingSoonPanelProps): React.JSX.Element {
  const ariaLabel = `${label.line1} ${label.line2}`;

  return (
    <div className="coming-soon">
      <div className="coming-soon-glow" aria-hidden />
      <p className="coming-soon-mark" aria-label={ariaLabel}>
        <span className="coming-soon-label">
          <span>{label.line1}</span>
          <span>{label.line2}</span>
        </span>
        <span className="coming-soon-reflection" aria-hidden>
          <span>{label.line1}</span>
          <span>{label.line2}</span>
        </span>
      </p>
      <span className="coming-soon-rule" aria-hidden />
    </div>
  );
}

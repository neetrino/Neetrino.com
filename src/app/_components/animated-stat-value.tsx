'use client';

import { useEffect, useRef, useState } from 'react';

import { useCountUp } from './use-count-up';

type ParsedStatValue = {
  target: number;
  suffix: string;
};

type AnimatedStatValueProps = {
  value: string;
  className?: string;
};

function parseStatValue(raw: string): ParsedStatValue | null {
  const match = raw.match(/^(\d+)(.*)$/);
  if (match === null) {
    return null;
  }

  return {
    target: Number(match[1]),
    suffix: match[2],
  };
}

/** Counts up from 0 when the stat enters the viewport (reload or in-page navigation). */
export function AnimatedStatValue({ value, className }: AnimatedStatValueProps): React.JSX.Element {
  const parsed = parseStatValue(value);
  const elementRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const count = useCountUp(parsed?.target ?? 0, isVisible && parsed !== null);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting === true) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (parsed === null) {
    return <p className={className}>{value}</p>;
  }

  const displayValue = isVisible ? `${count}${parsed.suffix}` : `0${parsed.suffix}`;

  return (
    <p ref={elementRef} className={className}>
      {displayValue}
    </p>
  );
}

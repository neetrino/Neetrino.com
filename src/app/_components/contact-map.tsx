'use client';

import { useEffect, useRef, useState } from 'react';

type ContactMapProps = {
  mapUrl: string;
};

const MAP_LOAD_THRESHOLD = 0.45;

export function ContactMap({ mapUrl }: ContactMapProps): React.JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || shouldLoadMap) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { threshold: MAP_LOAD_THRESHOLD },
    );

    observer.observe(map);
    return () => observer.disconnect();
  }, [shouldLoadMap]);

  return (
    <div ref={mapRef} className="contact-map">
      {shouldLoadMap ? (
        <iframe
          title="Neetrino IT Company location map"
          src={mapUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="contact-map-placeholder" aria-label="Neetrino IT Company location map" />
      )}
      <span>Neetrino HQ</span>
    </div>
  );
}

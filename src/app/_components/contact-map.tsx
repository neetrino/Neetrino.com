'use client';

import { useEffect, useRef, useState } from 'react';

/** Embedded Google Maps iframe for the Neetrino office. */
export const OFFICE_MAP_EMBED_URL =
  'https://www.google.com/maps?q=40.1684703,44.4458742&z=15&output=embed';

/** Opens the Neetrino office place page in Google Maps. */
export const OFFICE_MAP_LINK =
  'https://www.google.com/maps/place/Neetrino+IT+Company/@40.1684411,44.3634731,12z/data=!4m6!3m5!1s0x6a7d86fee77d7891:0x1a931845d2acd1e2!8m2!3d40.1684703!4d44.4458742!16s%2Fg%2F11tjg95w_6?entry=tts';

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

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  GA_SCRIPT_READY_ATTEMPTS,
  GA_SCRIPT_READY_DELAY_MS,
  buildGaPageView,
  createPageViewGate,
  shouldTrackAnalyticsPath,
  isAnalyticsConsentGranted,
  readAnalyticsConsent,
  sendGaPageView,
} from '@/lib/analytics/ga4';

const pageViewGate = createPageViewGate();

type GoogleAnalyticsRouteTrackerProps = {
  measurementId: string;
};

function publishPageView(measurementId: string, pathname: string, search: string): boolean {
  if (!isAnalyticsConsentGranted(readAnalyticsConsent(window.localStorage))) {
    return true;
  }

  if (typeof window.gtag !== 'function') {
    return false;
  }

  const view = buildGaPageView({
    origin: window.location.origin,
    pathname,
    search,
    title: document.title,
  });

  if (!view || !pageViewGate(view.page_location)) {
    return true;
  }

  sendGaPageView(measurementId, view, window.gtag);
  return true;
}

function useGaPageViews(measurementId: string, pathname: string, search: string): boolean {
  const [loadScript, setLoadScript] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;

    const publish = (): void => {
      if (cancelled) {
        return;
      }

      if (!isAnalyticsConsentGranted(readAnalyticsConsent(window.localStorage))) {
        return;
      }

      if (!shouldTrackAnalyticsPath(pathname)) {
        return;
      }

      setLoadScript(true);

      if (publishPageView(measurementId, pathname, search)) {
        return;
      }

      if (attempts >= GA_SCRIPT_READY_ATTEMPTS) {
        return;
      }

      attempts += 1;
      window.setTimeout(publish, GA_SCRIPT_READY_DELAY_MS);
    };

    publish();

    return () => {
      cancelled = true;
    };
  }, [measurementId, pathname, search]);

  return loadScript;
}

/** Sends one GA4 page_view for the first load and each App Router navigation. */
export function GoogleAnalyticsRouteTracker({
  measurementId,
}: GoogleAnalyticsRouteTrackerProps): React.JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const loadScript = useGaPageViews(measurementId, pathname, search);

  if (!loadScript) {
    return null;
  }

  return (
    <Script
      id="ga4-loader"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
    />
  );
}

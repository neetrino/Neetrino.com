import Script from 'next/script';
import { Suspense } from 'react';
import { buildGaInitScript, resolveGaMeasurementId } from '@/lib/analytics/ga4';
import { GoogleAnalyticsRouteTracker } from './google-analytics-route-tracker';

/** GA4 loader. Automatic page views are off; the route tracker owns page_view. */
export function GoogleAnalytics(): React.JSX.Element {
  const measurementId = resolveGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

  return (
    <>
      <Script id="ga4-init" strategy="beforeInteractive">
        {buildGaInitScript(measurementId)}
      </Script>
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker measurementId={measurementId} />
      </Suspense>
    </>
  );
}

import { logger } from '@/lib/logger';

/** Public GA4 measurement id. Override with NEXT_PUBLIC_GA_MEASUREMENT_ID. */
export const DEFAULT_GA_MEASUREMENT_ID = 'G-J4Z8722T2P';

/**
 * Written only by a future consent banner. Absent or any value other than
 * "denied" allows analytics, matching the site today (no banner; Vercel Analytics always on).
 */
export const ANALYTICS_CONSENT_STORAGE_KEY = 'neetrino.analytics-consent';

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/;
const GA_READY_ATTEMPTS = 20;
const GA_READY_DELAY_MS = 100;

const CAMPAIGN_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id',
  'utm_source_platform',
  'utm_campaign_id',
  'utm_creative_format',
  'utm_marketing_tactic',
  'gclid',
  'gbraid',
  'wbraid',
  'dclid',
  'gad_source',
  'gad_campaignid',
  'srsltid',
] as const;

type GtagParamValue = string | boolean;

export type GtagFn = (
  command: 'js' | 'config' | 'event',
  target: string | Date,
  params?: Record<string, GtagParamValue>,
) => void;

export type GaPageView = {
  page_path: string;
  page_location: string;
  page_title: string;
};

type PageViewInput = {
  origin: string;
  pathname: string;
  search: string;
  title: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/** Accepts a public measurement id. Invalid overrides fall back to the project id. */
export function resolveGaMeasurementId(rawValue: string | undefined): string {
  const trimmed = rawValue?.trim() ?? '';
  if (!trimmed) {
    return DEFAULT_GA_MEASUREMENT_ID;
  }

  if (GA_MEASUREMENT_ID_PATTERN.test(trimmed)) {
    return trimmed;
  }

  logger.warn('Ignoring invalid Google Analytics measurement id.', { measurementId: trimmed });
  return DEFAULT_GA_MEASUREMENT_ID;
}

/** Loads gtag without an automatic page view so route changes are not double-counted. */
export function buildGaInitScript(measurementId: string): string {
  const id = JSON.stringify(measurementId);
  const consentKey = JSON.stringify(ANALYTICS_CONSENT_STORAGE_KEY);
  return `(function(){try{if(localStorage.getItem(${consentKey})==='denied')return;}catch(e){}var p=location.pathname;if(p==='/admin'||p.indexOf('/admin/')===0||p==='/admin-login'||p.indexOf('/admin-login/')===0||p.indexOf('/p/')===0)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',${id},{send_page_view:false});})();`;
}

/** Explicit opt-out only. No stored choice means analytics stays enabled. */
export function isAnalyticsConsentGranted(storedValue: string | null): boolean {
  return storedValue !== 'denied';
}

export function readAnalyticsConsent(storage: Pick<Storage, 'getItem'> | null): string | null {
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Skips staff and secret payment URLs so those paths are not sent to GA4. */
export function shouldTrackAnalyticsPath(pathname: string): boolean {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return false;
  }

  if (pathname === '/admin-login' || pathname.startsWith('/admin-login/')) {
    return false;
  }

  return !pathname.startsWith('/p/');
}

function campaignSearch(search: string): string {
  const source = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const campaign = new URLSearchParams();

  for (const key of CAMPAIGN_QUERY_KEYS) {
    const value = source.get(key);
    if (value) {
      campaign.set(key, value);
    }
  }

  return campaign.toString();
}

/**
 * Builds one page_view payload. Campaign parameters stay on the URL so GA4
 * attributes the session; unrelated query values are omitted.
 */
export function buildGaPageView(input: PageViewInput): GaPageView | null {
  if (!shouldTrackAnalyticsPath(input.pathname)) {
    return null;
  }

  const origin = input.origin.replace(/\/+$/, '');
  const query = campaignSearch(input.search);
  const pagePath = query ? `${input.pathname}?${query}` : input.pathname;

  return {
    page_path: pagePath,
    page_location: `${origin}${pagePath}`,
    page_title: input.title,
  };
}

/** Returns true only when this location has not already been sent. */
export function createPageViewGate(): (pageLocation: string) => boolean {
  let lastPageLocation = '';

  return (pageLocation: string): boolean => {
    if (pageLocation === lastPageLocation) {
      return false;
    }

    lastPageLocation = pageLocation;
    return true;
  };
}

export function sendGaPageView(measurementId: string, view: GaPageView, gtag: GtagFn): void {
  gtag('event', 'page_view', {
    send_to: measurementId,
    page_location: view.page_location,
    page_path: view.page_path,
    page_title: view.page_title,
  });
}

export const GA_SCRIPT_READY_ATTEMPTS = GA_READY_ATTEMPTS;
export const GA_SCRIPT_READY_DELAY_MS = GA_READY_DELAY_MS;

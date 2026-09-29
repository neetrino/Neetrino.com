import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  DEFAULT_GA_MEASUREMENT_ID,
  buildGaInitScript,
  buildGaPageView,
  createPageViewGate,
  isAnalyticsConsentGranted,
  readAnalyticsConsent,
  resolveGaMeasurementId,
  sendGaPageView,
  shouldTrackAnalyticsPath,
  type GtagFn,
} from './ga4';

test('measurement id falls back to the Neetrino GA4 property', () => {
  assert.equal(resolveGaMeasurementId(undefined), DEFAULT_GA_MEASUREMENT_ID);
  assert.equal(resolveGaMeasurementId('  '), DEFAULT_GA_MEASUREMENT_ID);
  assert.equal(resolveGaMeasurementId('not-an-id'), DEFAULT_GA_MEASUREMENT_ID);
  assert.equal(resolveGaMeasurementId('G-CUSTOM123'), 'G-CUSTOM123');
});

test('init script disables the automatic page view', () => {
  const script = buildGaInitScript(DEFAULT_GA_MEASUREMENT_ID);
  assert.match(script, /send_page_view:false/);
  assert.match(script, /G-J4Z8722T2P/);
  assert.match(script, /neetrino\.analytics-consent/);
  assert.match(script, /==='denied'/);
  assert.match(script, /\/admin-login/);
  assert.match(script, /\/p\//);
});

test('consent allows analytics unless the stored choice is denied', () => {
  assert.equal(isAnalyticsConsentGranted(null), true);
  assert.equal(isAnalyticsConsentGranted('granted'), true);
  assert.equal(isAnalyticsConsentGranted('denied'), false);
  assert.equal(
    readAnalyticsConsent({
      getItem: (key) => (key === ANALYTICS_CONSENT_STORAGE_KEY ? 'denied' : null),
    }),
    'denied',
  );
  assert.equal(
    readAnalyticsConsent({
      getItem: () => {
        throw new Error('storage blocked');
      },
    }),
    null,
  );
});

test('staff and secret payment routes are not tracked', () => {
  assert.equal(shouldTrackAnalyticsPath('/'), true);
  assert.equal(shouldTrackAnalyticsPath('/services'), true);
  assert.equal(shouldTrackAnalyticsPath('/admin'), false);
  assert.equal(shouldTrackAnalyticsPath('/admin/orders'), false);
  assert.equal(shouldTrackAnalyticsPath('/admin-login'), false);
  assert.equal(shouldTrackAnalyticsPath('/p/secret-slug'), false);
  assert.equal(shouldTrackAnalyticsPath('/portfolio'), true);
});

test('utm parameters are kept and unrelated query values are dropped', () => {
  const view = buildGaPageView({
    origin: 'https://www.neetrino.com/',
    pathname: '/services',
    search: 'utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=web&utm_content=hero&payment=secret',
    title: 'Services',
  });

  assert.deepEqual(view, {
    page_title: 'Services',
    page_path:
      '/services?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=web&utm_content=hero',
    page_location:
      'https://www.neetrino.com/services?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=web&utm_content=hero',
  });
});

test('google click ids stay on the page location', () => {
  const view = buildGaPageView({
    origin: 'https://www.neetrino.com',
    pathname: '/',
    search: '?gclid=abc123&fbclid=drop-me',
    title: 'Neetrino',
  });

  assert.equal(view?.page_path, '/?gclid=abc123');
  assert.equal(view?.page_location, 'https://www.neetrino.com/?gclid=abc123');
});

test('excluded routes produce no page view', () => {
  assert.equal(
    buildGaPageView({
      origin: 'https://www.neetrino.com',
      pathname: '/p/secret',
      search: 'utm_source=email&payment=1',
      title: 'Pay',
    }),
    null,
  );
});

test('route changes send one page view per location', () => {
  const gate = createPageViewGate();
  const home = 'https://www.neetrino.com/?utm_source=newsletter';
  const services = 'https://www.neetrino.com/services?utm_source=newsletter';

  assert.equal(gate(home), true);
  assert.equal(gate(home), false);
  assert.equal(gate(services), true);
  assert.equal(gate(home), true);
});

test('page view event is sent to the configured measurement id', () => {
  const calls: Array<{ command: string; target: string | Date; params?: Record<string, string | boolean> }> = [];
  const gtag: GtagFn = (command, target, params) => {
    calls.push({ command, target, params });
  };

  sendGaPageView(
    DEFAULT_GA_MEASUREMENT_ID,
    {
      page_path: '/contact?utm_source=google',
      page_location: 'https://www.neetrino.com/contact?utm_source=google',
      page_title: 'Contact',
    },
    gtag,
  );

  assert.deepEqual(calls, [
    {
      command: 'event',
      target: 'page_view',
      params: {
        send_to: DEFAULT_GA_MEASUREMENT_ID,
        page_location: 'https://www.neetrino.com/contact?utm_source=google',
        page_path: '/contact?utm_source=google',
        page_title: 'Contact',
      },
    },
  ]);
});

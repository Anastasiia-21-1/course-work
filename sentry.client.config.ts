import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://36e77e724aa1d9a537b4734086422d09@o4507868313157632.ingest.de.sentry.io/4507868313550928',
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: false,
});

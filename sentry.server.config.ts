import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://36e77e724aa1d9a537b4734086422d09@o4507868313157632.ingest.de.sentry.io/4507868313550928',
  tracesSampleRate: 1,
  debug: false,
});

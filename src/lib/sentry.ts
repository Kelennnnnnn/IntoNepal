import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

export function initSentry() {
  if (dsn && dsn.trim() !== '') {
    Sentry.init({
      dsn: dsn.trim(),
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: 0.2,
      environment: import.meta.env.MODE || 'production',
      beforeSend(event) {
        // Strip sensitive user fields like passwords or auth tokens if present
        if (event.request?.headers) {
          delete event.request.headers['authorization'];
        }
        return event;
      },
    });
  } else {
    // Graceful fallback in development or when DSN is not provided
    console.info('[Sentry] DSN not configured, client error logging active in local console.');
  }
}

export { Sentry };

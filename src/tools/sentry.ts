import * as Sentry from '@sentry/browser';

Sentry.init({
  environment: window.env.VITE_ENVIRONMENT_NAME,
  dsn: window.env.VITE_SENTRY_DSN,
  release: `quizlord-client@${window.env.VITE_QUIZLORD_VERSION}`,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [window.env.VITE_GRAPH_API_URI],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

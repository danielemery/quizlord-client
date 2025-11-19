const { z } = require('zod');

module.exports = z.object({
  VITE_GRAPH_API_URI: z.url(),
  VITE_AUTH0_DOMAIN: z.string().regex(z.regexes.domain),
  VITE_AUTH0_CLIENT_ID: z.string(),
  VITE_AUTH0_AUDIENCE: z.url(),
  VITE_QUIZLORD_VERSION: z.string().default('development'),
  VITE_ENVIRONMENT_NAME: z.string().default('local'),
  VITE_SENTRY_DSN: z.httpUrl().optional(),
});

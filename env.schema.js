const Joi = require('joi');

module.exports = Joi.object()
  .keys({
    VITE_GRAPH_API_URI: Joi.string().uri().required(),
    VITE_AUTH0_DOMAIN: Joi.string().required(),
    VITE_AUTH0_CLIENT_ID: Joi.string().required(),
    VITE_AUTH0_AUDIENCE: Joi.string().uri().required(),
    VITE_QUIZLORD_VERSION: Joi.string().default('development'),
    VITE_ENVIRONMENT_NAME: Joi.string().default('local'),
    VITE_SENTRY_DSN: Joi.string().uri().optional(),
  })
  .required();

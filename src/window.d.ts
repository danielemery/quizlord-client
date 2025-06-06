export interface IEnvValues {
  VITE_GRAPH_API_URI: string;
  VITE_AUTH0_DOMAIN: string;
  VITE_AUTH0_CLIENT_ID: string;
  VITE_AUTH0_AUDIENCE: string;
  VITE_QUIZLORD_VERSION: string;
  VITE_ENVIRONMENT_NAME: string;
  VITE_SENTRY_DSN?: string;
}

declare global {
  interface Window {
    env: IEnvValues;
  }
}

import { BrowserRouter } from 'react-router-dom';

import { Auth0Provider } from '@auth0/auth0-react';
import { render } from 'preact';

import AuthorizedApolloProvider from './AuthorizedApolloProvider';
import QuizlordProvider from './QuizlordProvider';
import { App } from './app';
import './index.css';
import { RXDBProvider } from './rxdb/RXDBProvider';
import './tools/sentry';

render(
  <Auth0Provider
    domain={window.env.VITE_AUTH0_DOMAIN}
    clientId={window.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: window.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    }}
    cacheLocation='localstorage'
  >
    <BrowserRouter>
      <AuthorizedApolloProvider>
        <QuizlordProvider>
          <RXDBProvider>
            <App />
          </RXDBProvider>
        </QuizlordProvider>
      </AuthorizedApolloProvider>
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('app')!,
);

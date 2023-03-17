import { BrowserRouter } from 'react-router-dom';

import { Auth0Provider } from '@auth0/auth0-react';
import { render } from 'preact';

import AuthorizedApolloProvider from './AuthorizedApolloProvider';
import QuizlordProvider from './QuizlordProvider';
import { App } from './app';
import './index.css';

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
          <App />
        </QuizlordProvider>
      </AuthorizedApolloProvider>
    </BrowserRouter>
  </Auth0Provider>,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!,
);

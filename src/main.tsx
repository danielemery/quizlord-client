import { render } from "preact";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { App } from "./app";
import "./index.css";

import AuthorizedApolloProvider from "./AuthorizedApolloProvider";

render(
  <Auth0Provider
    domain={window.env.VITE_AUTH0_DOMAIN}
    clientId={window.env.VITE_AUTH0_CLIENT_ID}
    audience={window.env.VITE_AUTH0_AUDIENCE}
    redirectUri={window.location.origin}
  >
    <BrowserRouter>
      <AuthorizedApolloProvider>
        <App />
      </AuthorizedApolloProvider>
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById("app")!
);

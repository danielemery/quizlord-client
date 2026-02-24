import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ApolloProvider } from '@apollo/client/react';
import { relayStylePagination } from '@apollo/client/utilities';
import { useAuth0 } from '@auth0/auth0-react';
import type { ComponentChildren } from 'preact';

import { extractVersionLink } from './services/version';

const AuthorizedApolloProvider = ({ children }: { children: ComponentChildren }) => {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = new HttpLink({
    uri: window.env.VITE_GRAPH_API_URI,
  });

  const authLink = new SetContextLink(async () => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([authLink, extractVersionLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            quizzes: relayStylePagination(['filters']),
          },
        },
      },
    }),
  });

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;

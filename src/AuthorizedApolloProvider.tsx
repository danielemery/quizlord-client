import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
import { useAuth0 } from '@auth0/auth0-react';
import type { ComponentChildren } from 'preact';

import { extractVersionLink } from './services/version';

const AuthorizedApolloProvider = ({ children }: { children: ComponentChildren }) => {
  const { getAccessTokenSilently } = useAuth0();

  const httpLink = createHttpLink({
    uri: window.env.VITE_GRAPH_API_URI,
  });

  const authLink = setContext(async () => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const apolloClient = new ApolloClient({
    uri: window.env.VITE_GRAPH_API_URI,
    link: from([authLink, extractVersionLink, httpLink]),
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

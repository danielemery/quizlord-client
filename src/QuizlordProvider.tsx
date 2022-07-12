import { useAuth0 } from '@auth0/auth0-react';
import { ComponentChildren, createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { gql, useQuery } from '@apollo/client';

export type Role = 'USER' | 'ADMIN';

interface User {
  email: string;
  roles: Role[];
  name?: string;
  pictureUrl?: string;
}

const ME = gql`
  query Me {
    me {
      email
      roles
    }
  }
`;

export const QuizlordContext = createContext<{
  isAuthenticated: boolean;
  user?: User;
  logout: (options: { returnTo: string }) => void;
  loginWithRedirect: () => Promise<void>;
  isLoading: boolean;
}>({
  isAuthenticated: false,
  user: undefined,
  logout: () => undefined,
  loginWithRedirect: async () => undefined,
  isLoading: false,
});

export default function QuizlordProvider({ children }: { children: ComponentChildren }) {
  const {
    isAuthenticated: isAuth0Authenticated,
    logout,
    loginWithRedirect,
    isLoading: auth0IsLoading,
    user: auth0User,
  } = useAuth0();

  const { loading, data } = useQuery<{
    me: {
      email: string;
      roles: Role[];
    };
  }>(ME, { skip: auth0IsLoading || !isAuth0Authenticated });

  return (
    <QuizlordContext.Provider
      value={{
        isAuthenticated: !!data,
        user: data?.me ? { ...data?.me, pictureUrl: auth0User?.picture, name: auth0User?.name } : undefined,
        loginWithRedirect,
        logout,
        isLoading: loading || auth0IsLoading,
      }}
    >
      {children}
    </QuizlordContext.Provider>
  );
}

export function useQuizlord() {
  return useContext(QuizlordContext);
}

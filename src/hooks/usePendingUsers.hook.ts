import { useQuery } from '@apollo/client';

import { PENDING_USERS } from '../queries/user';

// TODO this should be generated from the GraphQL schema
interface PendingUser {
  id: string;
  email: string;
  name?: string;
}

export function usePendingUsers(): {
  loading: boolean;
  data: { pendingUsers: PendingUser[] } | undefined;
  refetch: () => void;
} {
  const { loading, data, refetch } = useQuery(PENDING_USERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, refetch };
}

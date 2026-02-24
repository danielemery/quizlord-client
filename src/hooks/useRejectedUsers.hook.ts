import { useQuery } from '@apollo/client/react';

import { REJECTED_USERS } from '../queries/user';

// TODO this should be generated from the GraphQL schema
interface RejectedUser {
  id: string;
  email: string;
  name?: string;
  rejectedAt: string;
  rejectedByUser: {
    email: string;
    name?: string;
  };
}

export function useRejectedUsers(): {
  loading: boolean;
  data: { rejectedUsers: RejectedUser[] } | undefined;
  refetch: () => void;
} {
  const { loading, data, refetch } = useQuery<{ rejectedUsers: RejectedUser[] }>(REJECTED_USERS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, refetch };
}

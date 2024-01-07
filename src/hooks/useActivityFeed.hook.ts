import { useQuery } from '@apollo/client';

import { ACTIVITY_FEED } from '../queries/feed';
import { User } from '../types/user';

// TODO this should be generated from the GraphQL schema
export interface RecentActivityItem {
  date: Date;
  text: string;
  users: User[];
}

export function useActivityFeed(): {
  loading: boolean;
  data: { activityFeed: RecentActivityItem[] } | undefined;
  refetch: () => void;
} {
  const { loading, data, refetch } = useQuery(ACTIVITY_FEED, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, refetch };
}

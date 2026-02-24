import { useQuery } from '@apollo/client/react';

import { QUIZ_STATISTICS } from '../queries/statistics';

// TODO this should be generated from the GraphQL schema
interface StatsResult {
  email: string;
  name?: string;
  averageScorePercentage: number;
  totalQuizCompletions: number;
}

export function useQuizStatistics(): {
  loading: boolean;
  data: { individualUserStatistics: StatsResult[] } | undefined;
  refetch: () => void;
} {
  const { loading, data, refetch } = useQuery<{ individualUserStatistics: StatsResult[] }>(QUIZ_STATISTICS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, refetch };
}

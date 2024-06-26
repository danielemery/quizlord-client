import { useQuery } from '@apollo/client';

import { QUIZZES } from '../queries/quiz';

export function useQuizList(excludedUserEmails: string[], isFilteringOnIllegible: boolean) {
  const filters = {
    excludeCompletedBy: excludedUserEmails,
    ...(isFilteringOnIllegible ? { excludeIllegible: 'ANYONE' } : {}),
  };
  const { loading, data, fetchMore, refetch } = useQuery(QUIZZES, {
    variables: { filters },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, fetchMore, refetch };
}

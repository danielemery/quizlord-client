import { useQuery } from '@apollo/client';

import { useQuizlord } from '../QuizlordProvider';
import { QUIZZES } from '../queries/quiz';

export function useQuizList(isFilteringOnIncomplete: boolean, isFilteringOnIllegible: boolean) {
  const { user } = useQuizlord();
  const filters = {
    ...(isFilteringOnIncomplete ? { excludeCompletedBy: [user?.email] } : {}),
    ...(isFilteringOnIllegible ? { excludeIllegible: 'ANYONE' } : {}),
  };
  const { loading, data, fetchMore, refetch } = useQuery(QUIZZES, {
    variables: { filters },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, fetchMore, refetch };
}

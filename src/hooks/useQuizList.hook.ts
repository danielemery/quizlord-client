import { useQuery } from '@apollo/client';

import { useQuizlord } from '../QuizlordProvider';
import { QUIZZES } from '../queries/quiz';

export function useQuizList(isFilteringOnIncomplete: boolean) {
  const { user } = useQuizlord();
  const { loading, data, fetchMore, refetch } = useQuery(QUIZZES, {
    variables: { filters: isFilteringOnIncomplete ? { excludeCompletedBy: [user?.email] } : {} },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, fetchMore, refetch };
}

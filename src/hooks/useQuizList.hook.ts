import { useQuery } from '@apollo/client';

import { useQuizlord } from '../QuizlordProvider';
import { QUIZZES } from '../queries/quiz';

export function useQuizList(isFilteringOnIncomplete: boolean) {
  const { user } = useQuizlord();
  const { loading, data, fetchMore } = useQuery(QUIZZES, {
    variables: { filters: isFilteringOnIncomplete ? { excludeCompletedBy: [user?.email] } : {} },
    fetchPolicy: 'network-only',
  });

  return { loading, data, fetchMore };
}

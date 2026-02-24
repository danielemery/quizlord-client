import { useQuery } from '@apollo/client/react';

import { QUIZZES } from '../queries/quiz';
import { User } from '../types/user';

interface QuizCompletion {
  completedAt: string;
  score: number;
}

interface QuizNode {
  id: string;
  date: Date;
  type: string;
  uploadedBy: User;
  myCompletions: QuizCompletion[];
}

interface QuizzesData {
  quizzes: {
    pageInfo: {
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
    edges: { cursor: string; node: QuizNode }[];
  };
}

export function useQuizList(excludedUserEmails: string[], isFilteringOnIllegible: boolean) {
  const filters = {
    excludeCompletedBy: excludedUserEmails,
    ...(isFilteringOnIllegible ? { excludeIllegible: 'ANYONE' } : {}),
  };
  const { loading, data, fetchMore, refetch } = useQuery<QuizzesData>(QUIZZES, {
    variables: { filters },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  return { loading, data, fetchMore, refetch };
}

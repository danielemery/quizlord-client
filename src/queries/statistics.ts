import { gql } from '@apollo/client';

export const QUIZ_STATISTICS = gql`
  query GetQuizStatistics {
    individualUserStatistics {
      name
      email
      totalQuizCompletions
      averageScorePercentage
    }
  }
`;

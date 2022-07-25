import { gql } from '@apollo/client';

export const QUIZZES = gql`
  query GetQuizzes($after: String, $first: Int) {
    quizzes(after: $after, first: $first) {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          date
          type
          uploadedBy
          myCompletions {
            completedAt
            score
          }
        }
      }
    }
  }
`;

export const QUIZ = gql`
  query GetQuiz($id: String!) {
    quiz(id: $id) {
      id
      date
      type
      uploadedBy
      uploadedAt
      completions {
        completedAt
        completedBy
        score
      }
      images {
        imageLink
        state
        type
      }
    }
  }
`;

export const QUIZ_AND_AVAILABLE_USERS = gql`
  query GetQuiz($id: String!) {
    quiz(id: $id) {
      id
      date
      type
      uploadedBy
      uploadedAt
      completions {
        completedAt
        completedBy
        score
      }
      images {
        imageLink
        state
        type
      }
    }
    users {
      edges {
        node {
          email
        }
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const COMPLETE_QUIZ = gql`
  mutation CompleteQuiz($quizId: String!, $completedBy: [String]!, $score: Float!) {
    completeQuiz(quizId: $quizId, completedBy: $completedBy, score: $score) {
      completion {
        completedAt
        completedBy
        score
      }
    }
  }
`;

export const CREATE_QUIZ = gql`
  mutation CreateQuiz($type: QuizType!, $date: Date!, $files: [CreateQuizFile]) {
    createQuiz(type: $type, date: $date, files: $files) {
      quiz {
        id
        date
        type
      }
      uploadLinks {
        link
        fileName
      }
    }
  }
`;

import { gql } from '@apollo/client';

export const QUIZZES = gql`
  query GetQuizzes($after: String, $first: Int, $filters: QuizFilters) {
    quizzes(after: $after, first: $first, filters: $filters) {
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
          uploadedBy {
            email
            name
          }
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
      uploadedBy {
        email
        name
      }
      uploadedAt
      completions {
        completedAt
        completedBy {
          email
          name
        }
        score
        questionResults {
          questionId
          score
        }
      }
      images {
        imageLink
        state
        type
      }
      questions {
        id
        questionNum
        question
        answer
      }
      aiProcessingState
      reportedInaccurateOCR
    }
  }
`;

export const QUIZ_AND_AVAILABLE_USERS = gql`
  query GetQuiz($id: String!) {
    quiz(id: $id) {
      id
      date
      type
      uploadedBy {
        email
        name
      }
      uploadedAt
      completions {
        completedAt
        completedBy {
          email
          name
        }
        score
      }
      images {
        imageLink
        state
        type
      }
      questions {
        questionNum
      }
    }
    users {
      edges {
        node {
          email
          name
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

export const AVAILABLE_USERS = gql`
  query GetAvailableUsers {
    users {
      edges {
        node {
          email
          name
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
  mutation CompleteQuiz(
    $quizId: String!
    $completedBy: [String]!
    $score: Float!
    $questionResults: [QuizCompletionQuestionResult]
  ) {
    completeQuiz(quizId: $quizId, completedBy: $completedBy, score: $score, questionResults: $questionResults) {
      completion {
        completedAt
        completedBy {
          name
          email
        }
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

export const MARK_QUIZ_ILLEGIBLE = gql`
  mutation MarkQuizIllegible($id: String!) {
    markQuizIllegible(quizId: $id)
  }
`;

export const MARK_INACCURATE_OCR = gql`
  mutation MarkInaccurateOCR($id: String!) {
    markInaccurateOCR(quizId: $id)
  }
`;

export const AI_PROCESS_QUIZ_IMAGES = gql`
  mutation AIProcessQuizImages($id: String!) {
    aiProcessQuizImages(quizId: $id)
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($id: String!, $deletionReason: String!) {
    deleteQuiz(quizId: $id, deletionReason: $deletionReason)
  }
`;

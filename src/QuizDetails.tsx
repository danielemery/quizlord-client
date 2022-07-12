import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import EnterQuizResults from './EnterQuizResults';
import { Table } from './components/Table';

const QUIZ = gql`
  query GetQuiz($id: String!) {
    quiz(id: $id) {
      id
      state
      date
      imageLink
      type
      uploadedBy
      uploadedAt
      completions {
        completedAt
        completedBy
        score
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

const COMPLETE_QUIZ = gql`
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

interface QuizCompletion {
  completedAt: string;
  completedBy: string[];
  score: number;
}

interface Quiz {
  id: string;
  state: string;
  date: string;
  imageLink: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  completions: QuizCompletion[];
}

export interface User {
  email: string;
}

export default function Quiz() {
  const { id } = useParams();
  const { loading, data, refetch } = useQuery<{
    quiz: Quiz;
    users: { edges: { node: User }[] };
  }>(QUIZ, {
    variables: { id },
  });

  const [completeQuiz] = useMutation(COMPLETE_QUIZ);

  async function handleCompleteQuiz(score: number, participants: string[]) {
    if (participants.length === 0) {
      alert('At least one participant must be selected');
    } else {
      await completeQuiz({
        variables: { quizId: id, completedBy: participants, score },
      });
      refetch();
    }
  }

  if (loading || data === undefined) return <span>Loading...</span>;

  return (
    <>
      <dl className='my-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
        <div>
          <dt className='font-medium text-gray-900'>Date</dt>
          <dd className='mt-2 text-sm text-gray-500'>{new Date(data.quiz.date).toDateString()}</dd>
        </div>
        <div>
          <dt className='font-medium text-gray-900'>Type</dt>
          <dd className='mt-2 text-sm text-gray-500'>{data.quiz.type}</dd>
        </div>
        <div>
          <dt className='font-medium text-gray-900'>Uploaded By</dt>
          <dd className='mt-2 text-sm text-gray-500'>{data.quiz.uploadedBy}</dd>
        </div>
        <div>
          <dt className='font-medium text-gray-900'>Uploaded At</dt>
          <dd className='mt-2 text-sm text-gray-500'>{new Date(data.quiz.uploadedAt).toDateString()}</dd>
        </div>
      </dl>
      <img src={data.quiz.imageLink} />
      <Table className='my-8'>
        <Table.Head>
          <Table.Row isHeader>
            <Table.HeaderCell>Completed At</Table.HeaderCell>
            <Table.HeaderCell>Participants</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.quiz.completions.map((completion) => (
            <Table.Row>
              <Table.Cell>{completion.completedAt}</Table.Cell>
              <Table.Cell>{completion.completedBy.join(', ')}</Table.Cell>
              <Table.Cell>{completion.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <EnterQuizResults availableUsers={data.users.edges.map((u) => u.node)} handleSubmit={handleCompleteQuiz} />
    </>
  );
}

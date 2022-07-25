import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import QuizImageComponent from './QuizImage';
import Button from './components/Button';
import { Table } from './components/Table';
import { formatDate, formatDateTime } from './helpers';
import { QUIZ } from './queries/quiz';
import { Quiz as QuizType } from './types/quiz';

const imageTypeSortValues: {
  [imageType: string]: number;
} = {
  QUESTION: 1,
  ANSWER: 2,
  QUESTION_AND_ANSWER: 3,
};

export interface User {
  email: string;
}

export default function Quiz() {
  const { id } = useParams();
  const { loading, data } = useQuery<{
    quiz: QuizType;
  }>(QUIZ, {
    variables: { id },
  });

  if (loading || data === undefined) return <span>Loading...</span>;

  return (
    <>
      <dl className='my-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
        <div>
          <dt className='font-medium text-gray-900'>Date</dt>
          <dd className='mt-2 text-sm text-gray-500'>{formatDate(data.quiz.date)}</dd>
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
          <dd className='mt-2 text-sm text-gray-500'>{formatDateTime(data.quiz.uploadedAt)}</dd>
        </div>
      </dl>
      {[...data.quiz.images]
        .sort((a, b) => {
          return imageTypeSortValues[a.type] - imageTypeSortValues[b.type];
        })
        .map((image) => (
          <QuizImageComponent image={image} className='mt-2' />
        ))}
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
              <Table.Cell>{formatDateTime(completion.completedAt)}</Table.Cell>
              <Table.Cell>{completion.completedBy.join(', ')}</Table.Cell>
              <Table.Cell>{completion.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Link to='./enter'>
        <Button>Enter Results</Button>
      </Link>
    </>
  );
}

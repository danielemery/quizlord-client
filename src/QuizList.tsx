import { useNavigate } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { Fragment } from 'preact';

import Button from './components/Button';
import Loader from './components/Loader';
import { Table } from './components/Table';
import { formatDate, formatDateTime, formatDateTimeShortDate, formatDateTimeShortTime } from './helpers';
import { QUIZZES } from './queries/quiz';
import { User } from './types/user';

interface QuizCompletion {
  completedAt: string;
  score: number;
}

interface Node {
  id: string;
  date: Date;
  type: string;
  uploadedBy: User;
  myCompletions: QuizCompletion[];
}

export default function QuizList() {
  const { loading, data, fetchMore } = useQuery(QUIZZES);
  const navigate = useNavigate();

  if (loading) return <Loader message='Loading available quizzes...' />;

  const nodes = data.quizzes.edges;
  const pageInfo = data.quizzes.pageInfo;

  return (
    <>
      <Table className='table-fixed'>
        <Table.Head>
          <Table.Row className='hidden lg:table-row' isHeader>
            <Table.HeaderCell>Quiz Date</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Uploaded By</Table.HeaderCell>
            <Table.HeaderCell>Completed</Table.HeaderCell>
            <Table.HeaderCell>Result</Table.HeaderCell>
          </Table.Row>
          <Table.Row className='lg:hidden' isHeader>
            <Table.HeaderCell>Quiz Details</Table.HeaderCell>
            <Table.HeaderCell>Completion</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {nodes.map(({ node }: { node: Node }) => (
            <Fragment key={node.id}>
              <Table.Row className='hidden lg:table-row' isHoverable onClick={() => navigate(`/quiz/${node.id}`)}>
                <Table.Cell>{formatDate(node.date)}</Table.Cell>
                <Table.Cell>{node.type}</Table.Cell>
                <Table.Cell>{node.uploadedBy.name ?? node.uploadedBy.email}</Table.Cell>
                <Table.Cell>
                  {node.myCompletions.length > 0 ? formatDateTime(node.myCompletions[0].completedAt) : ''}
                </Table.Cell>
                <Table.Cell>{node.myCompletions.length > 0 ? node.myCompletions[0].score : ''}</Table.Cell>
              </Table.Row>
              <Table.Row className='lg:hidden' isHoverable onClick={() => navigate(`/quiz/${node.id}`)}>
                <Table.Cell>
                  <ul>
                    <li>{node.type}</li>
                    <li>{formatDate(node.date)}</li>
                    <li className='italic'>{node.uploadedBy.name ?? node.uploadedBy.email}</li>
                  </ul>
                </Table.Cell>
                <Table.Cell>
                  {node.myCompletions.length > 0 && (
                    <ul>
                      <li className='font-medium'>Score: {node.myCompletions[0].score}</li>
                      <li className='italic'>{formatDateTimeShortDate(node.myCompletions[0].completedAt)}</li>
                      <li className='italic'>{formatDateTimeShortTime(node.myCompletions[0].completedAt)}</li>
                    </ul>
                  )}
                </Table.Cell>
              </Table.Row>
            </Fragment>
          ))}
        </Table.Body>
      </Table>
      {pageInfo.hasNextPage && (
        <div className='flex justify-center items-center mt-4'>
          <Button onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}>Load More...</Button>
        </div>
      )}
    </>
  );
}

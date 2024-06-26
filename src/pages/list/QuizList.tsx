import { useNavigate } from 'react-router-dom';

import { Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { useQuizlord } from '../../QuizlordProvider';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { Table } from '../../components/Table';
import {
  formatDate,
  formatDateTime,
  formatDateTimeShortDate,
  formatDateTimeShortTime,
  userIdentifier,
} from '../../helpers';
import { useQuizList } from '../../hooks/useQuizList.hook';
import { User } from '../../types/user';
import { QuizListControls } from './QuizListControls';
import { QuizFilters } from './quizFilters';

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
  const { user: authenticatedUser } = useQuizlord();
  const [quizFilters, setQuizFilters] = useState<QuizFilters>({
    excludedUserEmails: authenticatedUser?.email ? [authenticatedUser?.email] : [],
    isFilteringOnIllegible: true,
  });
  const { data, loading, fetchMore, refetch } = useQuizList(
    quizFilters.excludedUserEmails,
    quizFilters.isFilteringOnIllegible,
  );
  const navigate = useNavigate();

  return (
    <>
      <QuizListControls
        className='flex-1'
        filters={quizFilters}
        onFiltersChanged={(changes) =>
          setQuizFilters((prevState) => ({
            ...prevState,
            ...changes,
          }))
        }
        onRefreshClicked={() => refetch()}
      />
      <div>
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
            {loading && (
              <>
                <Table.Row className='hidden lg:table-row'>
                  <Table.Cell colSpan={5}>
                    <Loader message='Loading available quizzes...' />
                  </Table.Cell>
                </Table.Row>
                <Table.Row className='lg:hidden'>
                  <Table.Cell colSpan={2}>
                    <Loader message='Loading available quizzes...' />
                  </Table.Cell>
                </Table.Row>
              </>
            )}
            {!loading &&
              data.quizzes.edges.map(({ node }: { node: Node }) => (
                <Fragment key={node.id}>
                  <Table.Row className='hidden lg:table-row' isHoverable onClick={() => navigate(`/quiz/${node.id}`)}>
                    <Table.Cell>{formatDate(node.date)}</Table.Cell>
                    <Table.Cell>{node.type}</Table.Cell>
                    <Table.Cell>{userIdentifier(node.uploadedBy)}</Table.Cell>
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
                        <li className='italic'>{userIdentifier(node.uploadedBy)}</li>
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
      </div>
      {data?.quizzes?.pageInfo?.hasNextPage && (
        <div className='flex justify-center items-center mt-4'>
          <Button onClick={() => fetchMore({ variables: { after: data.quizzes.pageInfo.endCursor } })}>
            Load More...
          </Button>
        </div>
      )}
    </>
  );
}

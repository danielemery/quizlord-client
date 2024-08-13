import Loader from '../../components/Loader';
import { Table } from '../../components/Table';
import { formatPercent, userIdentifier } from '../../helpers/helpers';
import { useQuizStatistics } from '../../hooks/useQuizStatistics.hook';

export default function QuizList() {
  const { data, loading } = useQuizStatistics();

  if (loading || !data) {
    return <Loader message='Loading quiz statistics...' />;
  }

  return (
    <div>
      <Table>
        <Table.Head>
          <Table.Row isHeader>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Completions (%Score)</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data?.individualUserStatistics.map((stats) => (
            <Table.Row key={stats.email}>
              <Table.Cell>{userIdentifier(stats)}</Table.Cell>
              <Table.Cell>
                <strong>{stats.totalQuizCompletions}</strong> ({formatPercent(stats.averageScorePercentage)})
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <i className='p-4 lg:p-0 inline-block mt-4 text-gray-600'>
        <strong>Please note:</strong> statistics shown here may be delayed by up to 24 hours.
      </i>
    </div>
  );
}

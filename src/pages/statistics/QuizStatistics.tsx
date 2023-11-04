import { Table } from '../../components/Table';
import { formatPercent, userIdentifier } from '../../helpers';
import { useQuizStatistics } from '../../hooks/useQuizStatistics.hook';

export default function QuizList() {
  const { data, loading, refetch } = useQuizStatistics();
  console.log({ data, loading, refetch });

  if (loading || !data) {
    return <span>Loading...</span>;
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
    </div>
  );
}

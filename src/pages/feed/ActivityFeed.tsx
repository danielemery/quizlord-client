import Loader from '../../components/Loader';
import { Table } from '../../components/Table';
import { formatDateTime, userIdentifier } from '../../helpers';
import { useActivityFeed } from '../../hooks/useActivityFeed.hook';

export default function ActivityFeed() {
  const { data, loading } = useActivityFeed();

  if (loading || !data) {
    return <Loader message='Loading recent activities...' />;
  }

  return (
    <Table>
      <Table.Body>
        {data?.activityFeed.map((activity) => (
          <Table.Row>
            <Table.Cell>{activity.users.map((u) => userIdentifier(u)).join(', ')}</Table.Cell>
            <Table.Cell>{activity.text}</Table.Cell>
            <Table.Cell>
              <i>{formatDateTime(activity.date)}</i>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

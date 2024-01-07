import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { formatDate, userIdentifier } from '../../helpers';
import { useActivityFeed } from '../../hooks/useActivityFeed.hook';

export default function ActivityFeed() {
  const { data, loading, refetch } = useActivityFeed();

  if (loading || !data) {
    return <Loader message='Loading recent activities...' />;
  }

  return (
    <ul>
      {data?.activityFeed.map((activity) => (
        <li className='mt-4'>
          <strong>{formatDate(activity.date)}:</strong> {activity.text}{' '}
          {activity.users.map((u) => userIdentifier(u)).join(', ')}
        </li>
      ))}
      {/* // TODO Remove or replace */}
      <li>
        <Button onClick={() => refetch()} className='mt-4'>
          Test
        </Button>
      </li>
    </ul>
  );
}

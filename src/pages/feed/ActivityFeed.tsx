import Loader from '../../components/Loader';
import { formatDate } from '../../helpers';
import { useActivityFeed } from '../../hooks/useActivityFeed.hook';

export default function ActivityFeed() {
  const { data, loading } = useActivityFeed();

  if (loading || !data) {
    return <Loader message='Loading recent activities...' />;
  }

  return (
    <ul>
      {data?.activityFeed.map((activity) => (
        <li className='mt-4'>
          <strong>{formatDate(activity.date)}:</strong> {activity.text}
        </li>
      ))}
    </ul>
  );
}

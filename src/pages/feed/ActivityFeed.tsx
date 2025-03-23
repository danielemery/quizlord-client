import { intlFormatDistance } from 'date-fns';

import Loader from '../../components/Loader';
import { userIdentifier } from '../../helpers';
import { RecentActivityItem, useActivityFeed } from '../../hooks/useActivityFeed.hook';

export default function ActivityFeed() {
  const { data, loading } = useActivityFeed();

  if (loading || !data) {
    return <Loader message='Loading recent activities...' />;
  }

  return (
    <div>
      {data?.activityFeed.map((activity) => <ActivityCard key={activity.resourceId} recentlyActivityItem={activity} />)}
    </div>
  );
}

export function ActivityCard({ recentlyActivityItem }: { recentlyActivityItem: RecentActivityItem }) {
  return (
    <div className='bg-white m-2 p-2 rounded-lg border-solid border-2'>
      <div>
        <div className='flex justify-between'>
          <div className='font-bold'>{recentlyActivityItem.users.map((u) => userIdentifier(u)).join(', ')}</div>
          <i className='hidden lg:block'>{intlFormatDistance(recentlyActivityItem.date, new Date())}</i>
        </div>
      </div>
      <div>{recentlyActivityItem.text}</div>
      <div className='lg:hidden'>
        <i>{intlFormatDistance(recentlyActivityItem.date, new Date())}</i>
      </div>
    </div>
  );
}

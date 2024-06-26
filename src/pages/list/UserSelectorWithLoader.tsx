import { useQuery } from '@apollo/client';

import Loader from '../../components/Loader';
import { UserSelector } from '../../components/UserSelector';
import { AVAILABLE_USERS } from '../../queries/quiz';
import { User } from '../../types/user';

export interface UserSelectorWithLoaderProps {
  selectedUserEmails: string[];
  onSelectionsChanged: (selectedUserEmails: string[]) => void;
  excludeUserEmails?: string[];
  name?: string;
}

export function UserSelectorWithLoader({
  selectedUserEmails,
  onSelectionsChanged,
  name,
  excludeUserEmails,
}: UserSelectorWithLoaderProps) {
  const { loading, data } = useQuery<{
    users: { edges: { node: User }[] };
  }>(AVAILABLE_USERS);

  if (loading || !data) {
    return <Loader message='Loading available users' />;
  }

  return (
    <UserSelector
      availableUsers={data.users.edges
        .map((edge) => edge.node)
        .filter((user) => !excludeUserEmails?.includes(user.email))}
      selectedUserEmails={selectedUserEmails}
      onSelectionsChanged={onSelectionsChanged}
      name={name}
    />
  );
}

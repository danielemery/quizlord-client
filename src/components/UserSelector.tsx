import { userIdentifier } from '../helpers';
import { User } from '../types/user';

export interface UserSelectorProps {
  availableUsers: User[];
  selectedUserEmails: string[];
  onSelectionsChanged: (selectedUserEmails: string[]) => void;
  name?: string;
}

export function UserSelector({
  availableUsers,
  selectedUserEmails,
  onSelectionsChanged,
  name = 'user-selector',
}: UserSelectorProps) {
  return (
    <select
      multiple
      id={name}
      name={name}
      className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
      onChange={(e) => {
        const items = [...(e.target as HTMLSelectElement).selectedOptions];
        onSelectionsChanged(items.map((item) => item.value));
      }}
    >
      {availableUsers.map((user) => (
        <option selected={selectedUserEmails.includes(user.email)} value={user.email}>
          {userIdentifier(user)}
        </option>
      ))}
    </select>
  );
}

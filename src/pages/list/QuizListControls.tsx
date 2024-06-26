import { faFilter, faFilterCircleXmark, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'preact/hooks';

import { useQuizlord } from '../../QuizlordProvider';
import Button from '../../components/Button';
import { userIdentifier } from '../../helpers';
import { UserSelectorWithLoader } from './UserSelectorWithLoader';
import { QuizFilters } from './quizFilters';

export interface QuizListControlsProps {
  filters: QuizFilters;
  onFiltersChanged: (filterChanges: QuizFilters) => void;
  onRefreshClicked: () => void;
  className?: string;
}

export function QuizListControls({ filters, onFiltersChanged, onRefreshClicked, className }: QuizListControlsProps) {
  const { user: authenticatedUser } = useQuizlord();
  const [isSelectingUsers, setIsSelectingUsers] = useState(false);
  const [pendingSelections, setPendingSelections] = useState<string[]>(filters.excludedUserEmails);
  return (
    <>
      <div className='flex m-4 lg:m-0 lg:mb-4'>
        <div
          className={`cursor-pointer${className ? ` ${className}` : ''}`}
          onClick={() => setIsSelectingUsers((prevState) => !prevState)}
        >
          <FontAwesomeIcon
            icon={filters.excludedUserEmails ? faFilter : faFilterCircleXmark}
            size='xl'
            className='text-gray-800'
          />
          <span className='ml-4'>{getIncompleteText(filters.excludedUserEmails.length)}</span>
        </div>
        <div
          className={`cursor-pointer${className ? ` ${className}` : ''}`}
          onClick={() =>
            onFiltersChanged({
              ...filters,
              isFilteringOnIllegible: !filters.isFilteringOnIllegible,
            })
          }
        >
          <FontAwesomeIcon
            icon={filters.isFilteringOnIllegible ? faFilter : faFilterCircleXmark}
            size='xl'
            className='text-gray-800'
          />
          <span className='ml-4'>{filters.isFilteringOnIllegible ? 'Readable Only' : 'No Readability Filter'}</span>
        </div>
        <div className='flex-0 cursor-pointer' onClick={() => onRefreshClicked()}>
          <FontAwesomeIcon icon={faRefresh} size='xl' className='text-gray-800' />
        </div>
      </div>
      {isSelectingUsers && (
        <div className='m-4 lg:m-0 lg:mb-4'>
          <label htmlFor='excludedUserEmails' className='block text-sm font-medium text-gray-700'>
            Excluded quizzes completed by
          </label>
          <p className='text-sm text-gray-500'>
            {userIdentifier(authenticatedUser)} <strong>OR</strong>
          </p>
          <UserSelectorWithLoader
            selectedUserEmails={filters.excludedUserEmails}
            onSelectionsChanged={(newSelections) => {
              setPendingSelections(newSelections);
            }}
            excludeUserEmails={authenticatedUser ? [authenticatedUser.email] : []}
            name='excludedUserEmails'
          />

          <div className='space-x-2 my-2'>
            <Button
              onClick={() => {
                onFiltersChanged({
                  ...filters,
                  excludedUserEmails: [...pendingSelections, ...(authenticatedUser ? [authenticatedUser.email] : [])],
                });
                setIsSelectingUsers(false);
              }}
            >
              Apply
            </Button>
            <Button
              warning
              onClick={() => {
                onFiltersChanged({
                  ...filters,
                  excludedUserEmails: [],
                });
                setIsSelectingUsers(false);
              }}
            >
              Remove Filter
            </Button>
            <Button
              danger
              onClick={() => {
                setPendingSelections(filters.excludedUserEmails);
                setIsSelectingUsers(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function getIncompleteText(numExcluded: number) {
  if (numExcluded === 0) {
    return 'No Incomplete Filter';
  }
  if (numExcluded === 1) {
    return 'Incomplete (You)';
  }
  return `Incomplete (You + ${numExcluded - 1})`;
}

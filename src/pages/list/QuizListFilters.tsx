import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { QuizFilters } from './quizFilters';

export interface QuizListFiltersProps {
  filters: QuizFilters;
  onFiltersChanged: (filterChanges: QuizFilters) => void;
  className?: string;
}

export function QuizListFilters({ filters, onFiltersChanged, className }: QuizListFiltersProps) {
  return (
    <>
      <div
        className={`cursor-pointer${className ? ` ${className}` : ''}`}
        onClick={() =>
          onFiltersChanged({
            ...filters,
            isFilteringOnIncomplete: !filters.isFilteringOnIncomplete,
          })
        }
      >
        <FontAwesomeIcon
          icon={filters.isFilteringOnIncomplete ? faFilter : faFilterCircleXmark}
          size='xl'
          className='text-gray-800'
        />
        <span className='ml-4'>{filters.isFilteringOnIncomplete ? 'Incomplete Only' : 'No Incomplete Filter'}</span>
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
    </>
  );
}

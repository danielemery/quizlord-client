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
    <div
      className={`cursor-pointer${className ? ` ${className}` : ''}`}
      onClick={() => onFiltersChanged({ isFilteringOnIncomplete: !filters.isFilteringOnIncomplete })}
    >
      <FontAwesomeIcon
        icon={filters.isFilteringOnIncomplete ? faFilter : faFilterCircleXmark}
        size='xl'
        className='text-gray-800'
      />
      <span className='ml-4'>
        {filters.isFilteringOnIncomplete ? 'Showing only incomplete quizzes' : 'Showing all quizzes'}
      </span>
    </div>
  );
}

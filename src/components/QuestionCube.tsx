import classNames from 'classnames';

import { scoreToColor } from '../services/util';
import { QuestionScore } from '../types/quiz';

export function QuestionCube({
  questionNum,
  score,
  selected = false,
}: {
  questionNum: number;
  score: QuestionScore | undefined;
  selected?: boolean;
}) {
  const cubeClasses = classNames(
    'text-white rounded p-2 shadow-md flex items-center justify-center aspect-square', // Common classes
    'max-w-[40px] max-h-[40px]', // Limit the maximum size of the cubes
  );

  const colorClasses = scoreToColor(score);

  const textClasses = classNames({
    'font-bold': selected, // Make the text bold if selected
  });

  return <span className={`${cubeClasses} ${colorClasses} ${textClasses}`}>{questionNum}</span>;
}

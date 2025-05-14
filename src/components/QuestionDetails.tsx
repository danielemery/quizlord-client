import classNames from 'classnames';

import { QuizQuestionWithResults } from '../QuizQuestions';
import { closestScore, scoreToColor } from '../services/util';
import { QuestionCube } from './QuestionCube';

export interface QuestionResultBreakdownProps {
  question: QuizQuestionWithResults;
  showAnswer?: boolean;
  showUserScores?: boolean;
}

export function QuestionDetails({
  question,
  showAnswer = false,
  showUserScores = false,
}: QuestionResultBreakdownProps) {
  return (
    <div>
      <div className='mb-3 flex items-center'>
        <div className='flex-shrink-0 w-10 mr-2'>
          <QuestionCube questionNum={question.questionNum} score={question.myScore} />
        </div>
        <span className='text-md text-gray-800'>
          {question.question}
          {showAnswer && <span className='text-gray-500'> {question.answer}</span>}
        </span>
      </div>
      {showUserScores && (
        <div className='flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50'>
          {question.averageScore !== undefined && (
            <span
              className={classNames(
                scoreToColor(closestScore(question.averageScore)),
                'px-3 py-1 rounded-full text-sm font-medium inline-block',
              )}
            >
              Average: {question.averageScore.toFixed(2)}
            </span>
          )}
          {question.userResults.map((result) => (
            <span
              className={classNames(
                scoreToColor(result.score),
                'px-3 py-1 rounded-full text-sm font-medium inline-block',
              )}
              key={result.users.join()}
            >
              {result.users.join(', ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

import { Link } from 'react-router-dom';

import classNames from 'classnames';

import { LocalQuestion } from './hooks/useQuizQuestions';

interface QuestionOverviewProps {
  quizId: string;
  questions: LocalQuestion[];
  selectedNumber?: number;
}

export default function QuestionOverview({ questions, quizId, selectedNumber }: QuestionOverviewProps) {
  return (
    <div className='grid grid-cols-5 gap-4'>
      {questions.map((q) => (
        <Link key={q.questionNum} to={`/quiz/${quizId}/question/${q.questionNum}`}>
          <QuestionCube question={q} selected={selectedNumber === q.questionNum} />
        </Link>
      ))}
    </div>
  );
}

export function QuestionCube({ question, selected }: { question: LocalQuestion; selected: boolean }) {
  if (!question) return null;
  const { questionNum, unsubmittedScore } = question;

  const cubeClasses = classNames(
    'text-white rounded p-2 shadow-md flex items-center justify-center aspect-square', // Common classes
    'max-w-[40px] max-h-[40px]', // Limit the maximum size of the cubes
  );

  const colorClasses = classNames({
    'bg-emerald-400': unsubmittedScore === 'CORRECT',
    'bg-amber-400': unsubmittedScore === 'HALF_CORRECT',
    'bg-rose-400': unsubmittedScore === 'INCORRECT',
    'bg-gray-400': !unsubmittedScore,
  });

  const textClasses = classNames({
    'font-bold': selected, // Make the text bold if selected
  });

  return <span className={`${cubeClasses} ${colorClasses} ${textClasses}`}>{questionNum}</span>;
}

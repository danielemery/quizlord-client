import { Link } from 'react-router-dom';

import { QuestionCube } from './components/QuestionCube';
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
          <QuestionCube
            questionNum={q.questionNum}
            score={q.unsubmittedScore}
            selected={selectedNumber === q.questionNum}
          />
        </Link>
      ))}
    </div>
  );
}

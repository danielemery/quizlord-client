import { useState } from 'preact/hooks';

import Button from './components/Button';
import { QuizQuestion } from './types/quiz';

export interface QuizQuestionsProps {
  questions: QuizQuestion[];
}

export default function QuizQuestions({ questions }: QuizQuestionsProps) {
  const [questionsShown, setQuestionsShown] = useState(true);
  const [answersShown, setAnswersShown] = useState(false);
  return (
    <>
      <div className='border-solid border-t-2 py-2'>
        <div className='mb-2 lg:mb-4 lg:flex'>
          <h2 className='lg:inline lg:flex-auto font-semibold mb-2'>Questions</h2>
          <Button danger className='flex-none' onClick={() => setQuestionsShown((prev) => !prev)}>
            {questionsShown ? 'Hide' : 'Show'}
          </Button>
        </div>
        {questionsShown && (
          <ol>
            {questions.map((question) => (
              <li key={question.questionNum} className='mb-4'>
                {question.questionNum}. {question.question}
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className='border-solid border-t-2 py-2'>
        <div className='mb-2 lg:mb-4 lg:flex'>
          <h2 className='lg:inline lg:flex-auto font-semibold mb-2'>Answers</h2>
          <Button danger className='flex-none' onClick={() => setAnswersShown((prev) => !prev)}>
            {answersShown ? 'Hide' : 'Show'}
          </Button>
        </div>
        {answersShown && (
          <ol>
            {questions.map((question) => (
              <li key={question.questionNum} className='mb-4'>
                {question.questionNum}. {question.answer}
              </li>
            ))}
          </ol>
        )}
        {!answersShown && <p className='italic'>Answers are hidden by default.</p>}
      </div>
    </>
  );
}

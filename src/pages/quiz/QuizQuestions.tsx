import classNames from 'classnames';
import { useState } from 'preact/hooks';

import { ExpandCollapseSection } from '../../components/ExpandCollapseSection';
import { QuestionDetails } from '../../components/QuestionDetails';
import { QuizQuestionWithResults } from '../../types/quiz';

export interface QuizQuestionsProps {
  questions: QuizQuestionWithResults[];
  reportedInaccurateOCR: boolean;
}

export default function QuizQuestions({ questions, reportedInaccurateOCR }: QuizQuestionsProps) {
  const [answersShown, setAnswersShown] = useState(false);
  const [userScoresShown, setUserScoresShown] = useState(false);

  const hasResults = questions?.[0]?.averageScore !== undefined;

  return (
    <>
      <ExpandCollapseSection
        title='Question Details'
        initiallyShown={!reportedInaccurateOCR && !!questions?.[0]?.question}
      >
        <div className={classNames('font-bold italic text-sm mb-4', { 'text-red-500': reportedInaccurateOCR })}>
          Please note these questions have been extracted using google gemini, there is no guarantee on the accuracy of
          the question extraction.{reportedInaccurateOCR && ' At least one user has reported the OCR to be inaccurate.'}
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='showAnswers'
            className={classNames(['w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'])}
            checked={answersShown}
            onChange={(e) => {
              setAnswersShown((e.target as HTMLInputElement).checked);
            }}
          />
          <label htmlFor='showAnswers' className='text-sm font-medium text-gray-700'>
            Show Answers
          </label>
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='showUserScores'
            className={classNames('w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500', {
              'opacity-50 cursor-not-allowed': !hasResults,
            })}
            disabled={!hasResults}
            checked={userScoresShown}
            onChange={(e) => {
              setUserScoresShown((e.target as HTMLInputElement).checked);
            }}
          />
          <label htmlFor='showUserScores' className='text-sm font-medium text-gray-700'>
            Show User Scores
          </label>
        </div>
        <ol>
          {questions.map((question) => (
            <li key={question.questionNum} className='mb-4 flex items-start'>
              <QuestionDetails question={question} showAnswer={answersShown} showUserScores={userScoresShown} />
            </li>
          ))}
        </ol>
      </ExpandCollapseSection>
    </>
  );
}

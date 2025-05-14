import classNames from 'classnames';

import { ExpandCollapseSection } from './components/ExpandCollapseSection';
import { QuestionCube } from './components/QuestionCube';
import { QuizQuestion } from './types/quiz';

export interface QuizQuestionsProps {
  questions: QuizQuestion[];
  reportedInaccurateOCR: boolean;
}

export default function QuizQuestions({ questions, reportedInaccurateOCR }: QuizQuestionsProps) {
  return (
    <>
      <ExpandCollapseSection title='Questions' initiallyShown={!reportedInaccurateOCR}>
        <div className={classNames('font-bold italic text-sm mb-4', { 'text-red-500': reportedInaccurateOCR })}>
          Please note these questions have been extracted using google gemini, there is no guarantee on the accuracy of
          the question extraction.{reportedInaccurateOCR && ' At least one user has reported the OCR to be inaccurate.'}
        </div>
        <ol>
          {questions.map((question) => (
            <li key={question.questionNum} className='mb-4 flex items-start'>
              <div className='flex-shrink-0 mr-2 w-12 text-center'>
                <QuestionCube
                  questionNum={question.questionNum}
                  score={question.myScore ?? undefined}
                  selected={false}
                />
              </div>
              <div className='flex-grow'>{question.question}</div>
            </li>
          ))}
        </ol>
      </ExpandCollapseSection>
      <ExpandCollapseSection title='Answers' fallbackText='Answers are hidden by default.' initiallyShown={false}>
        <div className={classNames('font-bold italic text-sm mb-4', { 'text-red-500': reportedInaccurateOCR })}>
          Please note these answers have been extracted using google gemini, there is no guarantee on the accuracy of
          the answer extraction.{reportedInaccurateOCR && ' At least one user has reported the OCR to be inaccurate.'}
        </div>
        <ol>
          {questions.map((question) => (
            <li key={question.questionNum} className='mb-4'>
              {question.questionNum}. {question.answer}
            </li>
          ))}
        </ol>
      </ExpandCollapseSection>
    </>
  );
}

import classNames from 'classnames';

import { ExpandCollapseSection } from './components/ExpandCollapseSection';
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
            <li key={question.questionNum} className='mb-4'>
              {question.questionNum}. {question.question}
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

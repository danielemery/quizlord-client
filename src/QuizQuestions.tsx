import { ExpandCollapseSection } from './components/ExpandCollapseSection';
import { QuizQuestion } from './types/quiz';

export interface QuizQuestionsProps {
  questions: QuizQuestion[];
}

export default function QuizQuestions({ questions }: QuizQuestionsProps) {
  return (
    <>
      <ExpandCollapseSection title='Questions' initiallyShown={true}>
        <div className='font-bold italic text-sm mb-4'>
          Please note these questions have been extracted using google gemini, there is no guarantee on the accuracy of
          the question extraction.
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
        <div className='font-bold italic text-sm mb-4'>
          Please note these answers have been extracted using google gemini, there is no guarantee on the accuracy of
          the answer extraction.
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

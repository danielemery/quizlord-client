import { ExpandCollapseSection } from './components/ExpandCollapseSection';
import { QuizQuestion } from './types/quiz';

export interface QuizQuestionsProps {
  questions: QuizQuestion[];
}

export default function QuizQuestions({ questions }: QuizQuestionsProps) {
  return (
    <>
      <ExpandCollapseSection title='Questions' initiallyShown={true}>
        <ol>
          {questions.map((question) => (
            <li key={question.questionNum} className='mb-4'>
              {question.questionNum}. {question.question}
            </li>
          ))}
        </ol>
      </ExpandCollapseSection>
      <ExpandCollapseSection title='Answers' fallbackText='Answers are hidden by default.' initiallyShown={false}>
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

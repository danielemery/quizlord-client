import { Link, useNavigate } from 'react-router-dom';

import classNames from 'classnames';
import { useState } from 'preact/hooks';

import QuestionOverview from './QuestionOverview';
import Button from './components/Button';
import Loader from './components/Loader';
import useAssertParams from './hooks/useAssertParams';
import { useQuizQuestions } from './hooks/useQuizQuestions';
import { useSettings } from './hooks/useSettings';

export default function QuizQuestion() {
  const { id, questionNumber } = useAssertParams();
  const navigate = useNavigate();

  const { loading: questionsLoading, questions, handleScoreSelected } = useQuizQuestions(id);
  const { loading: settingsLoading, settings, setSetting } = useSettings();

  const [showAnswerOnce, setShowAnswerOnce] = useState(false);

  if (id === undefined || questionNumber === undefined) {
    return <div>Invalid quiz ID or question number</div>;
  }

  const questionNum = parseInt(questionNumber, 10);

  if (questionsLoading || settingsLoading || !questions)
    return <Loader message='Loading your quiz...' className='mt-10' />;

  const matchingQuestion = questions.get(questionNum);
  const answerShown = showAnswerOnce || settings?.LOCK_ANSWER;

  function navigateToNextQuestion() {
    const nextQuestion = questionNum + 1;
    if (questions && questions.has(nextQuestion)) {
      if (!settings?.LOCK_ANSWER) {
        setShowAnswerOnce(false);
      }
      navigate(`/quiz/${id}/question/${nextQuestion}`);
    }
  }

  function navigateToPreviousQuestion() {
    const previousQuestion = questionNum - 1;
    if (questions && questions.has(previousQuestion)) {
      if (!settings?.LOCK_ANSWER) {
        setShowAnswerOnce(false);
      }
      navigate(`/quiz/${id}/question/${previousQuestion}`);
    }
  }

  function onScoreSelected(quizId: string, questionNum: number, score: 'CORRECT' | 'INCORRECT' | 'HALF_CORRECT') {
    handleScoreSelected(quizId, questionNum, score);
    if (settings?.AUTO_CONTINUE) {
      navigateToNextQuestion();
    }
  }

  return (
    <div className={'p-4'}>
      <div className='flex justify-between'>
        <Button disabled={!questions.has(questionNum - 1)} onClick={navigateToPreviousQuestion}>{`<`}</Button>
        <div className='text-lg font-bold text-gray-800'>{questionNumber}</div>
        <Button disabled={!questions.has(questionNum + 1)} onClick={navigateToNextQuestion}>{`>`}</Button>
      </div>

      <div className='text-lg font-semibold text-gray-900 mt-4'>{matchingQuestion?.question}</div>

      {answerShown && <div className='text-lg italic mt-2'>{matchingQuestion?.answer}</div>}

      <fieldset className='mt-4'>
        <div className='flex items-center gap-2'>
          <input
            type='radio'
            id='correct'
            name='questionResult'
            value='CORRECT'
            checked={matchingQuestion?.unsubmittedScore === 'CORRECT'}
            onChange={() => onScoreSelected(id, questionNum, 'CORRECT')}
            className='w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500'
          />
          <label htmlFor='correct' className='text-sm font-medium text-gray-700'>
            Correct
          </label>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <input
            type='radio'
            id='half-correct'
            name='questionResult'
            value='HALF_CORRECT'
            checked={matchingQuestion?.unsubmittedScore === 'HALF_CORRECT'}
            onChange={() => onScoreSelected(id, questionNum, 'HALF_CORRECT')}
            className='w-5 h-5 text-yellow-600 border-gray-300 focus:ring-yellow-500'
          />
          <label htmlFor='half-correct' className='text-sm font-medium text-gray-700'>
            Half Correct
          </label>
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <input
            type='radio'
            id='incorrect'
            name='questionResult'
            value='INCORRECT'
            checked={matchingQuestion?.unsubmittedScore === 'INCORRECT'}
            onChange={() => onScoreSelected(id, questionNum, 'INCORRECT')}
            className='w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500'
          />
          <label htmlFor='incorrect' className='text-sm font-medium text-gray-700'>
            Incorrect
          </label>
        </div>
      </fieldset>

      <br />
      <br />

      <div className='flex flex-col gap-2 mt-4'>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='showAnswer'
            className={classNames(['w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'], {
              'opacity-50 cursor-not-allowed': settings?.LOCK_ANSWER,
            })}
            disabled={settings?.LOCK_ANSWER}
            checked={answerShown}
            onChange={(e) => {
              if (settings?.LOCK_ANSWER) return;
              setShowAnswerOnce((e.target as HTMLInputElement).checked);
            }}
          />
          <label htmlFor='showAnswer' className='text-sm font-medium text-gray-700'>
            Show Answer
          </label>
        </div>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='lockShowAnswer'
            className={classNames([
              'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500',
              { 'opacity-50 cursor-not-allowed': !showAnswerOnce && !settings?.LOCK_ANSWER },
            ])}
            disabled={!showAnswerOnce && !settings?.LOCK_ANSWER}
            checked={settings?.LOCK_ANSWER}
            onChange={(e) => {
              setSetting({ name: 'LOCK_ANSWER', value: (e.target as HTMLInputElement).checked });
            }}
          />
          <label htmlFor='lockShowAnswer' className='text-sm font-medium text-gray-700'>
            Lock Show Answer
          </label>
        </div>
        <hr className='border-t border-gray-300 my-2' />
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            id='progressOnScoreSelected'
            className={classNames(['w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'])}
            checked={settings?.AUTO_CONTINUE}
            onChange={(e) => {
              setSetting({ name: 'AUTO_CONTINUE', value: (e.target as HTMLInputElement).checked });
            }}
          />
          <label htmlFor='progressOnScoreSelected' className='text-sm font-medium text-gray-700'>
            Auto Continue
          </label>
        </div>
      </div>

      {!Array.from(questions?.values() || []).find((question) => !question.unsubmittedScore) && (
        <>
          <br />
          <br />
          <Link to={`/quiz/${id}/enter`}>
            <Button>Submit Results</Button>
          </Link>
        </>
      )}

      <br />
      <br />

      <QuestionOverview quizId={id} questions={Array.from(questions.values())} selectedNumber={questionNum} />
    </div>
  );
}

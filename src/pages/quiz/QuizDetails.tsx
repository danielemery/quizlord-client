import { Link, useParams, useNavigate } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import { Fragment } from 'preact';

import Button from '../../components/Button';
import Loader from '../../components/Loader';
import { Table } from '../../components/Table';
import { useQuizlord } from '../../context/QuizlordProvider';
import {
  formatDate,
  formatDateTime,
  formatDateTimeShortDate,
  formatDateTimeShortTime,
  userIdentifier,
} from '../../helpers/helpers';
import { AI_PROCESS_QUIZ_IMAGES, MARK_INACCURATE_OCR, QUIZ, QUIZZES } from '../../queries/quiz';
import { MARK_QUIZ_ILLEGIBLE } from '../../queries/quiz';
import { userCanPerformAction } from '../../services/authorization';
import { QuizCompletion, QuizQuestion, QuizQuestionWithResults, Quiz as QuizType } from '../../types/quiz';
import QuizImageComponent from './QuizImage';
import QuizQuestions from './QuizQuestions';

const imageTypeSortValues: {
  [imageType: string]: number;
} = {
  QUESTION: 1,
  ANSWER: 2,
  QUESTION_AND_ANSWER: 3,
};

export default function Quiz() {
  const { id } = useParams();
  const { loading, data } = useQuery<{
    quiz: QuizType;
  }>(QUIZ, {
    variables: { id },
  });
  const navigate = useNavigate();
  const { user } = useQuizlord();
  const [markQuizIllegible, { loading: isMarkingQuizIllegible }] = useMutation(MARK_QUIZ_ILLEGIBLE, {
    refetchQueries: [{ query: QUIZZES }],
    onCompleted: () => {
      navigate('/');
    },
  });
  const [markInaccurateOCR, { loading: isMarkingQuizInaccurateOCR }] = useMutation(MARK_INACCURATE_OCR, {
    refetchQueries: [{ query: QUIZ, variables: { id } }],
  });
  const [aiProcessQuizImages, { loading: isProcessingQuizImages }] = useMutation(AI_PROCESS_QUIZ_IMAGES, {
    refetchQueries: [{ query: QUIZ, variables: { id } }],
  });

  if (loading || data === undefined) return <Loader message='Loading your quiz...' className='mt-10' />;

  return (
    <div>
      <div className='shadow sm:rounded-md sm:overflow-hidden'>
        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
          <dl className='my-2 grid gap-x-6 gap-y-10 grid-cols-2'>
            <div>
              <dt className='text-sm lg:font-medium text-gray-900'>Date</dt>
              <dd className='text-xs mt-2 lg:text-sm text-gray-500'>{formatDate(data.quiz.date)}</dd>
            </div>
            <div>
              <dt className='text-sm lg:font-medium text-gray-900'>Type</dt>
              <dd className='text-xs mt-2 lg:text-sm text-gray-500'>{data.quiz.type}</dd>
            </div>
            <div>
              <dt className='text-sm lg:font-medium text-gray-900'>Uploaded By</dt>
              <dd className='text-xs mt-2 lg:text-sm text-gray-500'>{userIdentifier(data.quiz.uploadedBy)}</dd>
            </div>
            <div>
              <dt className='text-sm lg:font-medium text-gray-900'>Uploaded At</dt>
              <dd className='text-xs mt-2 lg:text-sm text-gray-500'>{formatDateTime(data.quiz.uploadedAt)}</dd>
            </div>
            {userCanPerformAction(user, 'TRIGGER_AI_PROCESSING') && (
              <div>
                <dt className='text-sm lg:font-medium text-gray-900'>AI Processing Status</dt>
                <dd className='text-xs mt-2 lg:text-sm text-gray-500'>{data.quiz.aiProcessingState}</dd>
              </div>
            )}
          </dl>
          {data.quiz.questions.length > 0 ? (
            <QuizQuestions
              questions={packAnswersIntoQuestions(data.quiz.questions, data.quiz.completions, user?.email)}
              reportedInaccurateOCR={data.quiz.reportedInaccurateOCR}
            />
          ) : null}
          {[...data.quiz.images]
            .sort((a, b) => {
              return imageTypeSortValues[a.type] - imageTypeSortValues[b.type];
            })
            .map((image) => (
              <QuizImageComponent key={image.imageLink} image={image} className='mt-2' />
            ))}
          <div className='space-x-2'>
            <Link className='mt-4' to='./enter'>
              <Button disabled={isMarkingQuizIllegible}>Record Results</Button>
            </Link>
            <Button onClick={() => markQuizIllegible({ variables: { id } })} disabled={isMarkingQuizIllegible} warning>
              Mark Quiz Illegible
            </Button>
            {!data.quiz.reportedInaccurateOCR && (
              <Button
                onClick={() => markInaccurateOCR({ variables: { id } })}
                disabled={isMarkingQuizInaccurateOCR}
                warning
              >
                Mark Inaccurate OCR
              </Button>
            )}

            {userCanPerformAction(user, 'TRIGGER_AI_PROCESSING') && data.quiz.aiProcessingState !== 'QUEUED' && (
              <Button
                onClick={() => aiProcessQuizImages({ variables: { id } })}
                disabled={isProcessingQuizImages}
                warning
              >
                Trigger AI Processing
              </Button>
            )}
          </div>
        </div>
      </div>
      <Table className='lg:my-8'>
        <Table.Head>
          <>
            <Table.Row className='hidden lg:table-row' isHeader>
              <Table.HeaderCell>Completed At</Table.HeaderCell>
              <Table.HeaderCell>Participants</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
            <Table.Row className='lg:hidden' isHeader>
              <Table.HeaderCell>Completion</Table.HeaderCell>
              <Table.HeaderCell>Participants</Table.HeaderCell>
            </Table.Row>
          </>
        </Table.Head>
        <Table.Body>
          {data.quiz.completions.map((completion) => (
            <Fragment key={completion.completedAt}>
              <Table.Row className='hidden lg:table-row'>
                <Table.Cell>{formatDateTime(completion.completedAt)}</Table.Cell>
                <Table.Cell>
                  {completion.completedBy.map((completedByUser) => userIdentifier(completedByUser)).join(', ')}
                </Table.Cell>
                <Table.Cell>{completion.score}</Table.Cell>
              </Table.Row>
              <Table.Row className='lg:hidden'>
                <Table.Cell>
                  <ul>
                    <li className='font-medium'>Score: {completion.score}</li>
                    <li className='italic'>{formatDateTimeShortDate(completion.completedAt)}</li>
                    <li className='italic'>{formatDateTimeShortTime(completion.completedAt)}</li>
                  </ul>
                </Table.Cell>
                <Table.Cell>
                  <ul>
                    {completion.completedBy.map((p) => (
                      <li key={p.email}>{userIdentifier(p)}</li>
                    ))}
                  </ul>
                </Table.Cell>
              </Table.Row>
            </Fragment>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

function packAnswersIntoQuestions(
  questions: QuizQuestion[],
  completions: QuizCompletion[],
  currentUserEmail?: string,
): QuizQuestionWithResults[] {
  return questions.map((question) => {
    const resultsForQuestion = completions
      .filter((completion) => completion.questionResults?.length)
      .map((completion) => {
        const questionResult = completion.questionResults.find((result) => result.questionId === question.id);
        return {
          users: completion.completedBy,
          score: questionResult ? questionResult.score : 'INCORRECT',
        };
      });
    const myScore = currentUserEmail
      ? resultsForQuestion.find((result) => result.users.some((user) => user.email === currentUserEmail))?.score
      : undefined;
    const averageScore =
      resultsForQuestion.length > 0
        ? resultsForQuestion.reduce((acc, result) => {
            if (result.score === 'CORRECT') return acc + 1;
            if (result.score === 'HALF_CORRECT') return acc + 0.5;
            return acc;
          }, 0) / resultsForQuestion.length
        : undefined;
    const userResults = resultsForQuestion.map((result) => ({
      users: result.users.map((user) => userIdentifier(user)),
      score: result.score,
    }));
    return {
      ...question,
      userResults,
      myScore,
      averageScore,
    };
  });
}

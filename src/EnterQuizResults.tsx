import { Link, useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'preact/hooks';

import { useQuizlord } from './QuizlordProvider';
import Button from './components/Button';
import Loader from './components/Loader';
import LoaderOverlay from './components/LoaderOverlay';
import { UserSelector } from './components/UserSelector';
import { formatDate, userIdentifier } from './helpers';
import { COMPLETE_QUIZ, QUIZ, QUIZ_AND_AVAILABLE_USERS, QUIZZES } from './queries/quiz';
import { Quiz } from './types/quiz';
import { User } from './types/user';

export default function EnterQuizResults() {
  const { id } = useParams();
  const { loading, data } = useQuery<{
    quiz: Quiz;
    users: { edges: { node: User }[] };
  }>(QUIZ_AND_AVAILABLE_USERS, {
    variables: { id },
  });

  const [completeQuiz, { loading: isCompletingQuiz }] = useMutation(COMPLETE_QUIZ, {
    refetchQueries: [
      { query: QUIZ, variables: { id } },
      { query: QUIZ_AND_AVAILABLE_USERS, variables: { id } },
      { query: QUIZZES },
    ],
  });

  const { user: authenticatedUser } = useQuizlord();

  async function handleSubmit(score: number, participants: string[]) {
    const participantsWithAuthenticatedUser = [authenticatedUser?.email, ...participants];
    await completeQuiz({
      variables: { quizId: id, completedBy: participantsWithAuthenticatedUser, score },
    });
    setComplete(true);
  }

  const [score, setScore] = useState<number>(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  if (!data || loading) {
    return <Loader message='Loading your quiz...' />;
  }

  return (
    <div className='shadow sm:rounded-md sm:overflow-hidden relative'>
      {isCompletingQuiz && (
        <LoaderOverlay>
          <Loader message='Submitting your results...' className='mt-10' />
        </LoaderOverlay>
      )}
      <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
        {!complete ? (
          <>
            <div>
              <h2 className='mb-0'>Enter Results</h2>
              <p className='text-sm text-gray-500'>
                for {formatDate(data.quiz.date)} {data.quiz.type}
              </p>
            </div>
            <div>
              <label htmlFor='score' className='block text-sm font-medium text-gray-700'>
                Score
              </label>
              <div className='mt-1'>
                <input
                  type='number'
                  name='score'
                  autoComplete='quiz-score'
                  value={score}
                  onChange={(e) => setScore(parseFloat((e.target as HTMLInputElement).value))}
                  className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                />
              </div>
            </div>
            <div>
              <label htmlFor='participants' className='block text-sm font-medium text-gray-700'>
                Participants
              </label>
              <p className='text-sm text-gray-500'>
                {userIdentifier(authenticatedUser)} <strong>AND</strong>
              </p>
              <UserSelector
                availableUsers={data.users.edges
                  .map((user) => user.node)
                  .filter((userNode) => userNode.email !== authenticatedUser?.email)}
                selectedUserEmails={participants}
                onSelectionsChanged={setParticipants}
                name='participants'
              />
            </div>
          </>
        ) : (
          <>
            <p className='mt-2 text-sm text-gray-500'>Score Recorded Successfully.</p>
            <Link to={`/quiz/${id}`}>
              <Button danger className='mt-4 mr-2'>
                Return to Quiz
              </Button>
            </Link>
            <Link to={`/`}>
              <Button danger className='mt-4'>
                Return to List
              </Button>
            </Link>
          </>
        )}
      </div>
      {!complete && (
        <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
          <Link to={`/quiz/${id}`}>
            <Button className='mr-2' danger disabled={isCompletingQuiz}>
              Cancel
            </Button>
          </Link>
          <Button onClick={() => handleSubmit(score, participants)} disabled={isCompletingQuiz}>
            Submit Results
          </Button>
        </div>
      )}
    </div>
  );
}

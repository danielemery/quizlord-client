import { Link, useNavigate, useParams } from 'react-router-dom';

import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'preact/hooks';

import Button from '../../../components/Button';
import Loader from '../../../components/Loader';
import LoaderOverlay from '../../../components/LoaderOverlay';
import { useQuizlord } from '../../../context/QuizlordProvider';
import { formatDate } from '../../../helpers/helpers';
import { DELETE_QUIZ, QUIZ, QUIZZES } from '../../../queries/quiz';
import { userCanDeleteQuiz } from '../../../services/authorization';
import { Quiz } from '../../../types/quiz';
import { User } from '../../../types/user';

export default function DeleteQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery<{
    quiz: Quiz;
    users: { edges: { node: User }[] };
  }>(QUIZ, {
    variables: { id },
  });
  const { user } = useQuizlord();

  const [deletionReason, setDeletionReason] = useState<string>('');

  const [deleteQuiz, { loading: isDeletingQuiz }] = useMutation(DELETE_QUIZ, {
    refetchQueries: [{ query: QUIZZES }],
    onCompleted: () => {
      navigate('/');
    },
  });

  if (!data || !user || loading) {
    return <Loader message='Loading...' />;
  }

  return userCanDeleteQuiz(user, data.quiz) ? (
    <>
      <div className='border-2 border-red-500'></div>
      <div className='shadow sm:rounded-md sm:overflow-hidden relative'>
        {isDeletingQuiz && (
          <LoaderOverlay>
            <Loader message='Deleting quiz...' className='mt-10' />
          </LoaderOverlay>
        )}
        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
          {
            <>
              <div>
                <h2 className='mb-0'>Deleting Quiz</h2>
                <p className='text-sm text-gray-500'>
                  {data.quiz.type} {formatDate(data.quiz.date)}
                </p>
              </div>
              <div>
                <label htmlFor='score' className='block text-sm font-medium text-gray-700'>
                  Reason for deletion
                </label>
                <div className='mt-1'>
                  <input
                    name='deletionReason'
                    autoComplete='deletion-reason'
                    value={deletionReason}
                    onChange={(e) => setDeletionReason((e.target as HTMLInputElement).value)}
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                  />
                </div>
              </div>
            </>
          }
        </div>
        <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
          <Link to={`/quiz/${id}`}>
            <Button className='mr-2' danger disabled={isDeletingQuiz}>
              Cancel
            </Button>
          </Link>
          <Button
            onClick={() =>
              deleteQuiz({
                variables: { id, deletionReason: deletionReason.length === 0 ? undefined : deletionReason },
              })
            }
            disabled={isDeletingQuiz}
          >
            Delete Quiz
          </Button>
        </div>
      </div>
    </>
  ) : (
    <span>Oops! you don&apos;t seem to have access to delete a quiz.</span>
  );
}

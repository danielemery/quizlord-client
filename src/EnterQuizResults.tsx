import { useState } from 'preact/hooks';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { User } from './QuizDetails';
import Button from './components/Button';
import { formatDate } from './helpers';
import { COMPLETE_QUIZ, QUIZ, QUIZ_AND_AVAILABLE_USERS, QUIZZES } from './queries/quiz';
import { Quiz } from './types/quiz';

export default function EnterQuizResults() {
  const { id } = useParams();
  const { loading, data } = useQuery<{
    quiz: Quiz;
    users: { edges: { node: User }[] };
  }>(QUIZ_AND_AVAILABLE_USERS, {
    variables: { id },
  });

  const [completeQuiz] = useMutation(COMPLETE_QUIZ, {
    refetchQueries: [
      { query: QUIZ, variables: { id } },
      { query: QUIZ_AND_AVAILABLE_USERS, variables: { id } },
      { query: QUIZZES },
    ],
  });

  async function handleSubmit(score: number, participants: string[]) {
    if (participants.length === 0) {
      alert('At least one participant must be selected');
    } else {
      await completeQuiz({
        variables: { quizId: id, completedBy: participants, score },
      });
      setComplete(true);
    }
  }

  const [score, setScore] = useState<number>(0);
  const [participants, setParticipants] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  if (!data || loading) {
    return <span>Loading...</span>;
  }

  return (
    <div className='shadow sm:rounded-md sm:overflow-hidden'>
      <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
        {!complete ? (
          <>
            <div>
              <h2 className='mb-0'>Enter Results</h2>
              <p className='text-sm text-gray-500'>
                for {data.quiz.type} on {formatDate(data.quiz.date)}
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
              <select
                multiple
                id='participants'
                name='participants'
                className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                onChange={(e) => {
                  const items = [...(e.target as HTMLSelectElement).selectedOptions];
                  setParticipants(items.map((item) => item.value));
                }}
              >
                {data.users.edges
                  .map((u) => u.node)
                  .map((user) => (
                    <option selected={participants.includes(user.email)} value={user.email}>
                      {user.email}
                    </option>
                  ))}
              </select>
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
            <Button className='mr-2' danger>
              Cancel
            </Button>
          </Link>
          <Button onClick={() => handleSubmit(score, participants)}>Submit Results</Button>
        </div>
      )}
    </div>
  );
}

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const QUIZ = gql`
  query GetQuiz($id: String) {
    quiz(id: $id) {
      id
      state
      date
      imageLink
      type
    }
  }
`;

export default function Quiz() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(QUIZ, { variables: { id } });
  if (loading) return <span>Loading...</span>;

  return (
    <>
      <dl className="my-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
        <div>
          <dt className="font-medium text-gray-900">Date</dt>
          <dd className="mt-2 text-sm text-gray-500">
            {new Date(data.quiz.date).toDateString()}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Type</dt>
          <dd className="mt-2 text-sm text-gray-500">{data.quiz.type}</dd>
        </div>
      </dl>
      <img src={data.quiz.imageLink} />
    </>
  );
}

import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { Table } from "./components/Table";

const QUIZ = gql`
  query GetQuiz($id: String!) {
    quiz(id: $id) {
      id
      state
      date
      imageLink
      type
      uploadedBy
      uploadedAt
      completions {
        completedAt
        completedBy
        score
      }
    }
  }
`;

interface QuizCompletion {
  completedAt: string;
  completedBy: string[];
  score: number;
}

interface Quiz {
  id: string;
  state: string;
  date: string;
  imageLink: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  completions: QuizCompletion[];
}

export default function Quiz() {
  const { id } = useParams();
  const { loading, error, data } = useQuery<{ quiz: Quiz }>(QUIZ, {
    variables: { id },
  });
  if (loading || data === undefined) return <span>Loading...</span>;

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
        <div>
          <dt className="font-medium text-gray-900">Uploaded By</dt>
          <dd className="mt-2 text-sm text-gray-500">{data.quiz.uploadedBy}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-900">Uploaded At</dt>
          <dd className="mt-2 text-sm text-gray-500">
            {new Date(data.quiz.uploadedAt).toDateString()}
          </dd>
        </div>
      </dl>
      <img src={data.quiz.imageLink} />
      <Table className="my-8">
        <Table.Head>
          <Table.Row isHeader>
            <Table.HeaderCell>Completed At</Table.HeaderCell>
            <Table.HeaderCell>Participants</Table.HeaderCell>
            <Table.HeaderCell>Score</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.quiz.completions.map((completion) => (
            <Table.Row>
              <Table.Cell>{completion.completedAt}</Table.Cell>
              <Table.Cell>{completion.completedBy.join(", ")}</Table.Cell>
              <Table.Cell>{completion.score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
}

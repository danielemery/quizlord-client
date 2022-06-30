import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const QUIZZES = gql`
  query GetQuizzes($after: String, $first: Int) {
    quizzes(after: $after, first: $first) {
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          date
          type
          uploadedBy
        }
      }
    }
  }
`;

interface Node {
  imageLink: string;
  date: Date;
  type: string;
  id: string;
  uploadedBy: string;
}

function QuizListTh(props: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className="text-sm font-medium text-white px-6 py-4 text-left"
    />
  );
}

function QuizListTd(props: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left"
    />
  );
}

export default function QuizList() {
  const { loading, error, data } = useQuery(QUIZZES);
  const navigate = useNavigate();

  if (loading) return <span>Loading...</span>;
  return (
    <table class="border-collapse table-auto w-full text-sm">
      <thead className="border-b bg-gray-800">
        <tr>
          <QuizListTh>Quiz Date</QuizListTh>
          <QuizListTh>Type</QuizListTh>
          <QuizListTh>Uploaded By</QuizListTh>
        </tr>
      </thead>
      <tbody>
        {data.quizzes.edges.map(({ node }: { node: Node }) => (
          <tr
            key={node.id}
            className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
            onClick={() => navigate(`/quiz/${node.id}`)}
          >
            <QuizListTd>{new Date(node.date).toLocaleDateString()}</QuizListTd>
            <QuizListTd>{node.type}</QuizListTd>
            <QuizListTd>{node.uploadedBy}</QuizListTd>
          </tr>
        ))}
        {/* <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
            <QuizListTd colSpan={2}>Load More</QuizListTd>
          </tr> */}
      </tbody>
    </table>
  );
}

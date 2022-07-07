import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Table } from "./components/Table";

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
          myCompletions {
            completedAt
            score
          }
        }
      }
    }
  }
`;

interface QuizCompletion {
  completedAt: string;
  score: number;
}

interface Node {
  id: string;
  date: Date;
  type: string;
  uploadedBy: string;
  myCompletions: QuizCompletion[];
}

export default function QuizList() {
  const { loading, error, data } = useQuery(QUIZZES);
  const navigate = useNavigate();

  if (loading) return <span>Loading...</span>;
  return (
    <Table>
      <Table.Head>
        <Table.Row isHeader>
          <Table.HeaderCell>Quiz Date</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Uploaded By</Table.HeaderCell>
          <Table.HeaderCell>Completed</Table.HeaderCell>
          <Table.HeaderCell>Result</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {data.quizzes.edges.map(({ node }: { node: Node }) => (
          <Table.Row
            isHoverable
            key={node.id}
            onClick={() => navigate(`/quiz/${node.id}`)}
          >
            <Table.Cell>{new Date(node.date).toLocaleDateString()}</Table.Cell>
            <Table.Cell>{node.type}</Table.Cell>
            <Table.Cell>{node.uploadedBy}</Table.Cell>
            <Table.Cell>
              {node.myCompletions.length > 0
                ? new Date(
                    node.myCompletions[0].completedAt
                  ).toLocaleDateString()
                : ""}
            </Table.Cell>
            <Table.Cell>
              {node.myCompletions.length > 0 ? node.myCompletions[0].score : ""}
            </Table.Cell>
          </Table.Row>
        ))}
        {/* <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
            <QuizListTd colSpan={2}>Load More</QuizListTd>
          </tr> */}
      </Table.Body>
    </Table>
  );
}

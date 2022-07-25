import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Button from './components/Button';
import { Table } from './components/Table';

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
  const { loading, data, fetchMore } = useQuery(QUIZZES);
  const navigate = useNavigate();

  if (loading) return <span>Loading...</span>;

  const nodes = data.quizzes.edges;
  const pageInfo = data.quizzes.pageInfo;

  return (
    <>
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
          {nodes.map(({ node }: { node: Node }) => (
            <Table.Row isHoverable key={node.id} onClick={() => navigate(`/quiz/${node.id}`)}>
              <Table.Cell>{new Date(node.date).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{node.type}</Table.Cell>
              <Table.Cell>{node.uploadedBy}</Table.Cell>
              <Table.Cell>
                {node.myCompletions.length > 0 ? new Date(node.myCompletions[0].completedAt).toLocaleDateString() : ''}
              </Table.Cell>
              <Table.Cell>{node.myCompletions.length > 0 ? node.myCompletions[0].score : ''}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {pageInfo.hasNextPage && (
        <div className='flex justify-center items-center mt-4'>
          <Button onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}>Load More...</Button>
        </div>
      )}
    </>
  );
}

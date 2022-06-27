import { gql, useQuery } from "@apollo/client";

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
          state
          date
          imageLink
          type
        }
      }
    }
  }
`;

interface Node {
  imageLink: string;
  date: Date;
  type: string;
}

export function App() {
  const { loading, error, data, refetch } = useQuery(QUIZZES);
  console.log(loading, error, data);
  if (loading) return <span>Loading...</span>;
  return (
    <>
      <h1>Quizlord</h1>
      <button onClick={() => refetch()}>Refetch</button>
      <br />
      <br />
      {data.quizzes.edges.map(({ node }: { node: Node }) => (
        <span>
          <a href={node.imageLink}>
            {node.type} - {new Date(node.date).toLocaleDateString()}
          </a>
        </span>
      ))}
    </>
  );
}

import { useState } from "preact/hooks";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link, Route, Routes } from "react-router-dom";

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

const CREATE_QUIZ = gql`
  mutation CreateQuiz($type: QuizType!, $date: Date!, $fileName: String!) {
    createQuiz(type: $type, date: $date, fileName: $fileName) {
      quiz {
        id
        date
        imageLink
        state
        type
      }
      uploadLink
    }
  }
`;

interface Node {
  imageLink: string;
  date: Date;
  type: string;
}

export function App() {
  return (
    <>
      <h1>Quizlord</h1>
      <Routes>
        <Route path="/" element={<QuizList />} />
        <Route path="/quiz/create" element={<CreateQuiz />} />
      </Routes>
    </>
  );
}

function QuizList() {
  const { loading, error, data, refetch } = useQuery(QUIZZES);
  if (loading) return <span>Loading...</span>;
  return (
    <>
      <button onClick={() => refetch()}>Refetch</button>
      <Link to="/quiz/create">Create</Link>
      <br />
      <br />
      {data.quizzes.edges.map(({ node }: { node: Node }) => (
        <div>
          {node.type} - {new Date(node.date).toLocaleDateString()}
          <img
            src={node.imageLink}
            alt={`${node.type} - ${new Date(node.date).toLocaleDateString()}`}
          />
        </div>
      ))}
    </>
  );
}

function CreateQuiz() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [createQuiz, { data, loading, error }] = useMutation(CREATE_QUIZ);

  function fileChangeHandler(event: any) {
    setSelectedFile(event.target.files[0]);
  }

  async function handleSubmission() {
    if (!selectedFile) {
      alert("No file selected!");
    } else {
      const type = "SHARK";
      const fileName = selectedFile.name;
      const result = await createQuiz({
        variables: { type, date: selectedDate, fileName },
      });
      await fetch(result.data.createQuiz.uploadLink, {
        method: "PUT",
        body: selectedFile,
      });
    }
  }

  return (
    <div>
      <Link to="/">Back</Link>
      <input type="file" name="file" onChange={fileChangeHandler} />
      <input
        type="date"
        name="date"
        onChange={(e) =>
          setSelectedDate(new Date((e.target as HTMLInputElement).value))
        }
      />
      <select
        name="type"
        onChange={(e) => setSelectedType((e.target as HTMLSelectElement).value)}
      >
        <option value="SHARK">Shark</option>
        <option value="BRAINWAVES">Brainwaves</option>
      </select>
      <button onClick={handleSubmission}>Submit</button>
    </div>
  );
}

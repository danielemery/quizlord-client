import { useState } from "preact/hooks";
import { Link } from "react-router-dom";
import Button from "./Button";
import { gql, useMutation } from "@apollo/client";

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

export function CreateQuiz() {
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
      <Button onClick={handleSubmission}>Submit</Button>
    </div>
  );
}

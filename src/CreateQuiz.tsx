import { useEffect, useState } from "preact/hooks";
import { Link } from "react-router-dom";
import Button from "./components/Button";
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
  const [filePreview, setFilePreview] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<string>("SHARK");
  const [createQuiz, { data, loading, error }] = useMutation(CREATE_QUIZ);

  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // create the preview
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  function fileChangeHandler(event: any) {
    setSelectedFile(event.target.files[0]);
  }

  async function handleSubmission() {
    if (!selectedFile) {
      alert("No file selected!");
    } else {
      const type = selectedType;
      const fileName = selectedFile.name;
      const result = await createQuiz({
        variables: { type, date: selectedDate, fileName },
      });
      await fetch(result.data.createQuiz.uploadLink, {
        method: "PUT",
        body: selectedFile,
      });
      setComplete(true);
    }
  }

  return (
    <div>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          {!complete ? (
            <>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Quiz Type
                </label>
                <select
                  onChange={(e) =>
                    setSelectedType((e.target as HTMLSelectElement).value)
                  }
                  id="type"
                  name="type"
                  autoComplete="quiz-type"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="SHARK">Shark</option>
                  <option value="BRAINWAVES">Brainwaves</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="date"
                    autoComplete="quiz-date"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    onChange={(e) =>
                      setSelectedDate(
                        new Date((e.target as HTMLInputElement).value)
                      )
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  The date the quiz was published.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quiz Image
                </label>
                {selectedFile ? (
                  <img src={filePreview} />
                ) : (
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        id="file-upload"
                        name="file"
                        onChange={fileChangeHandler}
                      />
                    </label>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-500">
                Quiz Created Successfully.
                <br />
                It may take a moment to appear in the list.
              </p>
              <Link to="/">
                <Button className="mt-4">Return to List</Button>
              </Link>
            </>
          )}
        </div>
        {!complete && (
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Link to="/">
              <Button className="mr-2" danger>Cancel</Button>
            </Link>
            <Button onClick={handleSubmission}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
}

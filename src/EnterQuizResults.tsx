import { useState } from "preact/hooks";
import Button from "./components/Button";
import { User } from "./QuizDetails";

export interface EnterQuizResultsProps {
  availableUsers: User[];
  handleSubmit: (score: number, participants: string[]) => Promise<void>;
}

export default function EnterQuizResults(props: EnterQuizResultsProps) {
  const { availableUsers, handleSubmit } = props;

  const [score, setScore] = useState<number>(0);
  const [participants, setParticipants] = useState<string[]>([]);

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
        <h2>My Results</h2>
        <div>
          <label
            htmlFor="score"
            className="block text-sm font-medium text-gray-700"
          >
            Score
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="score"
              autoComplete="quiz-score"
              value={score}
              onChange={(e) =>
                setScore(parseFloat((e.target as HTMLInputElement).value))
              }
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white space-y-6 sm:p-6">
        <div>
          <label
            htmlFor="participants"
            className="block text-sm font-medium text-gray-700"
          >
            Participants
          </label>
          <select
            multiple
            id="participants"
            name="participants"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onChange={(e) => {
              const items = [
                ...(e.target as HTMLSelectElement).selectedOptions,
              ];
              setParticipants(items.map((item) => item.value));
            }}
          >
            {availableUsers.map((user) => (
              <option
                selected={participants.includes(user.email)}
                value={user.email}
              >
                {user.email}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Button onClick={() => handleSubmit(score, participants)}>
          Submit Results
        </Button>
      </div>
    </div>
  );
}

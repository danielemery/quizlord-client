import { useState } from 'preact/hooks';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import QuizImageUpload, { FileAttributes } from './QuizImageUpload';
import Button from './components/Button';
import { CREATE_QUIZ, QUIZZES } from './queries/quiz';

const defaultAttributes: FileAttributes = {
  type: 'QUESTION_AND_ANSWER',
};

export function CreateQuiz() {
  const [selectedFiles, setSelectedFiles] = useState<
    { file?: File | undefined; attributes: FileAttributes; id: string }[]
  >([{ id: uuidv4(), attributes: { ...defaultAttributes } }]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedType, setSelectedType] = useState<string>('SHARK');
  const [createQuiz] = useMutation(CREATE_QUIZ, {
    refetchQueries: [{ query: QUIZZES }],
  });

  const [complete, setComplete] = useState(false);

  function handleFileAttributesChanged(id: string, newAttributes: FileAttributes) {
    setSelectedFiles((prevFiles) => prevFiles.map((f) => (f.id === id ? { ...f, attributes: newAttributes } : f)));
  }

  function handleFileSelected(id: string, newFile: File) {
    setSelectedFiles((prevFiles) => prevFiles.map((f) => (f.id === id ? { ...f, file: newFile } : f)));
  }

  function handleExtraImageRequested() {
    setSelectedFiles((selectedFiles) => [...selectedFiles, { id: uuidv4(), attributes: { ...defaultAttributes } }]);
  }

  function handleFileRemoved(id: string) {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }

  async function handleSubmission() {
    if (selectedFiles.find((file) => file.file === undefined)) {
      alert('At least one file missing!');
    } else if (selectedDate === undefined) {
      alert('No date selected!');
    } else {
      const type = selectedType;
      const result = await createQuiz({
        variables: {
          type,
          date: selectedDate,
          files: selectedFiles.map((file) => ({ fileName: file.file?.name, type: file.attributes.type })),
        },
      });
      await Promise.all(
        result.data.createQuiz.uploadLinks.map((link: { link: string; fileName: string }) => {
          const matchingFile = selectedFiles.find((file) => file.file?.name === link.fileName);
          if (!matchingFile) {
            throw new Error('Unexpected error uploading file');
          }
          return fetch(link.link, {
            method: 'PUT',
            body: matchingFile.file,
          });
        }),
      );
      setComplete(true);
    }
  }

  return (
    <div>
      <div className='shadow sm:rounded-md sm:overflow-hidden'>
        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
          {!complete ? (
            <>
              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='type' className='block text-sm font-medium text-gray-700'>
                  Quiz Type
                </label>
                <select
                  onChange={(e) => setSelectedType((e.target as HTMLSelectElement).value)}
                  id='type'
                  name='type'
                  autoComplete='quiz-type'
                  className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value='SHARK'>Shark</option>
                  <option value='BRAINWAVES'>Brainwaves</option>
                </select>
              </div>
              <div>
                <label htmlFor='date' className='block text-sm font-medium text-gray-700'>
                  Date
                </label>
                <div className='mt-1'>
                  <input
                    type='date'
                    name='date'
                    autoComplete='quiz-date'
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                    onChange={(e) => setSelectedDate(new Date((e.target as HTMLInputElement).value))}
                  />
                </div>
                <p className='mt-2 text-sm text-gray-500'>The date the quiz was published.</p>
              </div>
              {selectedFiles.map((file) => (
                <QuizImageUpload
                  key={file.id}
                  selectedFile={file.file}
                  fileAttributes={file.attributes}
                  onFileAttributesChanged={(attr) => handleFileAttributesChanged(file.id, attr)}
                  onFileSelected={(selectedFile) => handleFileSelected(file.id, selectedFile)}
                  onFileRemoved={() => handleFileRemoved(file.id)}
                  isLastFile={selectedFiles.length <= 1}
                />
              ))}
              <Button onClick={handleExtraImageRequested}>Add another image</Button>
            </>
          ) : (
            <>
              <p className='mt-2 text-sm text-gray-500'>Quiz Created Successfully.</p>
              <Link to='/'>
                <Button danger className='mt-4'>
                  Return to List
                </Button>
              </Link>
            </>
          )}
        </div>
        {!complete && (
          <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
            <Link to='/'>
              <Button className='mr-2' danger>
                Cancel
              </Button>
            </Link>
            <Button onClick={handleSubmission}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
}

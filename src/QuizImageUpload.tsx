import { useState, useEffect } from 'preact/hooks';

import Button from './components/Button';
import { QuizImageType } from './types/quiz';

export interface FileAttributes {
  type: QuizImageType;
}

interface QuizImageUploadProps {
  selectedFile?: File;
  fileAttributes?: FileAttributes;
  onFileSelected: (file: File) => void;
  onFileAttributesChanged: (attributes: FileAttributes) => void;
  onFileRemoved: () => void;
  isLastFile: boolean;
}

export default function QuizImageUpload({
  selectedFile,
  onFileSelected,
  fileAttributes,
  onFileAttributesChanged,
  onFileRemoved,
  isLastFile,
}: QuizImageUploadProps) {
  const [filePreview, setFilePreview] = useState<string | undefined>();

  useEffect(() => {
    // create the preview
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setFilePreview(objectUrl);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  return (
    <div className='border-solid border-b-2 pb-4'>
      <label className='block text-sm font-medium text-gray-700'>Quiz Image</label>
      {selectedFile ? (
        <img src={filePreview} className='inline-block h-48' />
      ) : (
        <div className='flex text-sm text-gray-600'>
          <label
            htmlFor='file-upload'
            className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
          >
            <span>Upload a file</span>
            <input
              type='file'
              className='sr-only'
              id='file-upload'
              name='file'
              onChange={(e) => {
                const fileElement = e.target as HTMLInputElement;
                if (fileElement.files === null) {
                  alert('Must select a file');
                } else {
                  onFileSelected(fileElement.files[0]);
                }
              }}
            />
          </label>
        </div>
      )}
      <div className='col-span-6 sm:col-span-3'>
        <select
          value={fileAttributes?.type}
          onChange={(e) => onFileAttributesChanged({ type: (e.target as HTMLSelectElement).value as QuizImageType })}
          id='type'
          name='type'
          autoComplete='quiz-type'
          className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
          <option value='QUESTION_AND_ANSWER'>Question and Answer</option>
          <option value='QUESTION'>Question</option>
          <option value='ANSWER'>Answer</option>
        </select>
      </div>
      {!isLastFile && (
        <Button onClick={() => onFileRemoved()} className='mt-2' danger>
          Remove File
        </Button>
      )}
    </div>
  );
}

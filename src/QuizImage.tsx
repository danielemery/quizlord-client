import { useState } from 'preact/hooks';
import classnames from 'classnames';
import Button from './components/Button';
import { QuizImage, QuizImageType } from './types/quiz';

interface QuizImageProps {
  image: QuizImage;
  className: string;
}

function typeToHeading(type: QuizImageType) {
  switch (type) {
    case 'ANSWER':
      return { title: 'Answers', subtitle: "This image contains answers, it's hidden by default" };
    case 'QUESTION':
      return { title: 'Questions' };
    case 'QUESTION_AND_ANSWER':
      return { title: 'Questions with Answers', subtitle: "This image contains answers, it's hidden by default" };
  }
}

export default function QuizImageComponent({ image, className }: QuizImageProps) {
  const [isShown, setIsShown] = useState(image.type === 'QUESTION');
  const { title, subtitle } = typeToHeading(image.type);
  return (
    <div className={classnames('shadow sm:rounded-md sm:overflow-hidden', className)}>
      <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
        <div className='flex'>
          <h2 className='inline flex-auto font-semibold'>{title}</h2>
          <Button className='flex-none' onClick={() => setIsShown((prev) => !prev)}>
            {isShown ? 'Hide' : 'Show'}
          </Button>
          <a href={image.imageLink} target='_blank'>
            <Button className='flex-none ml-2'>Open</Button>
          </a>
        </div>
        {isShown && <img src={image.imageLink} />}
        {!isShown && subtitle && <p className='italic'>{subtitle}</p>}
      </div>
    </div>
  );
}

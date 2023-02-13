import classnames from 'classnames';
import { useState } from 'preact/hooks';

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
    <div className={classnames('border-solid border-y-2 py-2', className)}>
      <div className='mb-2 lg:mb-4 lg:flex'>
        <h2 className='lg:inline lg:flex-auto font-semibold mb-2'>{title}</h2>
        <Button danger className='flex-none' onClick={() => setIsShown((prev) => !prev)}>
          {isShown ? 'Hide' : 'Show'}
        </Button>
        <a href={image.imageLink} target='_blank'>
          <Button danger className='flex-none ml-2'>
            Open
          </Button>
        </a>
      </div>
      {isShown && <img src={image.imageLink} />}
      {!isShown && subtitle && <p className='italic'>{subtitle}</p>}
    </div>
  );
}

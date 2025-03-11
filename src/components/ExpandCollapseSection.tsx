import { ComponentChildren } from 'preact';
import { useState } from 'preact/hooks';

import Button from './Button';

export interface ExpandCollapseSectionProps {
  title: string;
  children: ComponentChildren;
  initiallyShown?: boolean;
  fallbackText?: string;
}

export function ExpandCollapseSection({
  title,
  children,
  initiallyShown = true,
  fallbackText,
}: ExpandCollapseSectionProps) {
  const [sectionShown, setSectionShown] = useState(initiallyShown);
  return (
    <div className='border-solid border-t-2 py-2'>
      <div className='mb-2 lg:mb-4 lg:flex'>
        <h2 className='lg:inline lg:flex-auto font-semibold mb-2'>{title}</h2>
        <Button danger className='flex-none' onClick={() => setSectionShown((prev) => !prev)}>
          {sectionShown ? 'Hide' : 'Show'}
        </Button>
      </div>
      {sectionShown && children}
      {!sectionShown && fallbackText && <p className='italic'>{fallbackText}</p>}
    </div>
  );
}

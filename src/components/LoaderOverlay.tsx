import { ComponentChildren } from 'preact';

export default function LoaderOverlay({ children }: { children: ComponentChildren }) {
  return (
    <div className='absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center'>
      {children}
    </div>
  );
}

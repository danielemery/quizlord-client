import { useVersionStore } from './services/version';

export default function Footer() {
  const apiVersion = useVersionStore((state) => state.version);
  return (
    <footer className='bg-slate-500 flex p-5 justify-between'>
      <span className='text-sm text-white'>© 2023 Quizlord</span>
      <span className='text-sm text-white flex flex-wrap'>
        <a className='ml-4 hover:underline' href='https://github.com/danielemery/quizlord-api/releases' target='_blank'>
          API [{apiVersion ?? 'X.X.X'}]
        </a>
        <a
          className='ml-4 hover:underline'
          href='https://github.com/danielemery/quizlord-client/releases'
          target='_blank'
        >
          Client [{window.env.VITE_QUIZLORD_VERSION}]
        </a>
      </span>
    </footer>
  );
}

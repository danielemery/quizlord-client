export default function Loader({ message = 'Loading...' }: { message: string }) {
  return (
    <div className='w-full h-full flex justify-center items-center mt-10'>
      <div className='flex h-full w-full items-center justify-center'>
        <div className='flex flex-col items-center'>
          <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 animate-spin'>
            <div className='h-9 w-9 rounded-full bg-slate-100'></div>
          </div>
          <div className='mt-10'>{message}</div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer class='fixed bottom-0 left-0 right-0 bg-slate-500'>
      <div class='w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between'>
        <span class='text-sm text-white sm:text-center'>© 2023 Quizlord</span>
        <ul class='flex flex-wrap items-center mt-3 text-sm font-medium text-white sm:mt-0 space-x-2'>
          <li>
            <a href='https://github.com/danielemery/quizlord-api/releases' class='hover:underline' target='_blank'>
              API [vX.X.X]
            </a>
          </li>
          <li>
            <a href='https://github.com/danielemery/quizlord-client/releases' class='hover:underline' target='_blank'>
              Client [{window.env.VITE_QUIZLORD_VERSION}]
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

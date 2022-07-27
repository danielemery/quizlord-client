import type { ComponentChildren } from 'preact';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

function NavigationBarItem({
  children,
  onClick,
  className,
}: {
  children: ComponentChildren;
  onClick?: () => void;
  className?: string;
}) {
  const mergedClasses = classnames(className, 'text-white px-3 py-2 text-sm font-medium');
  return (
    <button className={mergedClasses} onClick={onClick}>
      {children}
    </button>
  );
}

export default function NavigationBar({
  onLogout,
  onLogin,
  isAuthenticated,
  canUploadQuiz,
  userImage,
  userName,
}: {
  onLogout: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  canUploadQuiz: boolean;
  userImage?: string;
  userName?: string;
}) {
  return (
    <>
      <nav className='p-2 lg:p-4 flex bg-slate-500 text-white'>
        <div className='grow flex items-center'>
          <Link to='/'>
            <h1 className='inline-block text-3xl mr-8'>Quizlord</h1>
          </Link>
          {canUploadQuiz && (
            <Link className='hidden lg:block' to='/quiz/create'>
              <NavigationBarItem>Upload Quiz</NavigationBarItem>
            </Link>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <>
              <NavigationBarItem className='hidden lg:inline' onClick={() => onLogout()}>
                Log Out
              </NavigationBarItem>
              <img className='inline-block max-h-12 rounded-full' src={userImage} alt={userName} />
            </>
          ) : (
            <NavigationBarItem className='hidden lg:inline' onClick={() => onLogin()}>
              Log In
            </NavigationBarItem>
          )}
        </div>
      </nav>
      {canUploadQuiz && (
        <nav className='lg:hidden p-2 bg-slate-500 text-white flex justify-between'>
          <Link to='/quiz/create'>
            <NavigationBarItem>Upload Quiz</NavigationBarItem>
          </Link>
          {isAuthenticated ? (
            <>
              <NavigationBarItem onClick={() => onLogout()}>Log Out</NavigationBarItem>
            </>
          ) : (
            <NavigationBarItem onClick={() => onLogin()}>Log In</NavigationBarItem>
          )}
        </nav>
      )}
    </>
  );
}

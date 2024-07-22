import { Link } from 'react-router-dom';

import { faChartLine, faArrowUp, faRightFromBracket, faUsers, faListUl } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

function NavigationBarItem({
  title,
  onClick,
  className,
  icon,
  mobile = false,
}: {
  title?: string;
  onClick?: () => void;
  className?: string;
  icon?: FontAwesomeIconProps['icon'];
  mobile?: boolean;
}) {
  const mergedClasses = classnames(className, 'text-white px-3 py-2 text-sm font-medium');
  return (
    <button className={mergedClasses} onClick={onClick} title={mobile ? title : undefined}>
      {icon && <FontAwesomeIcon icon={icon} className='mr-2' />}
      {!mobile ? title : null}
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
      <nav className='p-4 flex bg-slate-500 text-white'>
        <div className='grow flex items-center'>
          <Link to='/'>
            <h1 className='inline-block text-3xl mr-8'>Quizlord</h1>
          </Link>
          {isAuthenticated && (
            <>
              <Link className='hidden md:block' to='/'>
                <NavigationBarItem icon={faListUl} title='Quizzes' />
              </Link>
              <Link className='hidden md:block' to='/feed'>
                <NavigationBarItem title='Activity' icon={faUsers} />
              </Link>
              {canUploadQuiz && (
                <Link className='hidden md:block' to='/quiz/create'>
                  <NavigationBarItem title='Upload Quiz' icon={faArrowUp} />
                </Link>
              )}
              <Link className='hidden md:block' to='/stats'>
                <NavigationBarItem title='Statistics' icon={faChartLine} />
              </Link>
            </>
          )}
        </div>
        <div>
          {isAuthenticated ? (
            <>
              <NavigationBarItem
                icon={faRightFromBracket}
                title='Log Out'
                className='hidden md:inline'
                onClick={() => onLogout()}
              ></NavigationBarItem>
              <img className='inline-block max-h-12 rounded-full' src={userImage} alt={userName} />
            </>
          ) : (
            <NavigationBarItem icon={faRightFromBracket} title='Log In' onClick={() => onLogin()} />
          )}
        </div>
      </nav>
      {isAuthenticated && (
        <nav className='md:hidden p-2 bg-slate-500 text-white flex justify-between'>
          <>
            <Link to='/'>
              <NavigationBarItem icon={faListUl} title='Quizzes' mobile />
            </Link>
            <Link to='/feed'>
              <NavigationBarItem icon={faUsers} title='Activity' mobile />
            </Link>
            {canUploadQuiz && (
              <Link to='/quiz/create'>
                <NavigationBarItem icon={faArrowUp} title='Upload Quiz' mobile></NavigationBarItem>
              </Link>
            )}
            <Link to='/stats'>
              <NavigationBarItem icon={faChartLine} title='Statistics' mobile></NavigationBarItem>
            </Link>
            <NavigationBarItem
              icon={faRightFromBracket}
              title='Log Out'
              onClick={() => onLogout()}
              mobile
            ></NavigationBarItem>
          </>
        </nav>
      )}
    </>
  );
}

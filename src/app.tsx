import { Route, Routes } from 'react-router-dom';
import { CreateQuiz } from './CreateQuiz';
import EnterQuizResults from './EnterQuizResults';
import NavigationBar from './NavigationBar';
import QuizDetails from './QuizDetails';
import QuizList from './QuizList';
import { useQuizlord } from './QuizlordProvider';
import Button from './components/Button';

export function App() {
  const { isAuthenticated, user, logout, loginWithRedirect, isLoading } = useQuizlord();

  function handleLogout() {
    logout({ returnTo: window.location.origin });
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  const userHasRole = (user?.roles.length || 0) > 0;

  return (
    <>
      <NavigationBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLogin={loginWithRedirect}
        userImage={user?.pictureUrl}
        userName={user?.name}
        canUploadQuiz={userHasRole}
      />
      <div className='container mx-auto px-8 mt-12'>
        {!isAuthenticated && (
          <div>
            <p className='mb-4'>Thanks for visiting Quizlord, you'll need to sign in to get started.</p>
            <Button onClick={() => loginWithRedirect()}>Log In</Button>
          </div>
        )}
        {isAuthenticated && !userHasRole && (
          <div>
            <p>
              Thanks for signing up for Quizlord, your application to join is being reviewed. Please get in touch with
              Daniel to speed things along!
            </p>
          </div>
        )}
        {isAuthenticated && userHasRole && (
          <Routes>
            <Route path='/' element={<QuizList />} />
            <Route path='/quiz/create' element={<CreateQuiz />} />
            <Route path='/quiz/:id' element={<QuizDetails />} />
            <Route path='/quiz/:id/enter' element={<EnterQuizResults />} />
          </Routes>
        )}
      </div>
    </>
  );
}

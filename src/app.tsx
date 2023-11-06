import { Route, Routes } from 'react-router-dom';

import { CreateQuiz } from './CreateQuiz';
import EnterQuizResults from './EnterQuizResults';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import QuizDetails from './QuizDetails';
import { useQuizlord } from './QuizlordProvider';
import Button from './components/Button';
import Loader from './components/Loader';
import QuizList from './pages/list/QuizList';
import QuizStatistics from './pages/statistics/QuizStatistics';
import { userCanPerformAction } from './services/authorization';

export function App() {
  const { isAuthenticated, user, logout, loginWithRedirect, isLoading } = useQuizlord();

  function handleLogout() {
    logout({ returnTo: window.location.origin });
  }

  if (isLoading) {
    return <Loader message='Quizlord is getting ready for you...' className='mt-10' />;
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <NavigationBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLogin={loginWithRedirect}
        userImage={user?.pictureUrl}
        userName={user?.name}
        canUploadQuiz={userCanPerformAction(user, 'UPLOAD_QUIZ')}
      />
      <div className='container mx-auto px-0 mt-0 lg:px-8 lg:my-12 grow'>
        {!isAuthenticated && (
          <div className='p-4 lg:p-0'>
            <p className='mb-4'>Thanks for visiting Quizlord, you'll need to sign in to get started.</p>
            <Button onClick={() => loginWithRedirect()}>Log In</Button>
          </div>
        )}
        {isAuthenticated && !userCanPerformAction(user, 'USE_APP') && (
          <div className='container'>
            <p>
              Thanks for signing up for Quizlord, your application to join is being reviewed. Please get in touch with
              Daniel to speed things along!
            </p>
          </div>
        )}
        {isAuthenticated && userCanPerformAction(user, 'USE_APP') && (
          <Routes>
            <Route path='/' element={<QuizList />} />
            <Route path='/quiz/create' element={<CreateQuiz />} />
            <Route path='/quiz/:id' element={<QuizDetails />} />
            <Route path='/quiz/:id/enter' element={<EnterQuizResults />} />
            <Route path='/stats' element={<QuizStatistics />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
}

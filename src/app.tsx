import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NavigationBar from "./NavigationBar";
import QuizList from "./QuizList";
import { CreateQuiz } from "./CreateQuiz";
import Quiz from "./Quiz";

export function App() {
  const { isAuthenticated, user, logout, loginWithRedirect, isLoading } =
    useAuth0();

  function handleLogout() {
    logout({ returnTo: window.location.origin });
  }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <NavigationBar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLogin={loginWithRedirect}
        userImage={user?.picture}
        userName={user?.name}
      />

      {isAuthenticated && (
        <>
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/quiz/create" element={<CreateQuiz />} />
            <Route path="/quiz/:id" element={<Quiz />} />
          </Routes>
        </>
      )}
    </>
  );
}

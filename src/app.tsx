import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import NavigationBar from "./NavigationBar";
import QuizList from "./QuizList";
import { CreateQuiz } from "./CreateQuiz";
import QuizDetails from "./QuizDetails";

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
        <div className="container mx-auto px-8 mt-12">
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/quiz/create" element={<CreateQuiz />} />
            <Route path="/quiz/:id" element={<QuizDetails />} />
          </Routes>
        </div>
      )}
    </>
  );
}

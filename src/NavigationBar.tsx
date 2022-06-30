import type { ComponentChildren } from "preact";
import { Link } from "react-router-dom";

function NavigationBarItem({
  children,
  onClick,
}: {
  children: ComponentChildren;
  onClick?: () => void;
}) {
  return (
    <button
      className="text-white px-3 py-2 text-sm font-medium"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function NavigationBar({
  onLogout,
  onLogin,
  isAuthenticated,
  userImage,
  userName,
}: {
  onLogout: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  userImage?: string;
  userName?: string;
}) {
  return (
    <nav className="p-4 flex bg-slate-500 text-white">
      <div className="grow flex items-center">
        <Link to="/">
          <h1 className="inline-block text-3xl mr-8">Quizlord</h1>
        </Link>
        <Link to="/quiz/create">
          <NavigationBarItem>Upload Quiz</NavigationBarItem>
        </Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <NavigationBarItem onClick={() => onLogout()}>
              Log Out
            </NavigationBarItem>
            <img
              className="inline-block max-h-12 rounded-full"
              src={userImage}
              alt={userName}
            />
          </>
        ) : (
          <NavigationBarItem onClick={() => onLogin()}>
            Log In
          </NavigationBarItem>
        )}
      </div>
    </nav>
  );
}

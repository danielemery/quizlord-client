import { CurrentUser } from '../context/QuizlordProvider';
import { Quiz } from '../types/quiz';
import { Action, allowedActions } from './authorization.policy';

/**
 * Get whether the given user is allowed to perform the given action.
 * @param user The user to check permissions for.
 * @param action The action the user is trying to perform.
 * @returns True if the user is allowed to perform the action, false otherwise.
 */
export function userCanPerformAction(user: CurrentUser | undefined, action: Action) {
  if (!user || user.roles.length === 0) return false;
  return user.roles.some((role) => allowedActions[role].includes(action));
}

/**
 * Get whether or not the given user can delete the given quiz.
 * @param user The user to check permissions for.
 * @param quiz The quiz to check permissions for.
 * @returns true if the user can delete the quiz, false otherwise.
 */
export function userCanDeleteQuiz(user: CurrentUser, quiz: Quiz) {
  const quizHasCompletions = quiz.completions.length > 0;
  if (quizHasCompletions) {
    return false;
  }

  if (userCanPerformAction(user, 'DELETE_QUIZ')) {
    return true;
  }

  const isOwnQuiz = quiz.uploadedBy.email === user?.email;
  if (userCanPerformAction(user, 'DELETE_OWN_QUIZ') && isOwnQuiz) {
    return true;
  }

  return false;
}

/**
 * Get whether or not the given user can update the given quiz.
 * @param user The user to check permissions for.
 * @param quiz The quiz to check permissions for.
 * @returns true if the user can update the quiz, false otherwise.
 */
export function userCanUpdateQuiz(user: CurrentUser, quiz: Quiz) {
  if (userCanPerformAction(user, 'UPDATE_QUIZ')) {
    return true;
  }

  const isOwnQuiz = quiz.uploadedBy.email === user?.email;
  if (userCanPerformAction(user, 'UPDATE_OWN_QUIZ') && isOwnQuiz) {
    return true;
  }

  return false;
}

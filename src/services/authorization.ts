import { CurrentUser } from '../QuizlordProvider';
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

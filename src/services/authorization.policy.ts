/**
 * In the future this file will be shared between the client and the server.
 * At the moment we're manually keeping it in sync.
 */

export type Role = 'USER' | 'ADMIN';
export type Action =
  /** Basic app usage. Includes viewing and completing quizzes. */
  | 'USE_APP'
  /** Uploading new quizzes. */
  | 'UPLOAD_QUIZ'
  /** Deleting quizzes. */
  | 'DELETE_QUIZ'
  /** Deleting quizzes that you have uploaded yourself. */
  | 'DELETE_OWN_QUIZ'
  /** Updating quizzes. */
  | 'UPDATE_QUIZ'
  /** Updating quizzes that you have uploaded yourself. */
  | 'UPDATE_OWN_QUIZ'
  /** Triggering AI processing for a quiz. */
  | 'TRIGGER_AI_PROCESSING';

export const allowedActions: Record<Role, Action[]> = {
  ADMIN: [
    'USE_APP',
    'UPLOAD_QUIZ',
    'DELETE_QUIZ',
    'DELETE_OWN_QUIZ',
    'UPDATE_QUIZ',
    'UPDATE_OWN_QUIZ',
    'TRIGGER_AI_PROCESSING',
  ],
  USER: ['USE_APP', 'UPLOAD_QUIZ', 'DELETE_OWN_QUIZ', 'UPDATE_OWN_QUIZ'],
};

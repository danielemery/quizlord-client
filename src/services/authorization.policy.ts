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
  /** Triggering AI processing for a quiz. */
  | 'TRIGGER_AI_PROCESSING'
  /** Viewing activity feed. */
  | 'VIEW_ACTIVITY'
  /** Viewing statistics about quiz results. */
  | 'VIEW_STATISTICS'
  /** Managing user access (approving/rejecting). */
  | 'MANAGE_USERS';

export const allowedActions: Record<Role, Action[]> = {
  ADMIN: ['USE_APP', 'UPLOAD_QUIZ', 'TRIGGER_AI_PROCESSING', 'VIEW_ACTIVITY', 'VIEW_STATISTICS', 'MANAGE_USERS'],
  USER: ['USE_APP', 'UPLOAD_QUIZ', 'VIEW_ACTIVITY', 'VIEW_STATISTICS'],
};

export function formatDate(source: string | Date) {
  return new Date(source).toDateString();
}

export function formatDateTime(source: string | Date) {
  return new Date(source).toLocaleString();
}

export function formatDateTimeShortDate(source: string | Date) {
  return new Date(source).toLocaleDateString();
}

export function formatDateTimeShortTime(source: string | Date) {
  return new Date(source).toLocaleTimeString();
}

/**
 * Format a number between 0 and 1 as a percentage.
 * @param source A number between 0 and 1.
 * @returns A string representation of the percentage.
 */
export function formatPercent(source: number) {
  return `${(source * 100).toFixed(2)}%`;
}

/**
 * Get the best user identifier we can for a user.
 * Name will be used if available, otherwise email.
 * If neither are available, 'Unknown user' will be returned.
 * @param user The "userlike" object to get an identifier for.
 * @returns The best identifier we can get for the user.
 */
export function userIdentifier(user?: { name?: string; email: string }) {
  if (!user) {
    return 'Unknown user';
  }
  return user.name ?? user.email;
}

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

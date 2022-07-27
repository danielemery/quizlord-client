export function formatDate(source: string | Date) {
  return new Date(source).toDateString();
}

export function formatDateTime(source: string | Date) {
  return new Date(source).toLocaleString();
}

export function formatDateTimeShort(source: string | Date) {
  return new Date(source).toDateString();
}

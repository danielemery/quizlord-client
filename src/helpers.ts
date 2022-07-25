export function formatDate(source: string | Date) {
  return new Date(source).toDateString();
}

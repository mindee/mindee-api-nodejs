export function parseDate(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }
  return new Date(dateString);
}

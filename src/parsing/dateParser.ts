export function parseDate(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }
  if (!/Z$/.test(dateString) && !/[+-]\d{2}:\d{2}$/.test(dateString)) {
    dateString += "Z";
  }
  return new Date(dateString);
}

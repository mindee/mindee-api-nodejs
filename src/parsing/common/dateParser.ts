export function parseDate(dateString: string | null): Date | null {
  if (!dateString) {
    return null;
  }
  if (!/Z$/.test(dateString) && !/[+-][0-9]{2}:[0-9]{2}$/.test(dateString)) {
    dateString += "Z";
  }
  return new Date(dateString);
}

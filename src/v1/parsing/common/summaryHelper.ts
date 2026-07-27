/**
 * Cleans a string by removing all new line characters.
 * @param outStr Output string.
 */
export function cleanOutString(outStr: string): string {
  const lines = / \n/gm;
  return outStr.replace(lines, "\n");
}

/**
 *
 * @param columnSizes Size of each column in the table
 * @param separator character for a separator
 * @returns A separator for table lines
 */
export function lineSeparator(columnSizes: number[], separator: string) {
  let outStr: string = "  +";
  columnSizes.forEach((size: number) => {
    outStr += separator.repeat(size) + "+";
  });
  return outStr;
}

/**
 * Replaces all special characters like \n, \r, \t, with an equivalent that can be displayed on a single line.
 * Also trims line breaks at the end of the string.
 * @param outStr Output string.
 */
export function cleanSpecialChars(outStr: string) {
  return outStr
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Cleans a string with `cleanSpecialChars` and truncates it to `maxLength` characters,
 * appending "..." when truncation occurs. Returns an empty string for null/undefined/empty input.
 * @param value String to clean and truncate.
 * @param maxLength Maximum length of the returned string (including the "..." suffix when truncated).
 */
export function cleanAndTruncate(value: string | null | undefined, maxLength: number): string {
  if (!value) {
    return "";
  }
  const cleaned = cleanSpecialChars(value);
  return cleaned.length <= maxLength ? cleaned : cleaned.slice(0, maxLength - 3) + "...";
}

/**
 * Return a float as a string with at least 2 levels of precision.
 */
export function floatToString(value: number|null) {
  if (value === null){
    return "";
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
    useGrouping: false,
  });
}

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
 * @param outStr
 */
export function cleanSpecialChars(outStr: string) {
  return outStr
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
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

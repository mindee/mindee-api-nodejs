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

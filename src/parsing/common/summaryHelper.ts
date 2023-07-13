export function cleanOutString(outStr: string): string {
  const lines = / \n/gm;
  return outStr.replace(lines, "\n");
}
/**
 * Calculates the Levenshtein distance between two strings.
 *
 * Taken & adapted from: https://rosettacode.org/wiki/Levenshtein_distance#JavaScript
 *
 * @param source - The source string to compare from.
 * @param target - The target string to compare to.
 * @returns The Levenshtein distance between the two strings.
 */
function levenshteinDistance(source: string, target: string): number {
  const sourceLength: number = source.length;
  const targetLength: number = target.length;

  if (sourceLength === 0) return targetLength;
  if (targetLength === 0) return sourceLength;

  let previousRow: number[] = Array.from({ length: targetLength + 1 }, (_, i) => i);
  let currentRow: number[] = [];

  for (let i = 1; i <= sourceLength; i++) {
    currentRow = [i];

    for (let j = 1; j <= targetLength; j++) {
      const insertCost: number = previousRow[j] + 1;
      const deleteCost: number = currentRow[j - 1] + 1;
      const substituteCost: number = previousRow[j - 1] + (source[i - 1] !== target[j - 1] ? 1 : 0);

      currentRow[j] = Math.min(insertCost, deleteCost, substituteCost);
    }

    previousRow = currentRow;
  }

  return currentRow[targetLength];
}

/**
 * Computes the Levenshtein ratio between two given strings.
 *
 * The Levenshtein ratio is a measure of similarity between two strings.
 * It's calculated as 1 minus the Levenshtein distance divided by the
 * length of the longer string. The result is a value between 0 and 1,
 * where 1 indicates identical strings and 0 indicates completely different strings.
 *
 * @param refString - The reference string to compare from.
 * @param targetString - The target string to compare to.
 * @returns The ratio of similarity between the two strings, ranging from 0 to 1.
 */
export function levenshteinRatio(refString: string, targetString: string): number {
  const refLength: number = refString.length;
  const targetLength: number = targetString.length;
  const maxLength: number = Math.max(refLength, targetLength);

  if (refLength === 0 && targetLength === 0) {
    return 1.0;
  }

  const distance: number = levenshteinDistance(refString, targetString);

  return 1.0 - distance / maxLength;
}

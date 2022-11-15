import Fuse from "fuse.js";

export interface MatchUp {
  word: Buffer;
  score: number;
}

/**
 * Search if a word is existing in a given list of words.
 */
export function isMyWordFound(target: string, words: string[]): boolean {
  const options = {
    includeScore: true,
    ignoreLocation: true,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(words, options);

  const result = fuse.search(target);

  console.log(result);

  return result.length !== 0;
}

/**
 * Search if one word among a list is existing in a given list of words.
 */
export function isOneOfMyWordFound(target: string[], words: string[]): boolean {
  const options = {
    includeScore: true,
    ignoreLocation: true,
    includeMatches: true,
    minMatchCharLength: 2,
  };

  const fuse = new Fuse(words, options);

  const fuzeExtendedSearch: string = target.join("|");

  const result = fuse.search(fuzeExtendedSearch);

  console.log(result);

  return result.length !== 0;
}

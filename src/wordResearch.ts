import Fuse from "fuse.js";

/**
 * Search if a word is existing in a given list of words.
 */
export function isMyWordFound(target: string, words: string[]): boolean {
  const options = {
    includeScore: true,
    ignoreLocation: true,
  };

  const fuse = new Fuse(words, options);

  const result = fuse.search(target);

  return result.length !== 0;
}

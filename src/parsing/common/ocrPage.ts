import {
  compareOnX,
  compareOnY,
  getCentroid,
  isPointInPolygonY,
} from "../../geometry";
import { Word } from "../standard";
import { StringDict } from "./stringDict";

export class OcrPage {
  /** Flat list of all words read */
  allWords: Word[] = [];
  /** List of words by which line they are on */
  allLines: Word[][] = [];

  constructor(rawPrediction: StringDict) {
    const allWords: Word[] = [];
    rawPrediction["all_words"] &&
      rawPrediction["all_words"].forEach((word: Word) => {
        allWords.push(word);
      });
    this.allWords = allWords.sort((word1, word2) =>
      compareOnY(word1.polygon, word2.polygon)
    );
  }

  #areWordsOnSameLine(currentWord: Word, nextWord: Word) {
    const currentInNext = isPointInPolygonY(
      getCentroid(currentWord.polygon),
      nextWord.polygon
    );
    const nextInCurrent = isPointInPolygonY(
      getCentroid(nextWord.polygon),
      currentWord.polygon
    );
    return nextInCurrent || currentInNext;
  }

  /**
   * Orders words in the page as lines
   * @returns Lines
   */
  #toLines(): Word[][] {
    const lines: Word[][] = [];
    const lineIdx: number[] = [];
    this.allWords.forEach((current: Word, idxCurrent: number) => {
      if (!lineIdx.includes(idxCurrent)) {
        lines.push([current]);
        lineIdx.push(idxCurrent);
      }
      this.allWords.forEach((next: Word, idxNext: number) => {
        if (idxCurrent === idxNext || lineIdx.includes(idxNext)) {
          return;
        }
        if (this.#areWordsOnSameLine(current, next)) {
          lineIdx.push(idxNext);
          lines[lines.length - 1].push(next);
        }
      });
    });
    lines.forEach((line) =>
      line.sort((word1: Word, word2: Word) =>
        compareOnX(word1.polygon, word2.polygon)
      )
    );
    return lines;
  }

  /**
   * Get all words on the page as ordered lines
   * @returns Sorted lines on the pages
   */
  getAllLines(): Word[][] {
    if (!this.allLines || this.allLines.length === 0) {
      this.allLines = this.#toLines();
    }
    return this.allLines;
  }

  /**
   * Default string representation.
   */
  toString(): string {
    return this.getAllLines()
      .map((line: Word[]) => line.map((word: Word) => word.text).join(" "))
      .join("\n");
  }
}

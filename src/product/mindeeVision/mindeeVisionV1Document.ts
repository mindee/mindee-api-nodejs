import { Prediction, StringDict } from "../../parsing/common";
import { Word, FullText } from "../../parsing/standard";

export class MindeeVisionV1Document implements Prediction {
  endpointName = 'mindee_vision';
  endpointVersion = '1';
  /** List of words found on the page. */
  allWords: Word[] = [];

  constructor(rawPrediction:StringDict) {
    rawPrediction.all_words.map((prediction: Word) => {
      this.allWords.push(prediction);
    });
  }

  toString(): string {
    const fullText = new FullText();
    fullText.words = this.allWords;
    return fullText.toString();
  }
}

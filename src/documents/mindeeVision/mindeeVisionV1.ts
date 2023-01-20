import { Document, DocumentConstructorProps } from "../document";
import { Word, FullText } from "../../fields";

export class MindeeVisionV1 extends Document {
  /** List of words found on the page. */
  allWords: Word[] = [];

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      fullText: fullText,
      extras: extras,
    });
    if (prediction.all_words !== undefined) {
      prediction.all_words.map((prediction: Word) => {
        this.allWords.push(prediction);
      });
    }
  }

  toString(): string {
    const fullText = new FullText();
    fullText.words = this.allWords;
    return fullText.toString();
  }
}

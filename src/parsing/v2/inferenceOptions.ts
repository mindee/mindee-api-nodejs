import { StringDict } from "../common";
import { RawText } from "./rawText";

export class InferenceOptions {
  /**
   * List of texts found per page.
   */
  public rawTexts: Array<RawText>;

  constructor(serverResponse: StringDict) {
    this.rawTexts = serverResponse["raw_texts"] ? serverResponse["raw_texts"].map(
      (rawText: StringDict) => new RawText(rawText)
    ) : [];
  }
}

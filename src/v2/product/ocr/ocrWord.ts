import { Polygon } from "@/geometry/index.js";
import { StringDict } from "@/parsing/index.js";

/** OCR word token with geometry. */
export class OcrWord {
  /**
   * Text content of the word.
   */
  content: string;

  /**
   * Position information as a list of points in clockwise order.
   */
  polygon: Polygon;

  constructor(serverResponse: StringDict) {
    this.content = serverResponse["content"];
    this.polygon = new Polygon(...serverResponse["polygon"]);
  }

  /** Returns the OCR token text. */
  toString(): string {
    return this.content;
  }
}

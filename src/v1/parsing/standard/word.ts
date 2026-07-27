import { Polygon } from "@/geometry/index.js";
import { StringDict } from "@/parsing/index.js";

/** OCR word item with text, confidence, and location polygon. */
export class Word {
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon;
  /** OCR text content for the word. */
  text: string;
  /** Confidence score for the OCR word. */
  confidence: number;

  constructor(rawPrediction: StringDict) {
    this.polygon = new Polygon(...rawPrediction["polygon"]);
    this.text = rawPrediction["text"];
    this.confidence = rawPrediction["confidence"];
  }
};

import { Polygon } from "@/geometry/index.js";
import { StringDict } from "@/parsing/index.js";

export class Word {
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: Polygon;
  text: string;
  confidence: number;

  constructor(rawPrediction: StringDict) {
    this.polygon = new Polygon(...rawPrediction["polygon"]);
    this.text = rawPrediction["text"];
    this.confidence = rawPrediction["confidence"];
  }
};

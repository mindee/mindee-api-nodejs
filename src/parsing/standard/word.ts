import * as geometry from "../../geometry";

export type Word = {
  /**
   * Contains the relative vertices coordinates (points) of a polygon containing
   * the field in the document.
   */
  polygon: geometry.Polygon;
  text: string;
  confidence: number;
};

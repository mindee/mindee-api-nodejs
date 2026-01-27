import { StringDict } from "@/parsing/stringDict.js";
import { Polygon } from "@/geometry/index.js";

export interface PositionFieldConstructor {
  prediction: StringDict;
  valueKey?: string;
  pageId?: number | undefined;
}

/**
 * A field indicating a position or area on the document.
 */
export class PositionField {
  /** Straight rectangle. */
  boundingBox: Polygon;
  /** Free polygon with up to 30 vertices. */
  polygon: Polygon;
  /** Free polygon with 4 vertices. */
  quadrangle: Polygon;
  /** Rectangle that may be oriented (can go beyond the canvas). */
  rectangle: Polygon;
  /** The document page on which the information was found. */
  pageId: number | undefined;

  constructor({ prediction = {}, pageId }: PositionFieldConstructor) {
    this.pageId = pageId;
    this.boundingBox = "bounding_box" in prediction ? prediction["bounding_box"] : [];
    this.polygon = "polygon" in prediction ? prediction["polygon"] : [];
    this.quadrangle = "quadrangle" in prediction ? prediction["quadrangle"] : [];
    this.rectangle = "rectangle" in prediction ? prediction["rectangle"] : [];
  }

  /**
   * Default string representation.
   */
  toString(): string {
    if (this.polygon && this.polygon.length > 0)
      return `Polygon with ${this.polygon.length} points.`;
    if (this.boundingBox && this.boundingBox.length > 0) {
      return `Polygon with ${this.boundingBox.length} points.`;
    }
    if (this.rectangle && this.rectangle.length > 0) {
      return `Polygon with ${this.rectangle.length} points.`;
    }
    if (this.quadrangle && this.quadrangle.length > 0) {
      return `Polygon with ${this.quadrangle.length} points.`;
    }
    return "";
  }
}

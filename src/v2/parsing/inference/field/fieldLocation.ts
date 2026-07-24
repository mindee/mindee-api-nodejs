import { Polygon } from "@/geometry/index.js";
import { StringDict } from "@/parsing/stringDict.js";

/**
 * A field's location on the document.
 */
export class FieldLocation {
  /** Position information as a list of points in clockwise order. */
  readonly polygon: Polygon;
  /** 0-based page index of where the polygon is located. */
  readonly page;

  constructor(serverResponse: StringDict) {
    this.polygon = new Polygon(...serverResponse["polygon"]);
    this.page = serverResponse["page"];
  }

  /** Returns a readable location string. */
  toString(): string {
    return `${this.polygon} on page ${this.page}`;
  }
}

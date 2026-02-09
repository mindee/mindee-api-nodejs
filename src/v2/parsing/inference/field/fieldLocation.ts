import { Polygon } from "@/geometry/index.js";
import { StringDict } from "@/parsing/stringDict.js";

/**
 * Location of a field.
 */
export class FieldLocation {
  /** Free polygon made up of points (can be null when not provided). */
  readonly polygon: Polygon | null;

  /** Page ID. */
  readonly page: number | undefined;

  constructor(serverResponse: StringDict) {
    this.polygon = "polygon" in serverResponse ? new Polygon(...serverResponse["polygon"]) : null;
    this.page = "page" in serverResponse ? serverResponse["page"] : undefined;
  }

  toString(): string {
    return this.polygon?.toString() ?? "";
  }
}

import { Polygon } from "../../../geometry";
import { StringDict } from "../../common";

/**
 * Location of a field.
 */
export class FieldLocation {
  /** Free polygon made up of points (can be null when not provided). */
  readonly polygon: Polygon | null;

  /** Page ID. */
  readonly page: number | undefined;

  constructor(serverResponse: StringDict) {
    this.polygon = serverResponse["polygon"] as Polygon;
    this.page = "page" in serverResponse ? serverResponse["page"] : undefined;
  }

  toString(): string {
    return this.polygon?.toString() ?? "";
  }
}

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
    this.polygon = new Polygon(serverResponse["polygon"]);
    this.page = "number" in serverResponse &&
    typeof serverResponse["page"] === "number" ? serverResponse["page"] : undefined;
  }

  toString(): string {
    return this.polygon?.toString() ?? "";
  }
}

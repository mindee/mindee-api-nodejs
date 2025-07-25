import { BaseField } from "./baseField";
import { FieldLocation } from "./fieldLocation";
import { StringDict } from "../../common";


export class DynamicField extends BaseField {
  public locations: Array<FieldLocation> | undefined;

  constructor(rawResponse: StringDict, indentLevel = 0) {
    super(rawResponse, indentLevel);
    if (rawResponse["locations"]) {
      this.locations = rawResponse["locations"].map((location: StringDict | undefined) => {
        return location ? new FieldLocation(location) : "";
      });
    }
  }
}

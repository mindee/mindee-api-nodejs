import { StringDict } from "@/parsing/stringDict.js";
import { DataSchemaReplace } from "./dataSchemaReplace.js";

/**
 * Modify the Data Schema.
 */
export class DataSchema {
  /**
   * If set, completely replaces the data schema of the model.
   */
  replace?: DataSchemaReplace;

  constructor(dataSchema: StringDict | string) {
    if (typeof dataSchema === "string") {
      this.replace = new DataSchemaReplace(JSON.parse(dataSchema)["replace"]);
    } else if (dataSchema instanceof DataSchema) {
      this.replace = dataSchema.replace;
    } else {
      this.replace = new DataSchemaReplace(dataSchema["replace"] as StringDict);
    }
  }

  toJSON() {
    return { replace: this.replace?.toJSON() };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

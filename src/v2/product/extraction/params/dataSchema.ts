import { StringDict } from "@/parsing/stringDict.js";
import { DataSchemaReplace, DataSchemaReplaceJson } from "./dataSchemaReplace.js";

/** JSON payload for top-level data schema options. */
export interface DataSchemaJson {
  /** Optional full replacement schema. */
  replace?: DataSchemaReplaceJson;
}

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

  /** Serializes the data schema parameters to API format. */
  toJSON(): DataSchemaJson {
    return { replace: this.replace?.toJSON() };
  }
  /** Returns a JSON string representation of the data schema parameters. */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

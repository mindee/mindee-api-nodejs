import { StringDict } from "@/parsing/index.js";
import { DataSchemaField, DataSchemaFieldJson } from "./dataSchemaField.js";
import { MindeeError } from "@/errors/index.js";

/** JSON payload for replacement data schema options. */
export interface DataSchemaReplaceJson {
  /** Field definitions replacing the current schema. */
  fields: Array<DataSchemaFieldJson>;
}

/**
 * The structure to completely replace the data schema of the model.
 */
export class DataSchemaReplace {
  /**
   * List of fields in the Data Schema.
   */
  fields: Array<DataSchemaField>;

  constructor(dataSchemaReplace: StringDict) {
    if (!dataSchemaReplace || !dataSchemaReplace.fields ) {
      throw new MindeeError("Invalid Data Schema provided.");
    }
    if (dataSchemaReplace["fields"].length === 0) {
      throw new TypeError("Data Schema replacement fields cannot be empty.");
    }
    this.fields = dataSchemaReplace["fields"].map((field: StringDict) => (new DataSchemaField(field)));
  }

  /** Serializes the replacement schema to API format. */
  toJSON(): DataSchemaReplaceJson {
    return { fields: this.fields.map(e => e.toJSON()) };
  }

  /** Returns a JSON string representation of the replacement schema. */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

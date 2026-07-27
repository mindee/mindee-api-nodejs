import { StringDict } from "@/parsing/index.js";

/** JSON payload for a single data schema field definition. */
export interface DataSchemaFieldJson {
  /** Field key used in results. */
  name: string;
  /** Human-readable field title. */
  title: string;
  /** Whether the field accepts multiple values. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  is_array: boolean;
  /** Field type name. */
  type: string;
  /** Optional allowed classes for classification fields. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  classification_values?: Array<string>;
  /** Optional deduplication behavior for array fields. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  unique_values?: boolean;
  /** Optional field description. */
  description?: string;
  /** Optional extraction guidelines. */
  guidelines?: string;
  /** Optional nested schema for object fields. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  nested_fields?: StringDict;
}

/** Data schema field definition used by extraction parameters. */
export class DataSchemaField {
  /**
   * Display name for the field, also impacts inference results.
   */
  public title: string;
  /**
   * Name of the field in the data schema.
   */
  public name: string;
  /**
   * Whether this field can contain multiple values.
   */
  public isArray: boolean;
  /**
   * Data type of the field.
   */
  public type: string;
  /**
   * Allowed values when type is `classification`. Leave empty for other types.
   */
  public classificationValues?: Array<string>;
  /**
   * Whether to remove duplicate values in the array.
   * Only applicable if `is_array` is True.
   */
  public uniqueValues?: boolean;
  /**
   * Detailed description of what this field represents.
   */
  public description?: string;
  /**
   * Optional extraction guidelines.
   */
  public guidelines?: string;
  /**
   * Subfields when type is `nested_object`. Leave empty for other types.
   */
  public nestedFields?: StringDict;

  constructor(fields: StringDict) {
    this.name = fields["name"];
    this.title = fields["title"];
    this.isArray = fields["is_array"];
    this.type = fields["type"];
    this.classificationValues = fields["classification_values"];
    this.uniqueValues = fields["unique_values"];
    this.description = fields["description"];
    this.guidelines = fields["guidelines"];
    this.nestedFields = fields["nested_fields"];
  }

  /** Serializes the field definition to API format. */
  toJSON(): DataSchemaFieldJson {
    const out: DataSchemaFieldJson = {
      name: this.name,
      title: this.title,
      // eslint-disable-next-line @typescript-eslint/naming-convention,camelcase
      is_array: this.isArray,
      type: this.type,
    };

    // eslint-disable-next-line camelcase
    if (this.classificationValues !== undefined) out.classification_values = this.classificationValues;
    // eslint-disable-next-line camelcase
    if (this.uniqueValues !== undefined) out.unique_values = this.uniqueValues;
    if (this.description !== undefined) out.description = this.description;
    if (this.guidelines !== undefined) out.guidelines = this.guidelines;
    // eslint-disable-next-line camelcase
    if (this.nestedFields !== undefined) out.nested_fields = this.nestedFields;

    return out;
  }

  /** Returns a JSON string representation of the field definition. */
  toString() {
    return JSON.stringify(this.toJSON());
  }
}

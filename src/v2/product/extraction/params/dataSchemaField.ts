import { StringDict } from "@/parsing/index.js";

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

  toJSON() {
    const out: Record<string, unknown> = {
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

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

import { cleanOutString } from "../../parsing/common";
import { StringDict, Prediction } from "../../parsing/common";
import { ListField } from "../../parsing/custom";

/**
 * Page data for Custom builds.
 */
export class CustomV1Page implements Prediction {
  /** List of page-specific fields for a Custom build. Cannot include Classification fields. */
  fields: Map<string, ListField> = new Map();

  constructor(rawPrediction: StringDict, pageId?: number) {
    Object.entries(rawPrediction).forEach(
      ([fieldName, fieldValue]: [string, any]) => {
        this.fields.set(
          fieldName,
          new ListField({
            prediction: fieldValue as StringDict,
            pageId: pageId,
          })
        );
      }
    );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let outStr = "";
    this.fields.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    return cleanOutString(outStr).trimEnd();
  }
}

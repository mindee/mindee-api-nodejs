import { cleanOutString } from "../../parsing/common";
import { StringDict, Prediction } from "../../parsing/common";
import { ClassificationField, ListField, getLineItems, CustomLines } from "../../parsing/custom";

/**
 * Document data for Custom builds.
 */
export class CustomV1Document implements Prediction {
  /** List of fields for a Custom build. */
  fields: Map<string, ListField> = new Map();
  /** List of classification fields for a Custom build. */
  classifications: Map<string, ClassificationField> = new Map();

  constructor(rawPrediction: StringDict, pageId?: number) {
    Object.entries(rawPrediction).forEach(
      ([fieldName, fieldValue]: [string, any]) => {
        this.setField(fieldName, fieldValue, pageId);
      }
    );
  }

  /**
   * Sorts and sets fields between classification fields and regular fields.
   * Note: Currently, two types of fields possible in a custom API response:
   * fields having a list of values, and classification fields.
   * @param fieldName name of the field.
   * @param fieldValue value of the field.
   * @param pageId page the field was found on.
   */
  protected setField(fieldName: string, fieldValue: any, pageId?: number) {
    if (fieldValue && fieldValue["values"] !== undefined) {
      // Only value lists have the 'values' attribute.
      this.fields.set(
        fieldName,
        new ListField({
          prediction: fieldValue as StringDict,
          pageId: pageId,
        })
      );
    } else if (fieldValue && fieldValue["value"] !== undefined) {
      // Only classifications have the 'value' attribute.
      this.classifications.set(
        fieldName,
        new ClassificationField({ prediction: fieldValue })
      );
    } else {
      throw new Error(
        `Unknown API field type for field ${fieldName} : ${fieldValue}`
      );
    }
  }

  /**
   * Order column fields into line items.
   * @param anchorNames list of possible anchor fields.
   * @param fieldNames list of all column fields.
   * @param heightTolerance height tolerance to apply to lines.
   */
  columnsToLineItems(anchorNames: string[], fieldNames: string[], heightTolerance: number = 0.01): CustomLines {
    return getLineItems(
      anchorNames,
      fieldNames,
      this.fields,
      heightTolerance
    );
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let outStr = "";
    this.classifications.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    this.fields.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    return cleanOutString(outStr).trimEnd();
  }
}

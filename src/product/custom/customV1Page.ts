import { cleanOutString } from "../../parsing/common";
import { StringDict, Prediction } from "../../parsing/common";
import { ListField, CustomLine, getLineItems } from "../../parsing/custom";

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
   * Order column fields into line items.
   * @param anchorNames list of possible anchor fields.
   * @param fieldNames list of all column fields.
   * @param heightTolerance height tolerance to apply to lines.
   */
  columnsToLineItems(anchorNames: string[], fieldNames: string[], heightTolerance: number = 0.01): CustomLine[] {
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
    this.fields.forEach((fieldData, name) => {
      outStr += `:${name}: ${fieldData}\n`;
    });
    return cleanOutString(outStr).trimEnd();
  }
}

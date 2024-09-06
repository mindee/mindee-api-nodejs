import { StringDict } from "../../../src/parsing/common";
import { GeneratedListField, GeneratedObjectField, isGeneratedObject } from "../../../src/parsing/generated";
import { StringField } from "../../../src/parsing/standard";
import { GeneratedV1Prediction } from "./generatedV1Prediction";

/**
 * Generated V1 page prediction results.
 */
export class GeneratedV1Page extends GeneratedV1Prediction {
  constructor(rawPrediction: StringDict, pageId?: number) {
    super();
    Object.entries(rawPrediction).forEach(([fieldName, fieldValue]: [string, any]) => {
      if (Array.isArray(fieldValue)) {
        this.fields.set(fieldName, new GeneratedListField({ prediction: fieldValue, pageId: pageId }));
      }
      else if (typeof fieldValue === "object" && fieldValue !== null && isGeneratedObject(fieldValue)) {
        this.fields.set(fieldName, new GeneratedObjectField({ prediction: fieldValue, pageId: pageId }));
      } else {
        const fieldValueStr = fieldValue;
        if (Object.prototype.hasOwnProperty.call(fieldValueStr, "value") && fieldValueStr["value"] !== null) {
          fieldValueStr["value"] = fieldValueStr["value"].toString();
        }
        this.fields.set(fieldName, new StringField({ prediction: fieldValueStr, pageId: pageId }));
      }
    });
  }
}

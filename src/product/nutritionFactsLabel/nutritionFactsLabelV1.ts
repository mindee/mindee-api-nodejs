import { Inference, StringDict, Page } from "../../parsing/common";
import { NutritionFactsLabelV1Document } from "./nutritionFactsLabelV1Document";

/**
 * Nutrition Facts Label API version 1 inference prediction.
 */
export class NutritionFactsLabelV1 extends Inference {
  /** The endpoint's name. */
  endpointName = "nutrition_facts";
  /** The endpoint's version. */
  endpointVersion = "1";
  /** The document-level prediction. */
  prediction: NutritionFactsLabelV1Document;
  /** The document's pages. */
  pages: Page<NutritionFactsLabelV1Document>[] = [];

  constructor(rawPrediction: StringDict) {
    super(rawPrediction);
    this.prediction = new NutritionFactsLabelV1Document(rawPrediction["prediction"]);
    rawPrediction["pages"].forEach(
      (page: StringDict) => {
        if (page.prediction !== undefined && page.prediction !== null &&
          Object.keys(page.prediction).length > 0) {
          this.pages.push(new Page(
            NutritionFactsLabelV1Document,
            page,
            page["id"],
            page["orientation"]
          ));
        }
      }
    );
  }
}

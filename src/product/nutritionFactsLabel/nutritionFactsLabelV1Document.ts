import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "../../parsing/common";
import { NutritionFactsLabelV1ServingSize } from "./nutritionFactsLabelV1ServingSize";
import { NutritionFactsLabelV1Calorie } from "./nutritionFactsLabelV1Calorie";
import { NutritionFactsLabelV1TotalFat } from "./nutritionFactsLabelV1TotalFat";
import { NutritionFactsLabelV1SaturatedFat } from "./nutritionFactsLabelV1SaturatedFat";
import { NutritionFactsLabelV1TransFat } from "./nutritionFactsLabelV1TransFat";
import { NutritionFactsLabelV1Cholesterol } from "./nutritionFactsLabelV1Cholesterol";
import { NutritionFactsLabelV1TotalCarbohydrate } from "./nutritionFactsLabelV1TotalCarbohydrate";
import { NutritionFactsLabelV1DietaryFiber } from "./nutritionFactsLabelV1DietaryFiber";
import { NutritionFactsLabelV1TotalSugar } from "./nutritionFactsLabelV1TotalSugar";
import { NutritionFactsLabelV1AddedSugar } from "./nutritionFactsLabelV1AddedSugar";
import { NutritionFactsLabelV1Protein } from "./nutritionFactsLabelV1Protein";
import { NutritionFactsLabelV1Sodium } from "./nutritionFactsLabelV1Sodium";
import { NutritionFactsLabelV1Nutrient } from "./nutritionFactsLabelV1Nutrient";
import { AmountField } from "../../parsing/standard";

/**
 * Nutrition Facts Label API version 1.0 document data.
 */
export class NutritionFactsLabelV1Document implements Prediction {
  /** The amount of added sugars in the product. */
  addedSugars: NutritionFactsLabelV1AddedSugar;
  /** The amount of calories in the product. */
  calories: NutritionFactsLabelV1Calorie;
  /** The amount of cholesterol in the product. */
  cholesterol: NutritionFactsLabelV1Cholesterol;
  /** The amount of dietary fiber in the product. */
  dietaryFiber: NutritionFactsLabelV1DietaryFiber;
  /** The amount of nutrients in the product. */
  nutrients: NutritionFactsLabelV1Nutrient[] = [];
  /** The amount of protein in the product. */
  protein: NutritionFactsLabelV1Protein;
  /** The amount of saturated fat in the product. */
  saturatedFat: NutritionFactsLabelV1SaturatedFat;
  /** The number of servings in each box of the product. */
  servingPerBox: AmountField;
  /** The size of a single serving of the product. */
  servingSize: NutritionFactsLabelV1ServingSize;
  /** The amount of sodium in the product. */
  sodium: NutritionFactsLabelV1Sodium;
  /** The total amount of carbohydrates in the product. */
  totalCarbohydrate: NutritionFactsLabelV1TotalCarbohydrate;
  /** The total amount of fat in the product. */
  totalFat: NutritionFactsLabelV1TotalFat;
  /** The total amount of sugars in the product. */
  totalSugars: NutritionFactsLabelV1TotalSugar;
  /** The amount of trans fat in the product. */
  transFat: NutritionFactsLabelV1TransFat;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.addedSugars = new NutritionFactsLabelV1AddedSugar({
      prediction: rawPrediction["added_sugars"],
      pageId: pageId,
    });
    this.calories = new NutritionFactsLabelV1Calorie({
      prediction: rawPrediction["calories"],
      pageId: pageId,
    });
    this.cholesterol = new NutritionFactsLabelV1Cholesterol({
      prediction: rawPrediction["cholesterol"],
      pageId: pageId,
    });
    this.dietaryFiber = new NutritionFactsLabelV1DietaryFiber({
      prediction: rawPrediction["dietary_fiber"],
      pageId: pageId,
    });
    rawPrediction["nutrients"] &&
      rawPrediction["nutrients"].map(
        (itemPrediction: StringDict) =>
          this.nutrients.push(
            new NutritionFactsLabelV1Nutrient({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.protein = new NutritionFactsLabelV1Protein({
      prediction: rawPrediction["protein"],
      pageId: pageId,
    });
    this.saturatedFat = new NutritionFactsLabelV1SaturatedFat({
      prediction: rawPrediction["saturated_fat"],
      pageId: pageId,
    });
    this.servingPerBox = new AmountField({
      prediction: rawPrediction["serving_per_box"],
      pageId: pageId,
    });
    this.servingSize = new NutritionFactsLabelV1ServingSize({
      prediction: rawPrediction["serving_size"],
      pageId: pageId,
    });
    this.sodium = new NutritionFactsLabelV1Sodium({
      prediction: rawPrediction["sodium"],
      pageId: pageId,
    });
    this.totalCarbohydrate = new NutritionFactsLabelV1TotalCarbohydrate({
      prediction: rawPrediction["total_carbohydrate"],
      pageId: pageId,
    });
    this.totalFat = new NutritionFactsLabelV1TotalFat({
      prediction: rawPrediction["total_fat"],
      pageId: pageId,
    });
    this.totalSugars = new NutritionFactsLabelV1TotalSugar({
      prediction: rawPrediction["total_sugars"],
      pageId: pageId,
    });
    this.transFat = new NutritionFactsLabelV1TransFat({
      prediction: rawPrediction["trans_fat"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    let nutrientsSummary:string = "";
    if (this.nutrients && this.nutrients.length > 0) {
      const nutrientsColSizes:number[] = [13, 22, 10, 13, 6];
      nutrientsSummary += "\n" + lineSeparator(nutrientsColSizes, "-") + "\n  ";
      nutrientsSummary += "| Daily Value ";
      nutrientsSummary += "| Name                 ";
      nutrientsSummary += "| Per 100g ";
      nutrientsSummary += "| Per Serving ";
      nutrientsSummary += "| Unit ";
      nutrientsSummary += "|\n" + lineSeparator(nutrientsColSizes, "=");
      nutrientsSummary += this.nutrients.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(nutrientsColSizes, "-")
      ).join("");
    }
    const outStr = `:Serving per Box: ${this.servingPerBox}
:Serving Size: ${this.servingSize.toFieldList()}
:Calories: ${this.calories.toFieldList()}
:Total Fat: ${this.totalFat.toFieldList()}
:Saturated Fat: ${this.saturatedFat.toFieldList()}
:Trans Fat: ${this.transFat.toFieldList()}
:Cholesterol: ${this.cholesterol.toFieldList()}
:Total Carbohydrate: ${this.totalCarbohydrate.toFieldList()}
:Dietary Fiber: ${this.dietaryFiber.toFieldList()}
:Total Sugars: ${this.totalSugars.toFieldList()}
:Added Sugars: ${this.addedSugars.toFieldList()}
:Protein: ${this.protein.toFieldList()}
:sodium: ${this.sodium.toFieldList()}
:nutrients: ${nutrientsSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}

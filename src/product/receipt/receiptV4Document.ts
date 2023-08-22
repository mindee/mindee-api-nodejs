import { Prediction, StringDict, cleanOutString } from "../../parsing/common";
import {
  ClassificationField,
  AmountField,
  DateField,
  StringField,
  LocaleField,
  TaxField,
  Taxes,
} from "../../parsing/standard";

/**
 * Document data for Receipt, API version 5.
 */
export class ReceiptV4Document implements Prediction {
  /** Where the purchase was made, the language, and the currency. */
  locale: LocaleField;
  /** The purchase date. */
  date: DateField;
  /** The receipt category among predefined classes. */
  category: ClassificationField;
  /** The receipt sub-category among predefined classes. */
  subCategory: ClassificationField;
  /** Whether the document is an expense receipt or a credit card receipt. */
  documentType: StringField;
  /** The name of the supplier or merchant, as seen on the receipt. */
  supplier: StringField;
  /** Time as seen on the receipt in HH:MM format. */
  time: StringField;
  /** List of taxes detected on the receipt. */
  taxes: TaxField[];
  /** Total amount of tip and gratuity. */
  tip: AmountField;
  /** total spent including taxes, discounts, fees, tips, and gratuity. */
  totalAmount: AmountField;
  /** Total amount of the purchase excluding taxes. */
  totalNet: AmountField;
  /** Total tax amount of the purchase. */
  totalTax: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.locale = new LocaleField({
      prediction: rawPrediction["locale"],
    });
    this.totalTax = new AmountField({
      prediction: rawPrediction["total_tax"],
      pageId: pageId,
    });
    this.totalAmount = new AmountField({
      prediction: rawPrediction["total_amount"],
      pageId: pageId,
    });
    this.totalNet = new AmountField({
      prediction: rawPrediction["total_net"],
      pageId: pageId,
    });
    this.tip = new AmountField({
      prediction: rawPrediction["tip"],
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    this.category = new ClassificationField({
      prediction: rawPrediction["category"],
    });
    this.subCategory = new ClassificationField({
      prediction: rawPrediction["subcategory"],
    });
    this.documentType = new StringField({
      prediction: rawPrediction["document_type"],
      pageId: pageId,
    });
    this.supplier = new StringField({
      prediction: rawPrediction["supplier"],
      pageId: pageId,
    });
    this.time = new StringField({
      prediction: rawPrediction["time"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(rawPrediction["taxes"], pageId);
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const outStr = `:Locale: ${this.locale}
:Date: ${this.date}
:Category: ${this.category}
:Subcategory: ${this.subCategory}
:Document type: ${this.documentType}
:Time: ${this.time}
:Supplier name: ${this.supplier}
:Taxes: ${this.taxes}
:Total net: ${this.totalNet}
:Total tax: ${this.totalTax}
:Tip: ${this.tip}
:Total amount: ${this.totalAmount}`;
    return cleanOutString(outStr);
  }
}

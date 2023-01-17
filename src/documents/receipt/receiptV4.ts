import { Document, DocumentConstructorProps } from "../document";
import {
  Amount,
  DateField,
  TextField,
  Locale,
  TaxField,
  StringDict,
} from "../../fields";

export class ReceiptV4 extends Document {
  /** Where the purchase was made, the language, and the currency. */
  locale!: Locale;
  /** The purchase date. */
  date!: DateField;
  /** The receipt category among predefined classes. */
  category!: TextField;
  /** The receipt sub-category among predefined classes. */
  subCategory!: TextField;
  /** Whether the document is an expense receipt or a credit card receipt. */
  documentType!: TextField;
  /** The name of the supplier or merchant, as seen on the receipt. */
  supplier!: TextField;
  /** Time as seen on the receipt in HH:MM format. */
  time!: TextField;
  /** List of taxes detected on the receipt. */
  taxes: TaxField[] = [];
  /** Total amount of tip and gratuity. */
  tip!: Amount;
  /** total spent including taxes, discounts, fees, tips, and gratuity. */
  totalAmount!: Amount;
  /** Total amount of the purchase excluding taxes. */
  totalNet!: Amount;
  /** Total tax amount of the purchase. */
  totalTax!: Amount;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({
      inputSource: inputSource,
      pageId: pageId,
      orientation: orientation,
      extras: extras,
      fullText: fullText,
    });
    this.#initFromApiPrediction(prediction, pageId);
  }

  #initFromApiPrediction(apiPrediction: any, pageId?: number) {
    this.locale = new Locale({
      prediction: apiPrediction.locale,
    });
    this.totalTax = new Amount({
      prediction: apiPrediction.total_tax,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalAmount = new Amount({
      prediction: apiPrediction.total_amount,
      valueKey: "value",
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: apiPrediction.total_net,
      valueKey: "value",
      pageId: pageId,
    });
    this.tip = new Amount({
      prediction: apiPrediction.tip,
      valueKey: "value",
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: apiPrediction.date,
      pageId: pageId,
    });
    this.category = new TextField({
      prediction: apiPrediction.category,
      pageId: pageId,
    });
    this.subCategory = new TextField({
      prediction: apiPrediction.subcategory,
      pageId: pageId,
    });
    this.documentType = new TextField({
      prediction: apiPrediction.document_type,
      pageId: pageId,
    });
    this.supplier = new TextField({
      prediction: apiPrediction.supplier,
      pageId: pageId,
    });
    this.time = new TextField({
      prediction: apiPrediction.time,
      pageId: pageId,
    });
    apiPrediction.taxes.map((taxPrediction: StringDict) =>
      this.taxes.push(
        new TaxField({
          prediction: taxPrediction,
          pageId: pageId,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
          baseKey: "base",
        })
      )
    );
  }

  toString(): string {
    const taxes = this.taxes.map((item) => item.toString()).join("\n       ");
    const outStr = `----- Receipt V4 -----
Filename: ${this.filename}
Total amount: ${this.totalAmount}
Total net: ${this.totalNet}
Tip: ${this.tip}
Date: ${this.date}
Category: ${this.category}
Subcategory: ${this.subCategory}
Document type: ${this.documentType}
Time: ${this.time}
Supplier name: ${this.supplier}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Locale: ${this.locale}
----------------------
`;
    return ReceiptV4.cleanOutString(outStr);
  }
}

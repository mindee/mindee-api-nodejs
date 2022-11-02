import { Document, DocumentConstructorProps } from "../document";
import { Amount, DateField, Field, Locale, TaxField } from "../../fields";
import { ReceiptTaxField } from "./tax";

export class ReceiptV4 extends Document {
  /** Where the purchase was made, the language, and the currency. */
  locale!: Locale;
  /** The purchase date. */
  date!: DateField;
  /** The type of purchase. */
  category!: Field;
  /** Merchant's name as seen on the receipt. */
  supplier!: Field;
  /** Time as seen on the receipt in HH:MM format. */
  time!: Field;
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
      pageId: pageId,
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
    this.category = new Field({
      prediction: apiPrediction.category,
      pageId: pageId,
    });
    this.supplier = new Field({
      prediction: apiPrediction.supplier,
      pageId: pageId,
    });
    this.time = new Field({
      prediction: apiPrediction.time,
      pageId: pageId,
    });
    apiPrediction.taxes.map((taxPrediction: { [index: string]: any }) =>
      this.taxes.push(
        new ReceiptTaxField({
          prediction: taxPrediction,
          pageId: pageId,
          valueKey: "value",
          rateKey: "rate",
          codeKey: "code",
          basisKey: "basis",
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

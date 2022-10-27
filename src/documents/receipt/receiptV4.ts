import { Document, DocumentConstructorProps } from "../document";
import { Amount, DateField, Field, Locale, TaxField } from "../../fields";
import { ReceiptTaxField } from "./tax";

export class ReceiptV4 extends Document {
  locale!: Locale;
  date!: DateField;
  /** Receipt category as seen on the receipt. */
  category!: Field;
  merchantName!: Field;
  time!: Field;
  taxes: TaxField[] = [];
  tip!: Amount;
  totalAmount!: Amount;
  totalNet!: Amount;
  totalTax!: Amount;

  constructor({
    prediction,
    orientation = undefined,
    extras = undefined,
    inputSource = undefined,
    fullText = undefined,
    pageId = undefined,
  }: DocumentConstructorProps) {
    super({ inputSource: inputSource, pageId, fullText, orientation, extras });

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
    this.merchantName = new Field({
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
Supplier name: ${this.merchantName}
Taxes: ${taxes}
Total taxes: ${this.totalTax}
Locale: ${this.locale}
----------------------
`;
    return ReceiptV4.cleanOutString(outStr);
  }
}

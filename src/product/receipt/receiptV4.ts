import { Document, DocumentConstructorProps } from "../../parsing/common";
import {
  ClassificationField,
  Amount,
  DateField,
  TextField,
  Locale,
  TaxField,
  Taxes,
} from "../../parsing/standard";

export class ReceiptV4 extends Document {
  /** Where the purchase was made, the language, and the currency. */
  locale: Locale;
  /** The purchase date. */
  date: DateField;
  /** The receipt category among predefined classes. */
  category: ClassificationField;
  /** The receipt sub-category among predefined classes. */
  subCategory: ClassificationField;
  /** Whether the document is an expense receipt or a credit card receipt. */
  documentType: TextField;
  /** The name of the supplier or merchant, as seen on the receipt. */
  supplier: TextField;
  /** Time as seen on the receipt in HH:MM format. */
  time: TextField;
  /** List of taxes detected on the receipt. */
  taxes: TaxField[];
  /** Total amount of tip and gratuity. */
  tip: Amount;
  /** total spent including taxes, discounts, fees, tips, and gratuity. */
  totalAmount: Amount;
  /** Total amount of the purchase excluding taxes. */
  totalNet: Amount;
  /** Total tax amount of the purchase. */
  totalTax: Amount;

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

    this.locale = new Locale({
      prediction: prediction.locale,
    });
    this.totalTax = new Amount({
      prediction: prediction.total_tax,
      pageId: pageId,
    });
    this.totalAmount = new Amount({
      prediction: prediction.total_amount,
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction.total_net,
      pageId: pageId,
    });
    this.tip = new Amount({
      prediction: prediction.tip,
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: prediction.date,
      pageId: pageId,
    });
    this.category = new ClassificationField({
      prediction: prediction.category,
    });
    this.subCategory = new ClassificationField({
      prediction: prediction.subcategory,
    });
    this.documentType = new TextField({
      prediction: prediction.document_type,
      pageId: pageId,
    });
    this.supplier = new TextField({
      prediction: prediction.supplier,
      pageId: pageId,
    });
    this.time = new TextField({
      prediction: prediction.time,
      pageId: pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
  }

  toString(): string {
    const outStr = `Receipt V4 Prediction
=====================
:Filename: ${this.filename}
:Total amount: ${this.totalAmount}
:Total net: ${this.totalNet}
:Tip: ${this.tip}
:Date: ${this.date}
:Category: ${this.category}
:Subcategory: ${this.subCategory}
:Document type: ${this.documentType}
:Time: ${this.time}
:Supplier name: ${this.supplier}
:Taxes: ${this.taxes}
:Total tax: ${this.totalTax}
:Locale: ${this.locale}
`;
    return ReceiptV4.cleanOutString(outStr);
  }
}
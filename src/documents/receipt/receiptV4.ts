import { Document, DocumentConstructorProps } from "../document";
import {
  Amount,
  DateField,
  TextField,
  Locale,
  TaxField,
  StringDict,
} from "../../fields";
import { IsFinancialDocumentBase } from "../common/financialDocument";

export interface IsReceiptV4 extends IsFinancialDocumentBase {
  /** The receipt category among predefined classes. */
  category: TextField;
  /** The receipt sub-category among predefined classes. */
  subCategory: TextField;
  /** The name of the supplier or merchant, as seen on the receipt. */
  supplier: TextField;
  /** Time as seen on the receipt in HH:MM format. */
  time: TextField;
  /** Total amount of tip and gratuity. */
  tip: Amount;
}

export class ReceiptV4 extends Document implements IsReceiptV4 {
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
    buildReceiptV4(this, prediction, pageId);
  }

  toString(): string {
    return ReceiptV4.cleanOutString(getReceiptV4Summary(this));
  }
}

export function buildReceiptV4(
  receipt: IsReceiptV4,
  apiPrediction: StringDict,
  pageId: number | undefined
): void {
  receipt.locale = new Locale({
    prediction: apiPrediction.locale,
  });
  receipt.totalTax = new Amount({
    prediction: apiPrediction.total_tax,
    valueKey: "value",
    pageId: pageId,
  });
  receipt.totalAmount = new Amount({
    prediction: apiPrediction.total_amount,
    valueKey: "value",
    pageId: pageId,
  });
  receipt.totalNet = new Amount({
    prediction: apiPrediction.total_net,
    valueKey: "value",
    pageId: pageId,
  });
  receipt.tip = new Amount({
    prediction: apiPrediction.tip,
    valueKey: "value",
    pageId: pageId,
  });
  receipt.date = new DateField({
    prediction: apiPrediction.date,
    pageId: pageId,
  });
  receipt.category = new TextField({
    prediction: apiPrediction.category,
    pageId: pageId,
  });
  receipt.subCategory = new TextField({
    prediction: apiPrediction.subcategory,
    pageId: pageId,
  });
  receipt.documentType = new TextField({
    prediction: apiPrediction.document_type,
    pageId: pageId,
  });
  receipt.supplier = new TextField({
    prediction: apiPrediction.supplier,
    pageId: pageId,
  });
  receipt.time = new TextField({
    prediction: apiPrediction.time,
    pageId: pageId,
  });
  apiPrediction.taxes.map((taxPrediction: StringDict) =>
    receipt.taxes.push(
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

export function getReceiptV4Summary(receipt: IsReceiptV4): string {
  const taxes = receipt.taxes.map((item) => item.toString()).join("\n       ");
  const outStr = `----- Receipt V4 -----
Total amount: ${receipt.totalAmount}
Total net: ${receipt.totalNet}
Tip: ${receipt.tip}
Date: ${receipt.date}
Category: ${receipt.category}
Subcategory: ${receipt.subCategory}
Document type: ${receipt.documentType}
Time: ${receipt.time}
Supplier name: ${receipt.supplier}
Taxes: ${taxes}
Total taxes: ${receipt.totalTax}
Locale: ${receipt.locale}
----------------------
`;

  return outStr;
}

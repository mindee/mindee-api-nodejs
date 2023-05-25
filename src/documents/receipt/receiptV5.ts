import { Document, DocumentConstructorProps } from "../document";
import {
  Amount,
  ClassificationField,
  CompanyRegistration,
  DateField,
  Locale,
  StringDict,
  TaxField,
  Taxes,
  TextField,
} from "../../fields";
import { ReceiptV5LineItem } from "./receiptV5LineItem";

/**
 * Document data for Receipt, API version 5.
 */
export class ReceiptV5 extends Document {
  /** The locale identifier in BCP 47 (RFC 5646) format: ISO language code, '-', ISO country code. */
  locale: Locale;
  /** The receipt category among predefined classes. */
  category: ClassificationField;
  /** The receipt sub category among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The receipt document type provides the information whether the document is an expense receipt or a credit card receipt. */
  documentType: ClassificationField;
  /** The date the purchase was made. */
  date: DateField;
  /** Time of purchase with 24 hours formatting (HH:MM). */
  time: TextField;
  /** The total amount paid including taxes, discounts, fees, tips, and gratuity. */
  totalAmount: Amount;
  /** The total amount excluding taxes. */
  totalNet: Amount;
  /** The total amount of taxes. */
  totalTax: Amount;
  /** The total amount of tip and gratuity. */
  tip: Amount;
  /** List of tax lines information including: Amount, tax rate, tax base amount and tax code. */
  taxes: TaxField[];
  /** The name of the supplier or merchant. */
  supplierName: TextField;
  /** List of supplier company registrations or identifiers. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The address of the supplier or merchant returned as a single string. */
  supplierAddress: TextField;
  /** The Phone number of the supplier or merchant returned as a single string. */
  supplierPhoneNumber: TextField;
  /** Full extraction of lines, including: description, quantity, unit price and total. */
  lineItems: ReceiptV5LineItem[] = [];

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
      prediction: prediction["locale"],
    });
    this.category = new ClassificationField({
      prediction: prediction["category"],
    });
    this.subcategory = new ClassificationField({
      prediction: prediction["subcategory"],
    });
    this.documentType = new ClassificationField({
      prediction: prediction["document_type"],
    });
    this.date = new DateField({
      prediction: prediction["date"],
      pageId: pageId,
    });
    this.time = new TextField({
      prediction: prediction["time"],
      pageId: pageId,
    });
    this.totalAmount = new Amount({
      prediction: prediction["total_amount"],
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction["total_net"],
      pageId: pageId,
    });
    this.totalTax = new Amount({
      prediction: prediction["total_tax"],
      pageId: pageId,
    });
    this.tip = new Amount({
      prediction: prediction["tip"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
    this.supplierName = new TextField({
      prediction: prediction["supplier_name"],
      pageId: pageId,
    });
    prediction["supplier_company_registrations"].map(
      (itemPrediction: StringDict) =>
        this.supplierCompanyRegistrations.push(
          new CompanyRegistration({
            prediction: itemPrediction,
            pageId: pageId,
          })
        )
    );
    this.supplierAddress = new TextField({
      prediction: prediction["supplier_address"],
      pageId: pageId,
    });
    this.supplierPhoneNumber = new TextField({
      prediction: prediction["supplier_phone_number"],
      pageId: pageId,
    });
    prediction["line_items"].map((itemPrediction: StringDict) =>
      this.lineItems.push(
        new ReceiptV5LineItem({
          prediction: itemPrediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const outStr = `Receipt V5 Prediction
=====================
:Filename: ${this.filename}
:Expense Locale: ${this.locale}
:Expense Category: ${this.category}
:Expense Sub Category: ${this.subcategory}
:Document Type: ${this.documentType}
:Purchase Date: ${this.date}
:Purchase Time: ${this.time}
:Total Amount: ${this.totalAmount}
:Total Excluding Taxes: ${this.totalNet}
:Total Tax: ${this.totalTax}
:Tip and Gratuity: ${this.tip}
:Taxes: ${this.taxes}
:Supplier Name: ${this.supplierName}
:Supplier Company Registrations: ${this.supplierCompanyRegistrations.join(
      `\n ${" ".repeat(32)}`
    )}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Line Items: ${this.#lineItemsToString()}
`;
    return ReceiptV5.cleanOutString(outStr);
  }

  #lineItemsSeparator(char: string) {
    let outStr = "  ";
    outStr += `+${char.repeat(38)}`;
    outStr += `+${char.repeat(10)}`;
    outStr += `+${char.repeat(14)}`;
    outStr += `+${char.repeat(12)}`;
    return outStr + "+";
  }

  #lineItemsToString() {
    if (!this.lineItems) {
      return "";
    }

    const lines = this.lineItems
      .map((item) => `${item}`)
      .join(`\n${this.#lineItemsSeparator("-")}\n  `);

    let outStr = "";
    outStr += `\n${this.#lineItemsSeparator("-")}`;
    outStr +=
      "\n  | Description                          | Quantity | Total Amount | Unit Price |";
    outStr += `\n${this.#lineItemsSeparator("=")}`;
    outStr += `\n  ${lines}`;
    outStr += `\n${this.#lineItemsSeparator("-")}`;
    return outStr;
  }
}

import {
  Inference,
  DocumentConstructorProps,
  StringDict,
} from "../../parsing/common";
import {
  Amount,
  ClassificationField,
  CompanyRegistration,
  DateField,
  Locale,
  Taxes,
  TaxField,
  TextField,
} from "../../parsing/standard";
import { ReceiptV5LineItem } from "./receiptV5LineItem";

/**
 * Document data for Expense Receipt, API version 5.
 */
export class ReceiptV5 extends Inference {
  static endpointName ='expense_receipts';
  static endpointVersion = '5';
  /** The purchase category among predefined classes. */
  category: ClassificationField;
  /** The date the purchase was made. */
  date: DateField;
  /** One of: 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'. */
  documentType: ClassificationField;
  /** List of line item details. */
  lineItems: ReceiptV5LineItem[] = [];
  /** The locale detected on the document. */
  locale: Locale;
  /** The purchase subcategory among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The address of the supplier or merchant. */
  supplierAddress: TextField;
  /** List of company registrations associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The name of the supplier or merchant. */
  supplierName: TextField;
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: TextField;
  /** List of tax lines information. */
  taxes: TaxField[];
  /** The time the purchase was made. */
  time: TextField;
  /** The total amount of tip and gratuity. */
  tip: Amount;
  /** The total amount paid: includes taxes, discounts, fees, tips, and gratuity. */
  totalAmount: Amount;
  /** The net amount paid: does not include taxes, fees, and discounts. */
  totalNet: Amount;
  /** The total amount of taxes. */
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
    this.category = new ClassificationField({
      prediction: prediction["category"],
    });
    this.date = new DateField({
      prediction: prediction["date"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: prediction["document_type"],
    });
    prediction["line_items"].map((itemPrediction: StringDict) =>
      this.lineItems.push(
        new ReceiptV5LineItem({
          prediction: itemPrediction,
          pageId: pageId,
        })
      )
    );
    this.locale = new Locale({
      prediction: prediction["locale"],
    });
    this.subcategory = new ClassificationField({
      prediction: prediction["subcategory"],
    });
    this.supplierAddress = new TextField({
      prediction: prediction["supplier_address"],
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
    this.supplierName = new TextField({
      prediction: prediction["supplier_name"],
      pageId: pageId,
    });
    this.supplierPhoneNumber = new TextField({
      prediction: prediction["supplier_phone_number"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
    this.time = new TextField({
      prediction: prediction["time"],
      pageId: pageId,
    });
    this.tip = new Amount({
      prediction: prediction["tip"],
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
  }

  toString(): string {
    const outStr = `Receipt V5 Prediction
=====================
:Filename: ${this.filename}
:Expense Locale: ${this.locale}
:Purchase Category: ${this.category}
:Purchase Subcategory: ${this.subcategory}
:Document Type: ${this.documentType}
:Purchase Date: ${this.date}
:Purchase Time: ${this.time}
:Total Amount: ${this.totalAmount}
:Total Net: ${this.totalNet}
:Total Tax: ${this.totalTax}
:Tip and Gratuity: ${this.tip}
:Taxes: ${this.taxes}
:Supplier Name: ${this.supplierName}
:Supplier Company Registrations: ${this.supplierCompanyRegistrations.join(
      `${" ".repeat(32)}`
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
    if (!this.lineItems || this.lineItems.length === 0) {
      return "";
    }

    const lines = this.lineItems
      .map((item) => item.toTableLine())
      .join(`\n${this.#lineItemsSeparator("-")}\n  `);

    let outStr = "";
    outStr += `\n${this.#lineItemsSeparator("-")}\n `;
    outStr += " | Description                         ";
    outStr += " | Quantity";
    outStr += " | Total Amount";
    outStr += " | Unit Price";
    outStr += ` |\n${this.#lineItemsSeparator("=")}`;
    outStr += `\n  ${lines}`;
    outStr += `\n${this.#lineItemsSeparator("-")}`;
    return outStr;
  }
}

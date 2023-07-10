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
  PaymentDetails,
  TaxField,
  Taxes,
  TextField,
} from "../../parsing/standard";
import { FinancialDocumentV1LineItem } from "./financialDocumentV1LineItem";

/**
 * Document data for Financial Document, API version 1.
 */
export class FinancialDocumentV1 extends Inference {
  static endpointName ='financial_document';
  static endpointVersion = '1';
  /** The locale detected on the document. */
  locale: Locale;
  /** The invoice number or identifier. */
  invoiceNumber: TextField;
  /** List of Reference numbers, including PO number. */
  referenceNumbers: TextField[] = [];
  /** The date the purchase was made. */
  date: DateField;
  /** The date on which the payment is due. */
  dueDate: DateField;
  /** The net amount paid: does not include taxes, fees, and discounts. */
  totalNet: Amount;
  /** The total amount paid: includes taxes, tips, fees, and other charges. */
  totalAmount: Amount;
  /** List of tax lines information. */
  taxes: TaxField[];
  /** List of payment details associated to the supplier. */
  supplierPaymentDetails: PaymentDetails[] = [];
  /** The name of the supplier or merchant. */
  supplierName: TextField;
  /** List of company registrations associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistration[] = [];
  /** The address of the supplier or merchant. */
  supplierAddress: TextField;
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: TextField;
  /** The name of the customer. */
  customerName: TextField;
  /** List of company registrations associated to the customer. */
  customerCompanyRegistrations: CompanyRegistration[] = [];
  /** The address of the customer. */
  customerAddress: TextField;
  /** One of: 'INVOICE', 'CREDIT NOTE', 'CREDIT CARD RECEIPT', 'EXPENSE RECEIPT'. */
  documentType: ClassificationField;
  /** The purchase subcategory among predefined classes for transport and food. */
  subcategory: ClassificationField;
  /** The purchase category among predefined classes. */
  category: ClassificationField;
  /** The total amount of taxes. */
  totalTax: Amount;
  /** The total amount of tip and gratuity */
  tip: Amount;
  /** The time the purchase was made. */
  time: TextField;
  /** List of line item details. */
  lineItems: FinancialDocumentV1LineItem[] = [];

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
      valueKey: "language",
    });
    this.invoiceNumber = new TextField({
      prediction: prediction["invoice_number"],
      pageId: pageId,
    });
    prediction["reference_numbers"].map((itemPrediction: StringDict) =>
      this.referenceNumbers.push(
        new TextField({
          prediction: itemPrediction,
          pageId: pageId,
        })
      )
    );
    this.date = new DateField({
      prediction: prediction["date"],
      pageId: pageId,
    });
    this.dueDate = new DateField({
      prediction: prediction["due_date"],
      pageId: pageId,
    });
    this.totalNet = new Amount({
      prediction: prediction["total_net"],
      pageId: pageId,
    });
    this.totalAmount = new Amount({
      prediction: prediction["total_amount"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(prediction["taxes"], pageId);
    prediction["supplier_payment_details"].map((itemPrediction: StringDict) =>
      this.supplierPaymentDetails.push(
        new PaymentDetails({
          prediction: itemPrediction,
          pageId: pageId,
        })
      )
    );
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
    this.customerName = new TextField({
      prediction: prediction["customer_name"],
      pageId: pageId,
    });
    prediction["customer_company_registrations"].map(
      (itemPrediction: StringDict) =>
        this.customerCompanyRegistrations.push(
          new CompanyRegistration({
            prediction: itemPrediction,
            pageId: pageId,
          })
        )
    );
    this.customerAddress = new TextField({
      prediction: prediction["customer_address"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: prediction["document_type"],
    });
    this.subcategory = new ClassificationField({
      prediction: prediction["subcategory"],
    });
    this.category = new ClassificationField({
      prediction: prediction["category"],
    });
    this.totalTax = new Amount({
      prediction: prediction["total_tax"],
      pageId: pageId,
    });
    this.tip = new Amount({
      prediction: prediction["tip"],
      pageId: pageId,
    });
    this.time = new TextField({
      prediction: prediction["time"],
      pageId: pageId,
    });
    prediction["line_items"].map((itemPrediction: StringDict) =>
      this.lineItems.push(
        new FinancialDocumentV1LineItem({
          prediction: itemPrediction,
          pageId: pageId,
        })
      )
    );
  }

  toString(): string {
    const referenceNumbers = this.referenceNumbers
      .map((item) => item.toString())
      .join(", ");
    const supplierPaymentDetails = this.supplierPaymentDetails
      .map((item) => item.toString())
      .join("\n                 ");
    const customerCompanyRegistrations = this.customerCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");
    const supplierCompanyRegistrations = this.supplierCompanyRegistrations
      .map((item) => item.toString())
      .join("; ");

    const outStr = `Financial Document V1 Prediction
================================
:Filename: ${this.filename}
:Locale: ${this.locale}
:Invoice Number: ${this.invoiceNumber}
:Reference Numbers: ${referenceNumbers}
:Purchase Date: ${this.date}
:Due Date: ${this.dueDate}
:Total Net: ${this.totalNet}
:Total Amount: ${this.totalAmount}
:Taxes: ${this.taxes}
:Supplier Payment Details: ${supplierPaymentDetails}
:Supplier name: ${this.supplierName}
:Supplier Company Registrations: ${customerCompanyRegistrations}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Customer name: ${this.customerName}
:Customer Company Registrations: ${supplierCompanyRegistrations}
:Customer Address: ${this.customerAddress}
:Document Type: ${this.documentType}
:Purchase Subcategory: ${this.subcategory}
:Purchase Category: ${this.category}
:Total Tax: ${this.totalTax}
:Tip and Gratuity: ${this.tip}
:Purchase Time: ${this.time}
:Line Items: ${this.#lineItemsToString()}
`;
    return FinancialDocumentV1.cleanOutString(outStr);
  }

  #lineItemsSeparator(char: string) {
    let outStr = "  ";
    outStr += `+${char.repeat(38)}`;
    outStr += `+${char.repeat(14)}`;
    outStr += `+${char.repeat(10)}`;
    outStr += `+${char.repeat(12)}`;
    outStr += `+${char.repeat(14)}`;
    outStr += `+${char.repeat(14)}`;
    outStr += `+${char.repeat(12)}`;
    return outStr + "+";
  }

  #lineItemsToString() {
    if (this.lineItems.length === 0) {
      return "";
    }

    const lines = this.lineItems
      .map((item) => item.toTableLine())
      .join(`\n${this.#lineItemsSeparator("-")}\n  `);

    let outStr = "";
    outStr += `\n${this.#lineItemsSeparator("-")}\n `;
    outStr += " | Description                         ";
    outStr += " | Product code";
    outStr += " | Quantity";
    outStr += " | Tax Amount";
    outStr += " | Tax Rate (%)";
    outStr += " | Total Amount";
    outStr += " | Unit Price";
    outStr += ` |\n${this.#lineItemsSeparator("=")}`;
    outStr += `\n  ${lines}`;
    outStr += `\n${this.#lineItemsSeparator("-")}`;
    return outStr;
  }
}

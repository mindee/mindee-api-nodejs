import {
  Prediction,
  StringDict,
  cleanOutString,lineSeparator,
} from "@/parsing/common/index.js";
import { InvoiceV4LineItem } from "./invoiceV4LineItem.js";
import {
  AddressField,
  AmountField,
  ClassificationField,
  CompanyRegistrationField,
  DateField,
  LocaleField,
  PaymentDetailsField,
  StringField,
  Taxes,
} from "@/parsing/standard/index.js";

/**
 * Invoice API version 4.11 document data.
 */
export class InvoiceV4Document implements Prediction {
  /** The customer billing address. */
  billingAddress: AddressField;
  /** The purchase category. */
  category: ClassificationField;
  /** The address of the customer. */
  customerAddress: AddressField;
  /** List of company registration numbers associated to the customer. */
  customerCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The customer account number or identifier from the supplier. */
  customerId: StringField;
  /** The name of the customer or client. */
  customerName: StringField;
  /** The date the purchase was made. */
  date: DateField;
  /** Document type: INVOICE or CREDIT NOTE. */
  documentType: ClassificationField;
  /** Document type extended. */
  documentTypeExtended: ClassificationField;
  /** The date on which the payment is due. */
  dueDate: DateField;
  /** The invoice number or identifier. */
  invoiceNumber: StringField;
  /** List of all the line items present on the invoice. */
  lineItems: InvoiceV4LineItem[] = [];
  /** The locale of the document. */
  locale: LocaleField;
  /** The date on which the payment is due / was full-filled. */
  paymentDate: DateField;
  /** The purchase order number. */
  poNumber: StringField;
  /** List of all reference numbers on the invoice, including the purchase order number. */
  referenceNumbers: StringField[] = [];
  /** Customer's delivery address. */
  shippingAddress: AddressField;
  /** The purchase subcategory for transport, food and shopping. */
  subcategory: ClassificationField;
  /** The address of the supplier or merchant. */
  supplierAddress: AddressField;
  /** List of company registration numbers associated to the supplier. */
  supplierCompanyRegistrations: CompanyRegistrationField[] = [];
  /** The email address of the supplier or merchant. */
  supplierEmail: StringField;
  /** The name of the supplier or merchant. */
  supplierName: StringField;
  /** List of payment details associated to the supplier of the invoice. */
  supplierPaymentDetails: PaymentDetailsField[] = [];
  /** The phone number of the supplier or merchant. */
  supplierPhoneNumber: StringField;
  /** The website URL of the supplier or merchant. */
  supplierWebsite: StringField;
  /** List of taxes. Each item contains the detail of the tax. */
  taxes: Taxes;
  /** The total amount of the invoice: includes taxes, tips, fees, and other charges. */
  totalAmount: AmountField;
  /** The net amount of the invoice: does not include taxes, fees, and discounts. */
  totalNet: AmountField;
  /** The total tax: the sum of all the taxes for this invoice. */
  totalTax: AmountField;

  constructor(rawPrediction: StringDict, pageId?: number) {
    this.billingAddress = new AddressField({
      prediction: rawPrediction["billing_address"],
      pageId: pageId,
    });
    this.category = new ClassificationField({
      prediction: rawPrediction["category"],
    });
    this.customerAddress = new AddressField({
      prediction: rawPrediction["customer_address"],
      pageId: pageId,
    });
    rawPrediction["customer_company_registrations"] &&
      rawPrediction["customer_company_registrations"].map(
        (itemPrediction: StringDict) =>
          this.customerCompanyRegistrations.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.customerId = new StringField({
      prediction: rawPrediction["customer_id"],
      pageId: pageId,
    });
    this.customerName = new StringField({
      prediction: rawPrediction["customer_name"],
      pageId: pageId,
    });
    this.date = new DateField({
      prediction: rawPrediction["date"],
      pageId: pageId,
    });
    this.documentType = new ClassificationField({
      prediction: rawPrediction["document_type"],
    });
    this.documentTypeExtended = new ClassificationField({
      prediction: rawPrediction["document_type_extended"],
    });
    this.dueDate = new DateField({
      prediction: rawPrediction["due_date"],
      pageId: pageId,
    });
    this.invoiceNumber = new StringField({
      prediction: rawPrediction["invoice_number"],
      pageId: pageId,
    });
    rawPrediction["line_items"] &&
      rawPrediction["line_items"].map(
        (itemPrediction: StringDict) =>
          this.lineItems.push(
            new InvoiceV4LineItem({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.locale = new LocaleField({
      prediction: rawPrediction["locale"],
    });
    this.paymentDate = new DateField({
      prediction: rawPrediction["payment_date"],
      pageId: pageId,
    });
    this.poNumber = new StringField({
      prediction: rawPrediction["po_number"],
      pageId: pageId,
    });
    rawPrediction["reference_numbers"] &&
      rawPrediction["reference_numbers"].map(
        (itemPrediction: StringDict) =>
          this.referenceNumbers.push(
            new StringField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.shippingAddress = new AddressField({
      prediction: rawPrediction["shipping_address"],
      pageId: pageId,
    });
    this.subcategory = new ClassificationField({
      prediction: rawPrediction["subcategory"],
    });
    this.supplierAddress = new AddressField({
      prediction: rawPrediction["supplier_address"],
      pageId: pageId,
    });
    rawPrediction["supplier_company_registrations"] &&
      rawPrediction["supplier_company_registrations"].map(
        (itemPrediction: StringDict) =>
          this.supplierCompanyRegistrations.push(
            new CompanyRegistrationField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.supplierEmail = new StringField({
      prediction: rawPrediction["supplier_email"],
      pageId: pageId,
    });
    this.supplierName = new StringField({
      prediction: rawPrediction["supplier_name"],
      pageId: pageId,
    });
    rawPrediction["supplier_payment_details"] &&
      rawPrediction["supplier_payment_details"].map(
        (itemPrediction: StringDict) =>
          this.supplierPaymentDetails.push(
            new PaymentDetailsField({
              prediction: itemPrediction,
              pageId: pageId,
            })
          )
      );
    this.supplierPhoneNumber = new StringField({
      prediction: rawPrediction["supplier_phone_number"],
      pageId: pageId,
    });
    this.supplierWebsite = new StringField({
      prediction: rawPrediction["supplier_website"],
      pageId: pageId,
    });
    this.taxes = new Taxes().init(
      rawPrediction["taxes"], pageId
    );
    this.totalAmount = new AmountField({
      prediction: rawPrediction["total_amount"],
      pageId: pageId,
    });
    this.totalNet = new AmountField({
      prediction: rawPrediction["total_net"],
      pageId: pageId,
    });
    this.totalTax = new AmountField({
      prediction: rawPrediction["total_tax"],
      pageId: pageId,
    });
  }

  /**
   * Default string representation.
   */
  toString(): string {
    const referenceNumbers = this.referenceNumbers.join("\n                    ");
    const supplierPaymentDetails = this.supplierPaymentDetails.join("\n                           ");
    const supplierCompanyRegistrations = this.supplierCompanyRegistrations.join("\n                                 ");
    const customerCompanyRegistrations = this.customerCompanyRegistrations.join("\n                                 ");
    let lineItemsSummary:string = "";
    if (this.lineItems && this.lineItems.length > 0) {
      const lineItemsColSizes:number[] = [38, 14, 10, 12, 14, 14, 17, 12];
      lineItemsSummary += "\n" + lineSeparator(lineItemsColSizes, "-") + "\n  ";
      lineItemsSummary += "| Description                          ";
      lineItemsSummary += "| Product code ";
      lineItemsSummary += "| Quantity ";
      lineItemsSummary += "| Tax Amount ";
      lineItemsSummary += "| Tax Rate (%) ";
      lineItemsSummary += "| Total Amount ";
      lineItemsSummary += "| Unit of measure ";
      lineItemsSummary += "| Unit Price ";
      lineItemsSummary += "|\n" + lineSeparator(lineItemsColSizes, "=");
      lineItemsSummary += this.lineItems.map(
        (item) =>
          "\n  " + item.toTableLine() + "\n" + lineSeparator(lineItemsColSizes, "-")
      ).join("");
    }
    const outStr = `:Locale: ${this.locale}
:Invoice Number: ${this.invoiceNumber}
:Purchase Order Number: ${this.poNumber}
:Reference Numbers: ${referenceNumbers}
:Purchase Date: ${this.date}
:Due Date: ${this.dueDate}
:Payment Date: ${this.paymentDate}
:Total Net: ${this.totalNet}
:Total Amount: ${this.totalAmount}
:Total Tax: ${this.totalTax}
:Taxes: ${this.taxes}
:Supplier Payment Details: ${supplierPaymentDetails}
:Supplier Name: ${this.supplierName}
:Supplier Company Registrations: ${supplierCompanyRegistrations}
:Supplier Address: ${this.supplierAddress}
:Supplier Phone Number: ${this.supplierPhoneNumber}
:Supplier Website: ${this.supplierWebsite}
:Supplier Email: ${this.supplierEmail}
:Customer Name: ${this.customerName}
:Customer Company Registrations: ${customerCompanyRegistrations}
:Customer Address: ${this.customerAddress}
:Customer ID: ${this.customerId}
:Shipping Address: ${this.shippingAddress}
:Billing Address: ${this.billingAddress}
:Document Type: ${this.documentType}
:Document Type Extended: ${this.documentTypeExtended}
:Purchase Subcategory: ${this.subcategory}
:Purchase Category: ${this.category}
:Line Items: ${lineItemsSummary}`.trimEnd();
    return cleanOutString(outStr);
  }
}

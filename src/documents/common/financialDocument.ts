import { Amount, BaseField, DateField, Locale, TaxField } from "src/fields";

export interface IsFinancialDocumentBase {
  /** Where the purchase was made, the language, and the currency. */
  locale: Locale;
  /** The creation date of the document. */
  date: DateField;
  /** The nature of the current document. */
  documentType: BaseField;
  /** total spent including taxes, discounts, fees, tips, and gratuity. */
  totalAmount: Amount;
  /** Total amount of the purchase excluding taxes. */
  totalNet: Amount;
  /** Total tax amount of the purchase. */
  totalTax: Amount;
  /** The list of the taxes. */
  taxes: TaxField[];
}

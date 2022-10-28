import { Invoice } from "./invoice";
import { Receipt } from "./receipt";
import { Passport } from "./passport";
import { FinancialDocument } from "./financialDocument";
import { CustomDocument } from "./custom";
import { Cropper } from "./cropper";

export { Document, DocumentConstructorProps } from "./document";
export {
  Receipt,
  Invoice,
  FinancialDocument,
  Passport,
  CustomDocument,
  Cropper,
};

export const DOC_TYPE_INVOICE = Invoice.name;
export const DOC_TYPE_RECEIPT = Receipt.name;
export const DOC_TYPE_PASSPORT = Passport.name;
export const DOC_TYPE_FINANCIAL = FinancialDocument.name;
export const DOC_TYPE_CUSTOM = CustomDocument.name;
export const DOC_TYPE_CROPPER = Cropper.name;
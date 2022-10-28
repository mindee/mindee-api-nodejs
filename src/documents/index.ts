import { InvoiceV3 } from "./invoice/invoiceV3";
import { ReceiptV3 } from "./receipt/receiptV3";
import { ReceiptV4 } from "./receipt/receiptV4";
import { PassportV1 } from "./passport/passportV1";
import { FinancialDocumentV1 } from "./financialDocument/financialDocumentV1";
import { CustomV1 } from "./custom";
import { CropperV1 } from "./cropper/cropperV1";

export { Document, DocumentConstructorProps, DocumentSig } from "./document";
export {
  ReceiptV3,
  ReceiptV4,
  InvoiceV3,
  FinancialDocumentV1,
  PassportV1,
  CustomV1,
  CropperV1,
};

export const DOC_TYPE_CUSTOM = CustomV1.name;
export const DOC_TYPE_INVOICE_V3 = InvoiceV3.name;
export const DOC_TYPE_RECEIPT_V3 = ReceiptV3.name;
export const DOC_TYPE_RECEIPT_V4 = ReceiptV4.name;
export const DOC_TYPE_PASSPORT_V1 = PassportV1.name;
export const DOC_TYPE_FINANCIAL_V1 = FinancialDocumentV1.name;
export const DOC_TYPE_CROPPER_V1 = CropperV1.name;

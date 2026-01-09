//
// PRODUCT CONFIGURATION
//
// The Map's key is the command name as it will appear on the console.
//

import * as product from "@/product/index.js";
import { Inference, StringDict } from "@/parsing/common/index.js";

export const COMMAND_GENERATED = "generated";

export interface ProductConfig<T extends Inference = Inference> {
  displayName: string;
  docClass: new (rawPrediction: StringDict) => T;
  allWords: boolean;
  async: boolean;
  sync: boolean;
}

export const CLI_COMMAND_CONFIG = new Map<string, ProductConfig>([
  [
    COMMAND_GENERATED,
    {
      displayName: "Generated Document",
      docClass: product.GeneratedV1,
      allWords: true,
      async: true,
      sync: true,
    },
  ],
  [
    "barcode-reader",
    {
      displayName: "Barcode Reader",
      docClass: product.BarcodeReaderV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "cropper",
    {
      displayName: "Cropper",
      docClass: product.CropperV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "driver-license",
    {
      displayName: "Driver License",
      docClass: product.DriverLicenseV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "financial-document",
    {
      displayName: "Financial Document",
      docClass: product.FinancialDocumentV1,
      allWords: true,
      async: true,
      sync: true,
    },
  ],
  [
    "fr-bank-account-details",
    {
      displayName: "FR Bank Account Details",
      docClass: product.fr.BankAccountDetailsV2,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-energy-bill",
    {
      displayName: "FR Energy Bill",
      docClass: product.fr.EnergyBillV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "fr-health-card",
    {
      displayName: "FR Health Card",
      docClass: product.fr.HealthCardV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "fr-carte-nationale-d-identite",
    {
      displayName: "FR Carte Nationale d'Identité",
      docClass: product.fr.IdCardV2,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "fr-payslip",
    {
      displayName: "FR Payslip",
      docClass: product.fr.PayslipV3,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "ind-passport-india",
    {
      displayName: "IND Passport - India",
      docClass: product.ind.IndianPassportV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "international-id",
    {
      displayName: "International ID",
      docClass: product.InternationalIdV2,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "invoice",
    {
      displayName: "Invoice",
      docClass: product.InvoiceV4,
      allWords: true,
      async: true,
      sync: true,
    },
  ],
  [
    "invoice-splitter",
    {
      displayName: "Invoice Splitter",
      docClass: product.InvoiceSplitterV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "multi-receipts-detector",
    {
      displayName: "Multi Receipts Detector",
      docClass: product.MultiReceiptsDetectorV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "passport",
    {
      displayName: "Passport",
      docClass: product.PassportV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "receipt",
    {
      displayName: "Receipt",
      docClass: product.ReceiptV5,
      allWords: true,
      async: true,
      sync: true,
    },
  ],
  [
    "resume",
    {
      displayName: "Resume",
      docClass: product.ResumeV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "us-bank-check",
    {
      displayName: "US Bank Check",
      docClass: product.us.BankCheckV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
  [
    "us-us-mail",
    {
      displayName: "US US Mail",
      docClass: product.us.UsMailV3,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
]);

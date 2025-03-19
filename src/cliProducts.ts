//
// PRODUCT CONFIGURATION
//
// The Map's key is the command name as it will appear on the console.
//

import * as product from "./product";
import { Inference, StringDict } from "./parsing/common";

export const COMMAND_CUSTOM = "custom";
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
    COMMAND_CUSTOM,
    {
      displayName: "Custom Document",
      docClass: product.CustomV1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
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
    "bill-of-lading",
    {
      displayName: "Bill of Lading",
      docClass: product.BillOfLadingV1,
      allWords: false,
      async: true,
      sync: false,
    },
  ],
  [
    "business-card",
    {
      displayName: "Business Card",
      docClass: product.BusinessCardV1,
      allWords: false,
      async: true,
      sync: false,
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
    "delivery-note",
    {
      displayName: "Delivery note",
      docClass: product.DeliveryNoteV1,
      allWords: false,
      async: true,
      sync: false,
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
    "fr-carte-grise",
    {
      displayName: "FR Carte Grise",
      docClass: product.fr.CarteGriseV1,
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
    "nutrition-facts-label",
    {
      displayName: "Nutrition Facts Label",
      docClass: product.NutritionFactsLabelV1,
      allWords: false,
      async: true,
      sync: false,
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
    "proof-of-address",
    {
      displayName: "Proof of Address",
      docClass: product.ProofOfAddressV1,
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
    "us-healthcare-card",
    {
      displayName: "US Healthcare Card",
      docClass: product.us.HealthcareCardV1,
      allWords: false,
      async: true,
      sync: false,
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
  [
    "us-w9",
    {
      displayName: "US W9",
      docClass: product.us.W9V1,
      allWords: false,
      async: false,
      sync: true,
    },
  ],
]);



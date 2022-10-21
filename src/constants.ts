import {
  CropperV1Response,
  CustomResponse,
  FinancialDocV1Response,
  InvoiceV3Response,
  PassportV1Response,
  ReceiptV3Response,
  ReceiptV4Response,
  Response,
} from "./api";
import {
  DOC_TYPE_CUSTOM,
  DOC_TYPE_FINANCIAL_V1,
  DOC_TYPE_INVOICE_V3,
  DOC_TYPE_PASSPORT_V1,
  DOC_TYPE_RECEIPT_V3,
  DOC_TYPE_RECEIPT_V4,
  DOC_TYPE_CROPPER_V1,
  Document,
} from "./documents";

export interface ProductConfig {
  description: string;
  docType: string;
  responseClass: typeof Response<Document>;
  fullText: boolean;
}

export class ProductConfigs {
  private static configs: Array<ProductConfig> = [
    {
      description: "Invoice V3",
      docType: DOC_TYPE_INVOICE_V3,
      responseClass: InvoiceV3Response,
      fullText: true,
    },
    {
      description: "Expense Receipt V3",
      docType: DOC_TYPE_RECEIPT_V3,
      responseClass: ReceiptV3Response,
      fullText: true,
    },
    {
      description: "Expense Receipt V4",
      docType: DOC_TYPE_RECEIPT_V4,
      responseClass: ReceiptV4Response,
      fullText: true,
    },
    {
      description: "Passport V1",
      docType: DOC_TYPE_PASSPORT_V1,
      responseClass: PassportV1Response,
      fullText: false,
    },
    {
      description: "Financial Document V1 (receipt or invoice)",
      docType: DOC_TYPE_FINANCIAL_V1,
      responseClass: FinancialDocV1Response,
      fullText: true,
    },
    {
      description: "A custom document",
      docType: DOC_TYPE_CUSTOM,
      responseClass: CustomResponse,
      fullText: false,
    },
    {
      description: "Cropper V1",
      docType: DOC_TYPE_CROPPER_V1,
      responseClass: CropperV1Response,
      fullText: false,
    },
  ];

  static getByResponseClassName(responseClass: string): ProductConfig {
    const config = this.configs.find(
      (element) => element.responseClass.name === responseClass
    );
    if (config === undefined) {
      throw `Unknown response class: ${responseClass}`;
    }
    return config;
  }

  static getByDocType(docType: string): ProductConfig {
    const config = this.configs.find((element) => element.docType === docType);
    if (config === undefined) {
      throw `Unknown document type: ${docType}`;
    }
    return config;
  }
}

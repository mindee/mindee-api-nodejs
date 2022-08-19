import {
  CustomResponse,
  FinancialDocResponse,
  InvoiceResponse,
  PassportResponse,
  ReceiptResponse,
  Response,
} from "./api";
import {
  DOC_TYPE_CUSTOM,
  DOC_TYPE_FINANCIAL,
  DOC_TYPE_INVOICE,
  DOC_TYPE_PASSPORT,
  DOC_TYPE_RECEIPT,
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
      description: "Invoice",
      docType: DOC_TYPE_INVOICE,
      responseClass: InvoiceResponse,
      fullText: true,
    },
    {
      description: "Expense Receipt",
      docType: DOC_TYPE_RECEIPT,
      responseClass: ReceiptResponse,
      fullText: true,
    },
    {
      description: "Passport",
      docType: DOC_TYPE_PASSPORT,
      responseClass: PassportResponse,
      fullText: false,
    },
    {
      description: "Financial Document (receipt or invoice)",
      docType: DOC_TYPE_FINANCIAL,
      responseClass: FinancialDocResponse,
      fullText: true,
    },
    {
      description: "A custom document",
      docType: DOC_TYPE_CUSTOM,
      responseClass: CustomResponse,
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

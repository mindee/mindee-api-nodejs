import { Input } from "../inputs";
import {
  Response,
  Endpoint,
  InvoiceEndpoint,
  CustomEndpoint,
  PassportEndpoint,
  ReceiptEndpoint,
} from "../api/index";
import {
  Document,
  Invoice,
  CustomDocument,
  Passport,
  Receipt,
  FinancialDocument,
} from "./index";
import { errorHandler } from "../errors/handler";

interface CustomDocConstructor {
  documentType: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export class DocumentConfig {
  docClass: Document;
  documentType: string;
  endpoints: Array<Endpoint>;

  constructor(docClass: any, documentType: string, endpoints: any) {
    this.docClass = docClass;
    this.documentType = documentType;
    this.endpoints = endpoints;
  }

  async predictRequest(inputDoc: Input, includeWords = false) {
    return await this.endpoints[0].predictRequest(inputDoc, includeWords);
  }

  buildResult(inputFile: Input, response: any) {
    if (response.statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 4);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${response.statusCode} HTTP error: ${errorMessage}`
        )
      );
      return new Response({
        httpResponse: response,
        documentType: this.documentType,
        input: inputFile,
        error: true,
      });
    }
    return new Response({
      httpResponse: response,
      documentType: this.documentType,
      input: inputFile,
      error: false,
    });
  }

  async predict(inputDoc: Input, includeWords: boolean, cutPages: boolean) {
    this.checkApiKeys();
    await inputDoc.init();
    await this.cutDocPages(inputDoc, cutPages);
    const response = await this.predictRequest(inputDoc, includeWords);
    return this.buildResult(inputDoc, response);
  }

  async cutDocPages(inputDoc: Input, cutPages: boolean) {
    if (cutPages && inputDoc.isPdf()) {
      await inputDoc.cutPdf();
    }
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${
            endpoint.keyName
          }', check your Client configuration.
You can set this using the '${endpoint.envVarKeyName()}' environment variable.\n`
        );
      }
    });
  }
}

export class InvoiceConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new InvoiceEndpoint(apiKey)];
    super(Invoice, "invoice", endpoints);
  }
}

export class ReceiptConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new ReceiptEndpoint(apiKey)];
    super(Receipt, "receipt", endpoints);
  }
}

export class FinancialDocConfig extends DocumentConfig {
  constructor(invoiceApiKey: string, receiptApiKey: string) {
    const endpoints = [
      new InvoiceEndpoint(invoiceApiKey),
      new ReceiptEndpoint(receiptApiKey),
    ];
    super(FinancialDocument, "financialDoc", endpoints);
  }

  async predictRequest(inputDoc: Input, includeWords = false) {
    let endpoint: Endpoint;
    if (inputDoc.isPdf()) {
      endpoint = this.endpoints[0];
    } else {
      endpoint = this.endpoints[1];
    }
    return await endpoint.predictRequest(inputDoc, includeWords);
  }
}

export class PassportConfig extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new PassportEndpoint(apiKey)];
    super(Passport, "passport", endpoints);
  }
}

export class CustomDocConfig extends DocumentConfig {
  constructor({
    documentType,
    accountName,
    version,
    apiKey,
  }: CustomDocConstructor) {
    const endpoints = [
      new CustomEndpoint(documentType, accountName, version, apiKey),
    ];
    super(CustomDocument, documentType, endpoints);
  }
}

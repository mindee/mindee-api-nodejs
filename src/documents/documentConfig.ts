import { Input } from "../inputs";
import {
  Response,
  Endpoint,
  InvoiceV3Endpoint,
  CustomEndpoint,
  PassportV1Endpoint,
  ReceiptV3Endpoint,
  ReceiptV4Endpoint,
  CropperV1Endpoint,
  API_KEY_ENVVAR_NAME,
} from "../api";
import {
  DOC_TYPE_CROPPER_V1,
  DOC_TYPE_FINANCIAL_V1,
  DOC_TYPE_INVOICE_V3,
  DOC_TYPE_PASSPORT_V1,
  DOC_TYPE_RECEIPT_V3,
  DOC_TYPE_RECEIPT_V4,
  Document,
} from "./index";
import { errorHandler } from "../errors/handler";
import { ResponseProps } from "../api/response";
import { PageOptions } from "../inputs/PageOptions";

interface CustomDocConstructor {
  documentType: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export type responseSig<RespType extends Response<Document>> = {
  new ({ httpResponse, documentType, input, error }: ResponseProps): RespType;
};

export class DocumentConfig {
  readonly documentType: string;
  readonly endpoints: Array<Endpoint>;

  constructor(documentType: string, endpoints: Array<Endpoint>) {
    this.documentType = documentType;
    this.endpoints = endpoints;
  }

  async predictRequest(
    inputDoc: Input,
    includeWords: boolean,
    cropping: boolean
  ) {
    return await this.endpoints[0].predictRequest(
      inputDoc,
      includeWords,
      cropping
    );
  }

  buildResult<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    inputFile: Input,
    response: any
  ): RespType {
    if (response.statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 4);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${response.statusCode} HTTP error: ${errorMessage}`
        )
      );
      return new responseType({
        httpResponse: response,
        documentType: this.documentType,
        input: inputFile,
        error: true,
      });
    }
    return new responseType({
      httpResponse: response,
      documentType: this.documentType,
      input: inputFile,
      error: false,
    });
  }

  async predict<RespType extends Response<Document>>(
    responseType: responseSig<RespType>,
    params: {
      inputDoc: Input;
      includeWords: boolean;
      pageOptions?: PageOptions;
      cropper: boolean;
    }
  ): Promise<RespType> {
    this.checkApiKeys();
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.predictRequest(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );
    return this.buildResult(responseType, params.inputDoc, response);
  }

  async cutDocPages(inputDoc: Input, pageOptions: PageOptions) {
    if (inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${this.documentType}', check your Client configuration.
You can set this using the '${API_KEY_ENVVAR_NAME}' environment variable.\n`
        );
      }
    });
  }
}

export class InvoiceV3Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new InvoiceV3Endpoint(apiKey)];
    super(DOC_TYPE_INVOICE_V3, endpoints);
  }
}

export class ReceiptV3Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new ReceiptV3Endpoint(apiKey)];
    super(DOC_TYPE_RECEIPT_V3, endpoints);
  }
}

export class ReceiptV4Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new ReceiptV4Endpoint(apiKey)];
    super(DOC_TYPE_RECEIPT_V4, endpoints);
  }
}

export class FinancialDocV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [
      new InvoiceV3Endpoint(apiKey),
      new ReceiptV3Endpoint(apiKey),
    ];
    super(DOC_TYPE_FINANCIAL_V1, endpoints);
  }

  async predictRequest(
    inputDoc: Input,
    includeWords: boolean,
    cropping: boolean
  ) {
    let endpoint: Endpoint;
    if (inputDoc.isPdf()) {
      endpoint = this.endpoints[0];
    } else {
      endpoint = this.endpoints[1];
    }
    return await endpoint.predictRequest(inputDoc, includeWords, cropping);
  }
}

export class PassportV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new PassportV1Endpoint(apiKey)];
    super(DOC_TYPE_PASSPORT_V1, endpoints);
  }
}

export class CropperV1Config extends DocumentConfig {
  constructor(apiKey: string) {
    const endpoints = [new CropperV1Endpoint(apiKey)];
    super(DOC_TYPE_CROPPER_V1, endpoints);
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
    super(documentType, endpoints);
  }
}

import { InputSource } from "../inputs";
import {
  Response,
  Endpoint,
  CustomEndpoint,
  StandardEndpoint,
  predictResponse,
  API_KEY_ENVVAR_NAME,
} from "../api";
import { Document, FinancialDocumentV0, CustomV1, DocumentSig } from "./index";
import { errorHandler } from "../errors/handler";
import { PageOptions } from "../inputs";
import { PredictEnqueueResponse } from "@mindee/api/predictEnqueueResponse";

interface CustomDocConstructor {
  endpointName: string;
  accountName: string;
  version: string;
  apiKey: string;
}

export class DocumentConfig<DocType extends Document> {
  readonly documentType: string | undefined;
  readonly endpoints: Array<Endpoint>;
  readonly documentClass: DocumentSig<DocType>;

  constructor(
    documentClass: DocumentSig<DocType>,
    endpoints: Array<Endpoint>,
    documentType?: string
  ) {
    this.documentType = documentType;
    this.endpoints = endpoints;
    this.documentClass = documentClass;
  }

  protected async predictRequest(
    inputDoc: InputSource,
    includeWords: boolean,
    cropping: boolean
  ) {
    return await this.endpoints[0].predictReqPost(
      inputDoc,
      includeWords,
      cropping
    );
  }

  buildResult(
    inputFile: InputSource,
    response: predictResponse
  ): Response<DocType> {
    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 2);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${statusCode} HTTP error: ${errorMessage}`
        )
      );
      return new Response<DocType>(this.documentClass, {
        httpResponse: response,
        documentType: this.documentType,
        input: inputFile,
        error: true,
      });
    }
    return new Response<DocType>(this.documentClass, {
      httpResponse: response,
      documentType: this.documentType,
      input: inputFile,
      error: false,
    });
  }

  async predict(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<Response<DocType>> {
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
    return this.buildResult(params.inputDoc, response);
  }

  async enqueuePredict(params: {
    inputDoc: InputSource;
    includeWords: boolean;
    pageOptions?: PageOptions;
    cropper: boolean;
  }): Promise<PredictEnqueueResponse> {
    this.checkApiKeys();
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.enqueuePredictRequest(
      params.inputDoc,
      params.includeWords,
      params.cropper
    );

    const statusCode = response.messageObj.statusCode;
    if (statusCode === undefined || statusCode > 201) {
      const errorMessage = JSON.stringify(response.data, null, 2);
      errorHandler.throw(
        new Error(
          `${this.endpoints[0].urlName} API ${statusCode} HTTP error: ${errorMessage}`
        )
      );
    }

    return new PredictEnqueueResponse({
      id: response.data.job.id,
      issuedAt: response.data.job.issued_at,
      availableAt: response.data.available_at,
    });
  }

  protected async enqueuePredictRequest(
    inputDoc: InputSource,
    includeWords: boolean,
    cropping: boolean
  ) {
    return await this.endpoints[0].predictAsyncReqPost(
      inputDoc,
      includeWords,
      cropping
    );
  }

  async cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  protected checkApiKeys() {
    this.endpoints.forEach((endpoint) => {
      if (!endpoint.apiKey) {
        throw new Error(
          `Missing API key for '${endpoint.urlName} ${endpoint.version}', check your Client configuration.
You can set this using the '${API_KEY_ENVVAR_NAME}' environment variable.\n`
        );
      }
    });
  }
}

export class CustomDocConfig extends DocumentConfig<CustomV1> {
  constructor({
    endpointName,
    accountName,
    version,
    apiKey,
  }: CustomDocConstructor) {
    const endpoints = [
      new CustomEndpoint(endpointName, accountName, version, apiKey),
    ];
    super(CustomV1, endpoints, endpointName);
  }
}

export class FinancialDocV0Config extends DocumentConfig<FinancialDocumentV0> {
  constructor(apiKey: string) {
    const endpoints = [
      new StandardEndpoint("invoices", "3", apiKey),
      new StandardEndpoint("expense_receipts", "3", apiKey),
    ];
    super(FinancialDocumentV0, endpoints);
  }

  protected async predictRequest(
    inputDoc: InputSource,
    includeWords: boolean,
    cropping: boolean
  ) {
    let endpoint: Endpoint;
    if (inputDoc.isPdf()) {
      endpoint = this.endpoints[0];
    } else {
      endpoint = this.endpoints[1];
    }
    return await endpoint.predictReqPost(inputDoc, includeWords, cropping);
  }
}

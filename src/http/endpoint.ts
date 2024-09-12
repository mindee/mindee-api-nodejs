import { RequestOptions } from "https";
import { URLSearchParams } from "url";
import FormData from "form-data";
import { InputSource } from "../input";
import { PageOptions } from "../input";
import { LocalInputSource } from "../input/base";
import { handleError } from "./error";
import { ApiSettings } from "./apiSettings";
import { BaseEndpoint, EndpointResponse } from "./baseEndpoint";
import { StringDict } from "../parsing/common";
import { ClientRequest } from "http";
import { isValidAsyncResponse, isValidSyncResponse } from "./responseValidation";

export interface PredictParams {
  inputDoc: InputSource;
  includeWords: boolean;
  fullText: boolean;
  pageOptions?: PageOptions;
  cropper: boolean;
}

/**
 * Endpoint for a product (OTS or Custom).
 */
export class Endpoint extends BaseEndpoint {
  /** URL of a product. */
  urlName: string;
  /** Account owning the product. */
  owner: string;
  /** Product's version, as a string. */
  version: string;
  /** Entire root of the URL for API calls. */
  urlRoot: string;

  constructor(
    urlName: string,
    owner: string,
    version: string,
    settings: ApiSettings
  ) {
    super(settings);
    this.owner = owner;
    this.urlName = urlName;
    this.version = version;
    this.urlRoot = `/v1/products/${owner}/${urlName}/v${version}`;
  }

  /**a
   * Sends a prediction to the API and parses out the result.
   * Throws an error if the server's response contains one.
   * @param {PredictParams} params parameters relating to prediction options.
   * @category Synchronous
   * @returns a `Promise` containing parsing results.
   */
  async predict(params: PredictParams): Promise<EndpointResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.#cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictReqPost(
      params.inputDoc,
      params.includeWords,
      params.fullText,
      params.cropper
    );
    if (!isValidSyncResponse(response)) {
      handleError(this.urlName, response, response.messageObj?.statusMessage);
    }

    return response;
  }

  /**
   * Enqueues a prediction to the API.
   * Throws an error if the server's response contains one.
   * @param {PredictParams} params parameters relating to prediction options.
   * @category Asynchronous
   * @returns a `Promise` containing queue data.
   */
  async predictAsync(params: PredictParams): Promise<EndpointResponse> {
    await params.inputDoc.init();
    if (params.pageOptions !== undefined) {
      await this.#cutDocPages(params.inputDoc, params.pageOptions);
    }
    const response = await this.#predictAsyncReqPost(
      params.inputDoc,
      params.includeWords,
      params.fullText,
      params.cropper
    );
    if (!isValidAsyncResponse(response)) {
      handleError(this.urlName, response, response.messageObj?.statusMessage);
    }
    return response;
  }

  /**
   * Requests the results of a queued document from the API.
   * Throws an error if the server's response contains one.
   * @param queueId The document's ID in the queue.
   * @category Asynchronous
   * @returns a `Promise` containing the parsed result.
   */
  async getQueuedDocument(queueId: string): Promise<EndpointResponse> {
    const queueResponse: EndpointResponse = await this.#documentQueueReqGet(queueId);
    const queueStatusCode = queueResponse.messageObj.statusCode;
    if (!isValidAsyncResponse(queueResponse)) {
      handleError(this.urlName, queueResponse, queueResponse.messageObj?.statusMessage);
    }
    if (
      queueStatusCode === 302 &&
      queueResponse.messageObj.headers.location !== undefined
    ) {
      const docId = queueResponse.messageObj.headers.location.split("/").pop();
      if (docId !== undefined) {
        return await this.#documentGetReq(docId);
      }
    }
    return queueResponse;
  }

  /**
   * Send a feedback
   * @param {string} documentId
   */
  async getDocument(documentId: string): Promise<EndpointResponse> {
    const response = await this.#documentGetReq(
      documentId,
    );
    if (!isValidAsyncResponse(response)) {
      handleError("document", response, response.messageObj?.statusMessage);
    }

    return response;
  }

  /**
   * Send a feedback
   * @param {string} documentId - ID of the document to send feedback to.
   * @param {StringDict} feedback - Feedback object to send.
   */
  async sendFeedback(
    documentId: string,
    feedback: StringDict
  ): Promise<EndpointResponse> {
    const response: EndpointResponse = await this.#documentFeedbackPutReq(
      documentId,
      feedback,
    );
    if (!isValidSyncResponse(response)) {
      handleError("feedback", response, response.messageObj?.statusMessage);
    }

    return response;
  }

  /**
   * Send a file to a prediction API.
   * @param input
   * @param predictUrl
   * @param includeWords
   * @param fullText
   * @param cropper
   */
  protected sendFileForPrediction(
    input: InputSource,
    predictUrl: string,
    includeWords: boolean = false,
    fullText: boolean = false,
    cropper: boolean = false
  ): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const searchParams = new URLSearchParams();
      if (cropper) {
        searchParams.append("cropper", "true");
      }
      if (fullText) {
        searchParams.append("full_text_ocr", "true");
      }

      const form = new FormData();
      if (input instanceof LocalInputSource && input.fileObject instanceof Buffer) {
        form.append("document", input.fileObject, {
          filename: input.filename,
        });
      } else {
        form.append("document", input.fileObject);
      }

      if (includeWords) {
        form.append("include_mvision", "true");
      }
      const headers = { ...this.settings.baseHeaders, ...form.getHeaders() };

      let path = `${this.urlRoot}/${predictUrl}`;
      if (searchParams.toString().length > 0) {
        path += `?${searchParams}`;
      }
      const options: RequestOptions = {
        method: "POST",
        headers: headers,
        hostname: this.settings.hostname,
        path: path,
      };
      const req = this.readResponse(options, resolve, reject);
      form.pipe(req);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  /**
   * Cuts a document's pages according to the given options.
   * @param inputDoc input document.
   * @param pageOptions page cutting options.
   */
  async #cutDocPages(inputDoc: InputSource, pageOptions: PageOptions) {
    if (inputDoc instanceof LocalInputSource && inputDoc.isPdf()) {
      await inputDoc.cutPdf(pageOptions);
    }
  }

  /**
   * Make a request to POST a document for prediction.
   * @param input
   * @param includeWords
   * @param fullText
   * @param cropper
   */
  #predictReqPost(
    input: InputSource,
    includeWords = false,
    fullText = false,
    cropper = false
  ): Promise<EndpointResponse> {
    return this.sendFileForPrediction(input, "predict", includeWords, fullText, cropper);
  }

  /**
   * Make a request to POST a document for async prediction.
   * @param input
   * @param includeWords
   * @param fullText
   * @param cropper
   */
  #predictAsyncReqPost(
    input: InputSource,
    includeWords = false,
    fullText = false,
    cropper = false
  ): Promise<EndpointResponse> {
    return this.sendFileForPrediction(
      input,
      "predict_async",
      includeWords,
      fullText,
      cropper
    );
  }

  /**
   * Make a request to GET the status of a document in the queue.
   * @param queueId
   */
  #documentQueueReqGet(queueId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
        path: `${this.urlRoot}/documents/queue/${queueId}`,
      };
      const req = this.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  /**
   * Make a request to GET a document.
   * @param documentId
   */
  #documentGetReq(documentId: string): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "GET",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
        path: `${this.urlRoot}/documents/${documentId}`,
      };
      const req = this.readResponse(options, resolve, reject);
      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }

  /**
   * Make a request to PUT a document feedback.
   * @param documentId
   * @param feedback
   */
  #documentFeedbackPutReq(documentId: string, feedback: StringDict): Promise<EndpointResponse> {
    return new Promise((resolve, reject) => {
      const options = {
        method: "PUT",
        headers: this.settings.baseHeaders,
        hostname: this.settings.hostname,
        path: `/v1/documents/${documentId}/feedback`,
      };
      const req: ClientRequest = this.readResponse(options, resolve, reject);
      req.write(JSON.stringify(feedback));

      // potential ECONNRESET if we don't end the request.
      req.end();
    });
  }
}
